/**
 * ICGTMP form intake - Google Apps Script web app.
 *
 * Deploy as a Web app: Execute as Me, Who has access: Anyone.
 * Paste the /exec URL into VITE_SHEET_ENDPOINT on the website.
 *
 * This file is the authority on what a valid submission is. src/lib/validation.ts
 * mirrors these rules so the visitor gets immediate feedback; nothing the client
 * sends is trusted here.
 *
 * Responses are always JSON: { ok, code, field?, error?, reference?, retryAfter? }
 * `code` is the stable contract the website switches on. `error` is human copy.
 */

var SHEET_ID = '1856ZQHjnrOW1ez1V6GUQ_YUDAOpOery26nvSW7FRuQc';

// Optional. Set to an address to receive a notification per submission.
var NOTIFY_EMAIL = '';

var MEMBERS_TAB = 'Members';
var MESSAGES_TAB = 'Messages';

/**
 * Canonical columns. Rows are written by header NAME, never by position, so a
 * sheet whose columns were reordered by hand still fills correctly. Headers
 * listed here that are missing from an existing sheet are appended on the
 * right, which never shifts data that is already there.
 */
var MEMBERS_HEADERS = [
  'Timestamp',
  'Full Name',
  'Phone',
  'Email',
  'LGA',
  'LCDA',
  'Ward',
  'Profession / Trade',
  'Market / Association',
  'Membership Category',
  'Volunteer Interest',
  'Source',
  'Status',
  'Reference',
  'Submission ID',
];

var MESSAGES_HEADERS = [
  'Timestamp',
  'Full Name',
  'Email',
  'Message',
  'Source',
  'Status',
  'Reference',
  'Submission ID',
];

var LIMITS = {
  fullName: 120,
  email: 160,
  phone: 24,
  ward: 80,
  profession: 120,
  marketAssociation: 160,
  volunteerInterest: 1000,
  message: 4000,
  source: 80,
  submissionId: 64,
};

var LGA_DIRECTORY = {
  'Shomolu': ['Shomolu LG', 'Bariga LCDA'],
  'Kosofe': ['Kosofe LG', 'Agboyi-Ketu LCDA', 'Ikosi-Isheri LCDA'],
  'Ikorodu': [
    'Ikorodu LG',
    'Igbogbo-Baiyeku LCDA',
    'Ijede LCDA',
    'Ikorodu North LCDA',
    'Ikorodu West LCDA',
    'Imota LCDA'
  ],
  'Epe': ['Epe LG', 'Eredo LCDA', 'Ikosi-Ejinrin LCDA'],
  'Ibeju-Lekki': ['Ibeju-Lekki LG', 'Lekki LCDA'],
};

var CATEGORIES = [
  'Markets & Traders',
  'Artisans & Skilled Workers',
  'Professionals & SMEs',
  'Women & Youth',
  'Volunteer',
  'Partner/Stakeholder',
];

var DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'sharklasers.com',
  'tempmail.com',
  'throwawaymail.com',
  'trashmail.com',
  'yopmail.com',
];

/**
 * Rate limiting.
 *
 * Apps Script cannot see the caller's IP address, so there is no per-visitor
 * limit to be had here. What we can do is throttle per identity (the phone and
 * email being submitted) and keep a global brake for the whole script. That
 * stops accidental floods and casual abuse; it does not stop a determined
 * attacker rotating identities. If that ever happens, put Cloudflare Turnstile
 * or reCAPTCHA in front of the form - that is the only real fix.
 */
var IDENTITY_MAX = 3;
var IDENTITY_WINDOW_SECONDS = 3600;
var GLOBAL_MAX = 60;
var GLOBAL_WINDOW_SECONDS = 600;

/** How long a completed submission ID is remembered, to absorb retries. */
var IDEMPOTENCY_TTL_SECONDS = 21600;

/** Submissions faster than this were not typed by a person. */
var MIN_FILL_MS = 2000;

function doGet() {
  return json_({ ok: true, service: 'icgtmp-forms', time: new Date().toISOString() });
}

