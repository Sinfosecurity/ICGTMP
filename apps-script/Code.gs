/**
 * ICGTMP form intake — Google Apps Script web app.
 *
 * Deploy as a Web app: Execute as Me, Who has access: Anyone.
 * Paste the /exec URL into VITE_SHEET_ENDPOINT on the website.
 */

var SHEET_ID = '1ZN7u3R30E-OatLlzLnn0IyAav8aFL9q9SQv5aXR-QyQ';

// Set this only if we later drop FormSubmit. Leave empty while FormSubmit
// remains the email notification path.
var NOTIFY_EMAIL = '';

var MEMBERS_TAB = 'Members';
var MESSAGES_TAB = 'Messages';

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
];

var MESSAGES_HEADERS = [
  'Timestamp',
  'Full Name',
  'Email',
  'Message',
  'Source',
  'Status',
];

var LIMITS = {
  fullName: 120,
  email: 160,
  phone: 24,
  lga: 80,
  lcda: 80,
  ward: 80,
  profession: 120,
  marketAssociation: 160,
  category: 80,
  volunteerInterest: 1000,
  message: 4000,
  source: 80,
};

var BURST_MAX = 30;
var BURST_WINDOW_SECONDS = 600;
var DEDUPE_HOURS = 24;
var DEDUPE_SCAN_ROWS = 500;

function doGet() {
  return json_({
    ok: true,
    service: 'icgtmp-forms',
    time: new Date().toISOString(),
  });
}

function doPost(e) {
  try {
    var body = parseBody_(e);

    // Bots filling the hidden website field get a success and no row.
    if (String(body.website || '').trim()) {
      return json_({ ok: true });
    }

    if (!allowBurst_()) {
      return json_({ ok: false, error: 'Please wait a few minutes and try again.' });
    }

    var form = String(body.form || '').trim();
    if (form === 'membership') {
      return handleMembership_(body);
    }
    if (form === 'message') {
      return handleMessage_(body);
    }
    return json_({ ok: false, error: 'This form type is not recognised.' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Something went wrong. Please try again.' });
  }
}

/**
 * Run once from the Apps Script editor to create both tabs and a deletable test row.
 */
function setupCheck() {
  var members = ensureTab_(MEMBERS_TAB, MEMBERS_HEADERS);
  var messages = ensureTab_(MESSAGES_TAB, MESSAGES_HEADERS);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    members.appendRow([
      new Date(),
      'TEST ROW — DELETE',
      '+2348030000000',
      'test@icgtmp.org',
      'Epe',
      'Eredo',
      '',
      '',
      '',
      'Volunteer',
      '',
      'setupCheck',
      'New',
    ]);
    messages.appendRow([
      new Date(),
      'TEST ROW — DELETE',
      'test@icgtmp.org',
      'Setup check. Delete this row.',
      'setupCheck',
      'New',
    ]);
  } finally {
    lock.releaseLock();
  }
}

function handleMembership_(body) {
  var fullName = clip_(body.fullName, LIMITS.fullName);
  var email = clip_(body.email, LIMITS.email).toLowerCase();
  var phone = normalizeNgPhone_(body.phone);
  var lga = clip_(body.lga, LIMITS.lga);
  var lcda = clip_(body.lcda, LIMITS.lcda);
  var ward = clip_(body.ward, LIMITS.ward);
  var profession = clip_(body.profession, LIMITS.profession);
  var marketAssociation = clip_(body.marketAssociation, LIMITS.marketAssociation);
  var category = clip_(body.category, LIMITS.category);
  var volunteerInterest = clip_(body.volunteerInterest, LIMITS.volunteerInterest);
  var source = clip_(body.source || 'website', LIMITS.source);

  if (!fullName) return json_({ ok: false, error: 'Enter your full name.' });
  if (!phone) {
    return json_({
      ok: false,
      error: 'Enter a valid Nigerian phone number.',
    });
  }
  if (!isEmail_(email)) return json_({ ok: false, error: 'Enter a valid email address.' });
  if (!lga) return json_({ ok: false, error: 'Select your LGA.' });
  if (!lcda) return json_({ ok: false, error: 'Select your LCDA.' });
  if (!category) return json_({ ok: false, error: 'Select a membership category.' });

  var sheet = ensureTab_(MEMBERS_TAB, MEMBERS_HEADERS);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (isDuplicateMembership_(sheet, phone)) {
      return json_({ ok: true, duplicate: true });
    }
    sheet.appendRow([
      new Date(),
      fullName,
      phone,
      email,
      lga,
      lcda,
      ward,
      profession,
      marketAssociation,
      category,
      volunteerInterest,
      source,
      'New',
    ]);
  } finally {
    lock.releaseLock();
  }

  maybeNotify_('New ICGTMP membership interest', fullName + ' · ' + phone);
  return json_({ ok: true });
}

