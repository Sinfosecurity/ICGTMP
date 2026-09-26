/**
 * Runs Code.gs against a mock of the Google Apps Script APIs.
 *
 * Code.gs only ever runs inside Google's editor, where a mistake is slow and
 * awkward to find. Run `npm run test:script` before pasting a new version in.
 *
 * No dependencies and no test runner - just node.
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');

/* ------------------------------------------------------------ mock sheet -- */

class FakeSheet {
  constructor(name) {
    this.name = name;
    this.rows = [];
  }
  getLastRow() {
    return this.rows.length;
  }
  getLastColumn() {
    return this.rows.reduce((w, r) => Math.max(w, r.length), 0);
  }
  appendRow(values) {
    this.rows.push([...values]);
  }
  setFrozenRows() {}
  getRange(row, col, numRows = 1, numCols = 1) {
    const sheet = this;
    return {
      getValues() {
        const out = [];
        for (let r = 0; r < numRows; r++) {
          const source = sheet.rows[row - 1 + r] ?? [];
          const line = [];
          for (let c = 0; c < numCols; c++) line.push(source[col - 1 + c] ?? '');
          out.push(line);
        }
        return out;
      },
      setValues(values) {
        values.forEach((line, r) => {
          const target = (sheet.rows[row - 1 + r] ??= []);
          line.forEach((value, c) => {
            target[col - 1 + c] = value;
          });
        });
        return this;
      },
      setFontWeight() {
        return this;
      },
    };
  }
}

const sheets = new Map();
const cache = new Map();
let mailSent = [];

const sandbox = {
  console,
  SpreadsheetApp: {
    openById: () => ({
      getSheetByName: (name) => sheets.get(name) ?? null,
      insertSheet: (name) => {
        const sheet = new FakeSheet(name);
        sheets.set(name, sheet);
        return sheet;
      },
    }),
  },
  CacheService: {
    getScriptCache: () => ({
      get: (key) => (cache.has(key) ? cache.get(key) : null),
      put: (key, value) => cache.set(key, value),
    }),
  },
  LockService: {
    getScriptLock: () => ({ tryLock: () => true, waitLock() {}, releaseLock() {} }),
  },
  Utilities: {
    DigestAlgorithm: { MD5: 'MD5' },
    computeDigest: (_alg, value) => {
      // Any stable byte mapping works; this only has to be deterministic.
      const bytes = [];
      for (let i = 0; i < 16; i++) bytes.push((String(value).charCodeAt(i % value.length) + i) % 256);
      return bytes;
    },
  },
  ContentService: {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text) => ({ setMimeType: () => ({ getContent: () => text }) }),
  },
  MailApp: { sendEmail: (to, subject) => mailSent.push({ to, subject }) },
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox);

/* ------------------------------------------------------------------ run -- */

const post = (body) =>
  JSON.parse(sandbox.doPost({ postData: { contents: JSON.stringify(body) } }).getContent());

const reset = () => {
  sheets.clear();
  cache.clear();
  mailSent = [];
};

const valid = (over = {}) => ({
  form: 'membership',
  fullName: 'Bola Adeyemi',
  phone: '+2348030000000',
  email: 'bola@example.com',
  lga: 'Epe',
  lcda: 'Eredo LCDA',
  category: 'Markets & Traders',
  submissionId: 'sub-' + Math.random().toString(36).slice(2),
  elapsedMs: 30000,
  ...over,
});

let passed = 0;
const test = (name, fn) => {
  reset();
  try {
    fn();
    passed++;
    console.log('  PASS  ' + name);
  } catch (error) {
    console.log('  FAIL  ' + name + '\n        ' + error.message);
    process.exitCode = 1;
  }
};