function doPost(e) {
  try {
    var body = parseBody_(e);

    // Bots that fill the hidden field get a success and no row, so the script
    // gives away nothing about why it was ignored.
    if (String(body.website || '').trim()) return json_({ ok: true, code: 'CREATED' });

    // Same treatment for a form "filled in" faster than a person can type.
    var elapsed = Number(body.elapsedMs || 0);
    if (elapsed > 0 && elapsed < MIN_FILL_MS) return json_({ ok: true, code: 'CREATED' });

    var form = String(body.form || '').trim();
    if (form !== 'membership' && form !== 'message') {
      return json_({ ok: false, code: 'UNKNOWN_FORM', error: 'This form type is not recognised.' });
    }

    var submissionId = clip_(body.submissionId, LIMITS.submissionId);

    // A retry of something that already succeeded returns the original result
    // instead of writing a second row.
    var replay = submissionId ? CacheService.getScriptCache().get('idem:' + submissionId) : null;
    if (replay) {
      return json_({ ok: true, code: 'CREATED', reference: replay, replayed: true });
    }

    var globalCheck = checkGlobalRate_();
    if (!globalCheck.allowed) return json_(globalCheck.response);

    return form === 'membership'
      ? handleMembership_(body, submissionId)
      : handleMessage_(body, submissionId);
  } catch (err) {
    console.error(err);
    return json_({
      ok: false,
      code: 'SERVER_ERROR',
      error: 'Something went wrong on our side. Please try again.',
    });
  }
}

/**
 * Run once from the Apps Script editor. Creates both tabs, adds any columns
 * this version introduced to sheets that already exist, and writes one
 * deletable test row per tab.
 */
function setupCheck() {
  var members = ensureTab_(MEMBERS_TAB, MEMBERS_HEADERS);
  var messages = ensureTab_(MESSAGES_TAB, MESSAGES_HEADERS);

  appendRow_(members, {
    'Timestamp': new Date(),
    'Full Name': 'TEST ROW - DELETE',
    'Phone': '+2348030000000',
    'Email': 'test@icgtmp.org',
    'LGA': 'Epe',
    'LCDA': 'Eredo LCDA',
    'Membership Category': 'Volunteer',
    'Source': 'setupCheck',
    'Status': 'New',
    'Reference': 'TEST',
  });
  appendRow_(messages, {
    'Timestamp': new Date(),
    'Full Name': 'TEST ROW - DELETE',
    'Email': 'test@icgtmp.org',
    'Message': 'Setup check. Delete this row.',
    'Source': 'setupCheck',
    'Status': 'New',
    'Reference': 'TEST',
  });
}

/**
 * Safe to run on a sheet that already holds real rows: adds missing columns
 * only. Run it after pulling a version of this file that adds a column.
 */
function migrateHeaders() {
  ensureTab_(MEMBERS_TAB, MEMBERS_HEADERS);
  ensureTab_(MESSAGES_TAB, MESSAGES_HEADERS);
}

/* -------------------------------------------------------------- handlers -- */

function handleMembership_(body, submissionId) {
  var fullName = clip_(body.fullName, LIMITS.fullName);
  var email = normalizeEmail_(body.email);
  var phone = normalizeNgPhone_(body.phone);
  var lga = clip_(body.lga, 80);
  var lcda = clip_(body.lcda, 80);
  var ward = clip_(body.ward, LIMITS.ward);
  var profession = clip_(body.profession, LIMITS.profession);
  var marketAssociation = clip_(body.marketAssociation, LIMITS.marketAssociation);
  var category = clip_(body.category, 80);
  var volunteerInterest = String(body.volunteerInterest == null ? '' : body.volunteerInterest).trim();
  var source = clip_(body.source || 'website', LIMITS.source);

  var invalid =
    checkFullName_(fullName) ||
    checkPhoneRaw_(body.phone, phone) ||
    checkEmail_(email) ||
    checkLga_(lga, lcda) ||
    checkCategory_(category) ||
    checkMax_('volunteerInterest', volunteerInterest, LIMITS.volunteerInterest);
  if (invalid) return json_(invalid);

  // Volunteers are asked what they want to do, so an empty answer is not useful.
  if (category === 'Volunteer' && volunteerInterest.length < 4) {
    return json_(fail_('INVALID_FIELD', 'volunteerInterest', 'Tell us how you would like to volunteer.'));
  }

  var identity = checkIdentityRate_(email + '|' + phone);
  if (!identity.allowed) return json_(identity.response);

  var sheet = ensureTab_(MEMBERS_TAB, MEMBERS_HEADERS);
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return json_({ ok: false, code: 'BUSY', error: 'The register is busy. Please try again.' });
  }
  try {
    // Held inside the lock so two simultaneous submissions cannot both pass.
    var existing = findExistingMember_(sheet, email, phone);
    if (existing) {
      return json_({
        ok: true,
        code: 'DUPLICATE',
        field: existing.field,
        reference: existing.reference,
        error:
          existing.field === 'email'
            ? 'This email address is already on the register.'
            : 'This phone number is already on the register.',
      });
    }

    var reference = newReference_();
    appendRow_(sheet, {
      'Timestamp': new Date(),
      'Full Name': fullName,
      'Phone': phone,
      'Email': email,
      'LGA': lga,
      'LCDA': lcda,
      'Ward': ward,
      'Profession / Trade': profession,
      'Market / Association': marketAssociation,
      'Membership Category': category,
      'Volunteer Interest': volunteerInterest,
      'Source': source,
      'Status': 'New',
      'Reference': reference,
      'Submission ID': submissionId,
    });
  } finally {
    lock.releaseLock();
  }

  rememberSubmission_(submissionId, reference);
  maybeNotify_('New ICGTMP membership interest', fullName + ' - ' + phone + ' (' + reference + ')');
  return json_({ ok: true, code: 'CREATED', reference: reference });
}