function handleMessage_(body) {
  var fullName = clip_(body.fullName, LIMITS.fullName);
  var email = clip_(body.email, LIMITS.email).toLowerCase();
  var message = clip_(body.message, LIMITS.message);
  var source = clip_(body.source || 'website', LIMITS.source);

  if (!fullName) return json_({ ok: false, error: 'Enter your full name.' });
  if (!isEmail_(email)) return json_({ ok: false, error: 'Enter a valid email address.' });
  if (!message) return json_({ ok: false, error: 'Enter a short message.' });

  var sheet = ensureTab_(MESSAGES_TAB, MESSAGES_HEADERS);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    sheet.appendRow([new Date(), fullName, email, message, source, 'New']);
  } finally {
    lock.releaseLock();
  }

  maybeNotify_('New ICGTMP contact message', fullName);
  return json_({ ok: true });
}

function parseBody_(e) {
  var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  var parsed = JSON.parse(raw);
  return parsed && typeof parsed === 'object' ? parsed : {};
}

function ensureTab_(name, headers) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var header = sheet.getRange(1, 1, 1, headers.length);
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function isDuplicateMembership_(sheet, phone) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var start = Math.max(2, last - DEDUPE_SCAN_ROWS + 1);
  var height = last - start + 1;
  var values = sheet.getRange(start, 1, height, 3).getValues();
  var cutoff = Date.now() - DEDUPE_HOURS * 60 * 60 * 1000;
  for (var i = values.length - 1; i >= 0; i--) {
    var ts = values[i][0];
    var time = ts instanceof Date ? ts.getTime() : Date.parse(String(ts));
    if (!time || time < cutoff) break;
    if (String(values[i][2]) === phone) return true;
  }
  return false;
}

/**
 * Coarse global burst brake. Apps Script cannot see client IPs, so this is
 * per-script, not per-visitor.
 */
function allowBurst_() {
  var cache = CacheService.getScriptCache();
  var now = Date.now();
  var until = Number(cache.get('burst_until') || '0');
  var count = Number(cache.get('burst_count') || '0');
  if (!until || until < now) {
    cache.put('burst_until', String(now + BURST_WINDOW_SECONDS * 1000), BURST_WINDOW_SECONDS);
    cache.put('burst_count', '1', BURST_WINDOW_SECONDS);
    return true;
  }
  if (count >= BURST_MAX) return false;
  cache.put('burst_count', String(count + 1), BURST_WINDOW_SECONDS);
  return true;
}

function normalizeNgPhone_(raw) {
  var digits = String(raw || '').replace(/\D/g, '');
  if (digits.indexOf('234') === 0) digits = digits.substring(3);
  else if (digits.charAt(0) === '0') digits = digits.substring(1);
  if (!/^\d{10}$/.test(digits)) return '';
  return '+234' + digits;
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clip_(value, max) {
  return String(value == null ? '' : value).trim().substring(0, max);
}

function maybeNotify_(subject, detail) {
  if (!NOTIFY_EMAIL) return;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, detail);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