console.log('\nValidation');
test('accepts a well-formed membership', () => {
  const res = post(valid());
  assert.equal(res.ok, true);
  assert.equal(res.code, 'CREATED');
  assert.match(res.reference, /^ICG-/);
});
test('rejects a single-word name on the fullName field', () => {
  const res = post(valid({ fullName: 'Bola' }));
  assert.equal(res.code, 'INVALID_FIELD');
  assert.equal(res.field, 'fullName');
});
test('rejects a non-Nigerian mobile prefix', () => {
  const res = post(valid({ phone: '01234567890' }));
  assert.equal(res.field, 'phone');
});
test('accepts 0803, 0703, 0817 and 0913 shapes', () => {
  for (const phone of ['08030000000', '07030000000', '08170000000', '09130000000']) {
    const res = post(valid({ phone, email: phone + '@example.com' }));
    assert.equal(res.ok, true, phone + ' should be accepted');
  }
});
test('rejects a disposable email domain', () => {
  const res = post(valid({ email: 'x@mailinator.com' }));
  assert.equal(res.field, 'email');
});
test('rejects an LCDA that is not in the chosen LGA', () => {
  const res = post(valid({ lga: 'Epe', lcda: 'Lekki LCDA' }));
  assert.equal(res.field, 'lcda');
});
test('rejects a category that is not on the list', () => {
  const res = post(valid({ category: 'Chairman' }));
  assert.equal(res.field, 'category');
});
test('requires volunteers to say what they will do', () => {
  const res = post(valid({ category: 'Volunteer', volunteerInterest: '' }));
  assert.equal(res.field, 'volunteerInterest');
});
test('rejects rather than truncating an over-long answer', () => {
  const res = post(valid({ volunteerInterest: 'x'.repeat(1001) }));
  assert.equal(res.field, 'volunteerInterest');
  assert.match(res.error, /under 1000/);
});

console.log('\nDuplicates');
test('a second submission of the same email is a duplicate, not a new row', () => {
  post(valid());
  const res = post(valid({ phone: '08099999999' }));
  assert.equal(res.ok, true);
  assert.equal(res.code, 'DUPLICATE');
  assert.equal(res.field, 'email');
  assert.equal(sheets.get('Members').getLastRow(), 2, 'header + one member');
});
test('a second submission of the same phone is a duplicate', () => {
  post(valid());
  const res = post(valid({ email: 'other@example.com' }));
  assert.equal(res.code, 'DUPLICATE');
  assert.equal(res.field, 'phone');
});
test('the duplicate carries the original reference', () => {
  const first = post(valid());
  const second = post(valid({ phone: '08099999999' }));
  assert.equal(second.reference, first.reference);
});
test('a phone stored in a different shape still matches', () => {
  post(valid());
  // A coordinator retyped the number by hand as a local 0803 number.
  sheets.get('Members').rows[1][2] = '0803 000 0000';
  const res = post(valid({ email: 'other@example.com' }));
  assert.equal(res.code, 'DUPLICATE');
});
test('duplicates are found beyond a recent window', () => {
  post(valid());
  for (let i = 0; i < 600; i++) {
    // Bulk-loading the register is not what this test is about, so keep the
    // rate limiters out of the way.
    cache.clear();
    post(valid({ email: `f${i}@example.com`, phone: '080' + String(30000000 + i) }));
  }
  cache.clear();
  const res = post(valid({ phone: '08099999999' }));
  assert.equal(res.code, 'DUPLICATE', 'the very first email must still be found');
});

console.log('\nIdempotency and rate limiting');
test('a replayed submission ID does not write a second row', () => {
  const body = valid();
  const first = post(body);
  const second = post(body);
  assert.equal(second.ok, true);
  assert.equal(second.reference, first.reference);
  assert.equal(second.replayed, true);
  assert.equal(sheets.get('Members').getLastRow(), 2);
});
test('a fourth attempt from one identity is rate limited', () => {
  for (let i = 0; i < 3; i++) post(valid({ fullName: 'Bola Adeyemi ' + i }));
  const res = post(valid());
  assert.equal(res.code, 'RATE_LIMITED');
  assert.ok(res.retryAfter > 0);
});
test('the global brake trips after enough traffic', () => {
  let limited = null;
  for (let i = 0; i < 70 && !limited; i++) {
    const res = post(valid({ email: `p${i}@example.com`, phone: '080' + String(30000000 + i) }));
    if (res.code === 'RATE_LIMITED') limited = i;
  }
  assert.ok(limited !== null, 'expected the global brake to trip');
});