function handleMessage_(body, submissionId) {
  var fullName = clip_(body.fullName, LIMITS.fullName);
  var email = normalizeEmail_(body.email);
  var message = String(body.message == null ? '' : body.message).trim();
  var source = clip_(body.source || 'website', LIMITS.source);

  var invalid =
    checkFullName_(fullName) ||
    checkEmail_(email) ||
    checkMax_('message', message, LIMITS.message);
  if (invalid) return json_(invalid);

  if (message.length < 8) {
    return json_(fail_('INVALID_FIELD', 'message', 'Enter a short message.'));
  }

  var identity = checkIdentityRate_('msg|' + email);
  if (!identity.allowed) return json_(identity.response);

  var sheet = ensureTab_(MESSAGES_TAB, MESSAGES_HEADERS);
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return json_({ ok: false, code: 'BUSY', error: 'The form is busy. Please try again.' });
  }
  var reference = newReference_();
  try {
    appendRow_(sheet, {
      'Timestamp': new Date(),
      'Full Name': fullName,
      'Email': email,
      'Message': message,
      'Source': source,
      'Status': 'New',
      'Reference': reference,
      'Submission ID': submissionId,
    });
  } finally {
    lock.releaseLock();
  }

  rememberSubmission_(submissionId, reference);
  maybeNotify_('New ICGTMP contact message', fullName + ' (' + reference + ')');
  return json_({ ok: true, code: 'CREATED', reference: reference });
}

/* ------------------------------------------------------------ validation -- */

function checkFullName_(value) {
  if (!value) return fail_('INVALID_FIELD', 'fullName', 'Enter your full name.');
  if (value.length < 3) return fail_('INVALID_FIELD', 'fullName', 'Enter your full name.');
  if (!/\s/.test(value)) {
    return fail_('INVALID_FIELD', 'fullName', 'Enter both your first and last name.');
  }
  return null;
}

function checkPhoneRaw_(raw, normalized) {
  if (!String(raw || '').trim()) {
    return fail_('INVALID_FIELD', 'phone', 'Enter your phone number.');
  }
  if (!normalized) {
    return fail_(
      'INVALID_FIELD',
      'phone',
      'Enter a valid Nigerian mobile number, e.g. 0803 000 0000.'
    );
  }
  return null;
}

function checkEmail_(email) {
  if (!email) return fail_('INVALID_FIELD', 'email', 'Enter your email address.');
  if (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
    return fail_('INVALID_FIELD', 'email', 'Enter a valid email address.');
  }
  var domain = email.split('@')[1] || '';
  if (DISPOSABLE_DOMAINS.indexOf(domain) !== -1) {
    return fail_('INVALID_FIELD', 'email', 'Use an email address you check regularly.');
  }
  return null;
}

function checkLga_(lga, lcda) {
  if (!lga) return fail_('INVALID_FIELD', 'lga', 'Select your LGA.');
  var lcdas = LGA_DIRECTORY[lga];
  if (!lcdas) return fail_('INVALID_FIELD', 'lga', 'Select your LGA from the list.');
  if (!lcda) return fail_('INVALID_FIELD', 'lcda', 'Select your LCDA or LG.');
  if (lcdas.indexOf(lcda) === -1) {
    return fail_('INVALID_FIELD', 'lcda', 'That LCDA or LG is not in the selected LGA.');
  }
  return null;
}

function checkCategory_(category) {
  if (!category) return fail_('INVALID_FIELD', 'category', 'Select a membership category.');
  if (CATEGORIES.indexOf(category) === -1) {
    return fail_('INVALID_FIELD', 'category', 'Select a membership category from the list.');
  }
  return null;
}

/** Rejects rather than silently truncating, so nobody loses the end of an answer. */
function checkMax_(field, value, max) {
  if (value.length > max) {
    return fail_('INVALID_FIELD', field, 'Keep this under ' + max + ' characters.');
  }
  return null;
}

function fail_(code, field, error) {
  return { ok: false, code: code, field: field, error: error };
}

/* ---------------------------------------------------------- rate limiting -- */

