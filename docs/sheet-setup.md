# JOIN ICGTMP → Google Sheet

Submissions from the "Join ICGTMP" modal and the contact form are appended to
this spreadsheet:

https://docs.google.com/spreadsheets/d/1856ZQHjnrOW1ez1V6GUQ_YUDAOpOery26nvSW7FRuQc/edit

The website never talks to Google directly. It POSTs JSON to a Google Apps
Script web app (`apps-script/Code.gs`), which validates the submission and
appends a row. That keeps the spreadsheet private — no API key or service
account is shipped in the browser bundle.

`apps-script/Code.gs` is the authority on what a valid submission is.
`src/lib/validation.ts` mirrors those rules so the visitor gets immediate
feedback, but nothing the browser sends is trusted. **When a rule changes in one,
change it in the other.**

## One-time setup

1. Open the spreadsheet above → **Extensions → Apps Script**.
2. Paste the full contents of `apps-script/Code.gs` over whatever is there. Save.
3. Confirm the `SHEET_ID` near the top matches the spreadsheet you opened.
4. Run `setupCheck` once from the editor toolbar and approve the permission
   prompt. It creates the `Members` and `Messages` tabs and writes one test row
   in each — delete those two rows afterwards.
5. **Deploy → New deployment → Web app**, Execute as **Me**, Who has access
   **Anyone**. Copy the `/exec` URL.
6. Put that URL in `.env.local` at the project root, and in your host's
   environment variables:

   ```
   VITE_SHEET_ENDPOINT=https://script.google.com/macros/s/AKfycb.../exec
   ```

7. Restart `npm run dev`, submit the join form, confirm a row lands in `Members`.

## Updating an existing deployment

Apps Script serves the *deployed* version, not the saved one, so editing the
file in the browser changes nothing until you redeploy.

1. Paste the new `Code.gs` and save.
2. Run **`migrateHeaders`** once. It adds any column this version introduced to
   the right-hand end of each tab. It never reorders or removes anything, so it
   is safe to run on a sheet that already holds real members.
3. **Deploy → Manage deployments → edit (pencil) → Version: New version →
   Deploy.** The `/exec` URL does not change, so `.env.local` stays as it is.

## Testing the script before you paste it

`Code.gs` only ever runs inside Google's editor, where mistakes are slow to find.
There is a dependency-free harness that runs it against a mock of the Google
APIs:

```bash
npm run test:script
```

It covers validation, duplicate detection, idempotency, rate limiting, the bot
traps and the header migration. Run it before every paste.

## What the register stores

`Timestamp · Full Name · Phone · Email · LGA · LCDA · Ward · Profession / Trade ·
Market / Association · Membership Category · Volunteer Interest · Source ·
Status · Reference · Submission ID`

Rows are written **by column name, not position**, so reordering columns by hand
in the sheet will not scramble future entries.

- **Phone** is normalised to `+234XXXXXXXXXX`. Only real Nigerian mobile shapes
  are accepted (`0` + `7–9` + `0–1` + eight digits), so a run of ten arbitrary
  digits is rejected.
- **Email** is lowercased and trimmed.
- **Reference** is the short code shown to the visitor, e.g. `ICG-K3M9A7`. It is
  what they will quote if they call a coordinator.
- **Submission ID** identifies one filled-in form. It is how a retry after a
  timeout is recognised instead of creating a second row.
- **Status** is seeded as `New` for coordinators to work through.

## Rules the register enforces

| Rule | Behaviour |
|---|---|
| Name | Must contain a first and last name |
| Phone | Valid Nigerian mobile, stored in E.164 |
| Email | Valid syntax; a short list of throwaway domains is refused |
| LGA / LCDA | The LCDA must actually belong to the chosen LGA |
| Category | Must be one of the six on the list |
| Volunteer Interest | Required when the category is Volunteer |
| Length | Over-long answers are **rejected, not truncated**, so nobody silently loses the end of what they wrote |

## Duplicates

A submission whose **email or phone already appears anywhere in the register** is
answered with `DUPLICATE` and no new row. The whole register is checked, not a
recent window — "have they signed up before" has no expiry. The response carries
the original `Reference`, so the visitor is told the same code they were given
the first time.

The check runs inside a script lock, so two submissions arriving at the same
moment cannot both slip past it.

Phone matching normalises both sides, so a number a coordinator retyped by hand
as `0803 000 0000` still matches an incoming `+2348030000000`.

## Rate limiting

| Limit | Default | Where |
|---|---|---|
| Per identity (email + phone) | 3 per hour | `IDENTITY_MAX` in `Code.gs` |
| Global, whole script | 60 per 10 minutes | `GLOBAL_MAX` in `Code.gs` |
| Per browser | 3 per 10 minutes | `COOLDOWN_MAX` in the form components |

Raise `GLOBAL_MAX` before a registration drive or the brake will start refusing
real people.

**What this does not do.** Apps Script cannot see the caller's IP address, so
there is no per-visitor limit to be had. The identity throttle stops accidental
floods and casual abuse; it does not stop someone rotating email addresses. The
browser-side cooldown is a courtesy that lives in `localStorage` and anyone can
clear it. If the form is ever actually attacked, the fix is a challenge in front
of it — Cloudflare Turnstile or reCAPTCHA — not a bigger number here.

The other defences are a hidden honeypot field and a timing trap: a form
"completed" in under two seconds was not typed by a person. Both answer with a
normal-looking success and write nothing, so a bot learns nothing from the
response.

## A deliberate omission: no "is this email taken" endpoint

Checking an email against the register as the visitor types would be nicer, but
an endpoint that answers "is this person registered?" lets anyone probe
membership of a political-adjacent organisation one address at a time. The
duplicate check therefore runs **only on submit**, where the person has already
supplied their own details. If you want the live check anyway, it needs hard
per-caller throttling and should be a deliberate decision, not a convenience.

## Response codes

The website switches on `code`; `error` is human-readable copy.

| Code | Meaning |
|---|---|
| `CREATED` | Row written. `reference` returned. |
| `DUPLICATE` | Already on the register. Treated as success. |
| `INVALID_FIELD` | `field` names the input to highlight. |
| `RATE_LIMITED` | `retryAfter` is in seconds. |
| `BUSY` | Could not take the lock. Worth retrying. |
| `SERVER_ERROR` | Unexpected. Worth retrying. |
| `UNKNOWN_FORM` | The `form` value was not recognised. |

The website adds its own transport-level codes on top: `OFFLINE`, `TIMEOUT`,
`NETWORK`, `BAD_RESPONSE` and `NOT_CONFIGURED`.

## Email notification

The site also posts to FormSubmit so a coordinator gets an email. **The
spreadsheet decides the outcome, not the email.** If the register rejects a
submission, the visitor is told it failed even when the email went out —
otherwise people would be told they are members when no row exists.

The one exception: if `VITE_SHEET_ENDPOINT` is unset, the email is all there is
and it decides. To drop FormSubmit entirely, set `NOTIFY_EMAIL` in `Code.gs` and
remove the email leg from `src/lib/formTransport.ts`.