console.log('\nBot traps');
test('a filled honeypot looks successful and writes nothing', () => {
  const res = post(valid({ website: 'http://spam.example' }));
  assert.equal(res.ok, true);
  assert.equal(sheets.has('Members'), false);
});
test('a form submitted faster than a person can type writes nothing', () => {
  const res = post(valid({ elapsedMs: 300 }));
  assert.equal(res.ok, true);
  assert.equal(sheets.has('Members'), false);
});

console.log('\nSheet shape');
test('setupCheck creates both tabs with their headers', () => {
  sandbox.setupCheck();
  assert.deepEqual(sheets.get('Members').rows[0][0], 'Timestamp');
  assert.ok(sheets.get('Members').rows[0].includes('Reference'));
  assert.ok(sheets.get('Messages').rows[0].includes('Submission ID'));
});
test('an existing sheet gains new columns without losing data', () => {
  // A register created by the previous version of this script.
  const old = new FakeSheet('Members');
  old.rows.push(['Timestamp', 'Full Name', 'Phone', 'Email', 'LGA', 'LCDA', 'Ward',
    'Profession / Trade', 'Market / Association', 'Membership Category',
    'Volunteer Interest', 'Source', 'Status']);
  old.rows.push([new Date(), 'Existing Member', '+2348011111111', 'existing@example.com',
    'Epe', 'Eredo LCDA', '', '', '', 'Volunteer', '', 'website', 'New']);
  sheets.set('Members', old);

  sandbox.migrateHeaders();
  assert.ok(old.rows[0].includes('Reference'), 'Reference column appended');
  assert.ok(old.rows[0].includes('Submission ID'), 'Submission ID column appended');
  assert.equal(old.rows[1][1], 'Existing Member', 'existing data untouched');
  assert.equal(old.rows[1][3], 'existing@example.com');

  // And the pre-existing member is still recognised as a duplicate.
  const res = post(valid({ email: 'existing@example.com', phone: '08022222222' }));
  assert.equal(res.code, 'DUPLICATE');
});
test('a row is written by column name, not position', () => {
  // Someone reordered the register by hand.
  const odd = new FakeSheet('Members');
  odd.rows.push(['Email', 'Timestamp', 'Full Name', 'Phone', 'LGA', 'LCDA', 'Ward',
    'Profession / Trade', 'Market / Association', 'Membership Category',
    'Volunteer Interest', 'Source', 'Status', 'Reference', 'Submission ID']);
  sheets.set('Members', odd);

  post(valid());
  assert.equal(odd.rows[1][0], 'bola@example.com', 'email landed in the Email column');
  assert.equal(odd.rows[1][2], 'Bola Adeyemi');
});

console.log('\nMessages');
test('a contact message is stored and short ones are rejected', () => {
  const ok = post({ form: 'message', fullName: 'Bola Adeyemi', email: 'b@example.com', message: 'Hello there, I would like to help.', submissionId: 'm1', elapsedMs: 9000 });
  assert.equal(ok.code, 'CREATED');
  const short = post({ form: 'message', fullName: 'Bola Adeyemi', email: 'c@example.com', message: 'hi', submissionId: 'm2', elapsedMs: 9000 });
  assert.equal(short.field, 'message');
});
test('an unknown form type is refused', () => {
  assert.equal(post({ form: 'whatever' }).code, 'UNKNOWN_FORM');
});

console.log(`\n${passed} passed\n`);