function checkIdentityRate_(identity) {
  var key = 'rl:' + hash_(identity);
  var cache = CacheService.getScriptCache();
  var count = Number(cache.get(key) || '0');
  if (count >= IDENTITY_MAX) {
    return {
      allowed: false,
      response: {
        ok: false,
        code: 'RATE_LIMITED',
        retryAfter: IDENTITY_WINDOW_SECONDS,
        error: 'You have submitted this form several times already. Please try again later.',
      },
    };
  }
  // Re-putting the key extends its window; acceptable for a coarse brake.
  cache.put(key, String(count + 1), IDENTITY_WINDOW_SECONDS);
  return { allowed: true };
}

function checkGlobalRate_() {
  var cache = CacheService.getScriptCache();
  var count = Number(cache.get('rl:global') || '0');
  if (count >= GLOBAL_MAX) {
    return {
      allowed: false,
      response: {
        ok: false,
        code: 'RATE_LIMITED',
        retryAfter: GLOBAL_WINDOW_SECONDS,
        error: 'The form is receiving a lot of traffic. Please try again in a few minutes.',
      },
    };
  }
  cache.put('rl:global', String(count + 1), GLOBAL_WINDOW_SECONDS);
  return { allowed: true };
}

function rememberSubmission_(submissionId, reference) {
  if (!submissionId) return;
  CacheService.getScriptCache().put('idem:' + submissionId, reference, IDEMPOTENCY_TTL_SECONDS);
}

/* ----------------------------------------------------------------- sheet -- */

function ensureTab_(name, headers) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return sheet;
  }

  // Append any header this version added, without disturbing existing columns.
  var width = sheet.getLastColumn();
  var current = sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
  var missing = headers.filter(function (header) {
    return current.indexOf(header) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, width + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
  }
  return sheet;
}

function headerIndex_(sheet) {
  var width = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var index = {};
  for (var i = 0; i < headers.length; i++) index[String(headers[i])] = i;
  return index;
}

/** Writes a row by column name, so column order in the sheet does not matter. */
function appendRow_(sheet, values) {
  var index = headerIndex_(sheet);
  var row = new Array(sheet.getLastColumn()).fill('');
  for (var key in values) {
    if (index[key] === undefined) continue;
    row[index[key]] = values[key];
  }
  sheet.appendRow(row);
}

/**
 * Looks for the email or the phone anywhere in the register - not just in a
 * recent window, because "have they signed up before" has no expiry.
 */
function findExistingMember_(sheet, email, phone) {
  var last = sheet.getLastRow();
  if (last < 2) return null;

  var index = headerIndex_(sheet);
  var emailCol = index['Email'];
  var phoneCol = index['Phone'];
  var refCol = index['Reference'];
  if (emailCol === undefined || phoneCol === undefined) return null;

  // Only the columns we compare are read. Pulling the whole sheet would cost
  // one cell per column per member and get slow as the register grows.
  var height = last - 1;
  var emails = sheet.getRange(2, emailCol + 1, height, 1).getValues();
  var phones = sheet.getRange(2, phoneCol + 1, height, 1).getValues();
  var refs = refCol === undefined ? null : sheet.getRange(2, refCol + 1, height, 1).getValues();

  for (var i = 0; i < height; i++) {
    var matched =
      String(emails[i][0] || '').trim().toLowerCase() === email
        ? 'email'
        : normalizeNgPhone_(phones[i][0]) === phone
          ? 'phone'
          : '';
    if (matched) {
      return { field: matched, reference: refs ? String(refs[i][0] || '') : '' };
    }
  }
  return null;
}

/* ----------------------------------------------------------------- utils -- */

function parseBody_(e) {
  var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  var parsed = JSON.parse(raw);
  return parsed && typeof parsed === 'object' ? parsed : {};
}

function normalizeNgPhone_(raw) {
  var digits = String(raw == null ? '' : raw).replace(/\D/g, '');
  if (digits.indexOf('234') === 0) digits = digits.substring(3);
  else if (digits.charAt(0) === '0') digits = digits.substring(1);
  return /^[789][01]\d{8}$/.test(digits) ? '+234' + digits : '';
}

function normalizeEmail_(raw) {
  return String(raw == null ? '' : raw).trim().toLowerCase().substring(0, LIMITS.email);
}

function clip_(value, max) {
  return String(value == null ? '' : value).trim().substring(0, max);
}

/** Short, human-quotable receipt. Submission ID is the real key. */
function newReference_() {
  var stamp = Date.now().toString(36).toUpperCase().slice(-5);
  var salt = Math.floor(Math.random() * 1296).toString(36).toUpperCase();
  return 'ICG-' + stamp + (salt.length < 2 ? '0' + salt : salt);
}

function hash_(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(value));
  return bytes
    .map(function (b) {
      return ((b & 0xff) + 0x100).toString(16).slice(1);
    })
    .join('');
}

function maybeNotify_(subject, detail) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(NOTIFY_EMAIL, subject, detail);
  } catch (err) {
    // A failed notification must never lose the row that was just written.
    console.error(err);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
