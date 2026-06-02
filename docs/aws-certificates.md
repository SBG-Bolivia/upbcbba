# AWS Certificate System — Setup Guide

This is the verifiable, downloadable certificate system for event attendees. The
**code/connection layer is already in the repo**; this guide is the **AWS-account
work that only you can do** (creating resources + granting access), plus how to
test the connection.

Flow it implements:

> Admin reconciles who actually attended an event → for each verified attendee we
> **generate a PDF** (from your AWS template, filled with name + event) → **store
> it in S3** → **save a record in DynamoDB** with a unique ID → **email** the
> person a link like `https://<site>/cert/<uuid>`. That page verifies the
> certificate is authentic and offers the PDF download. The PDF carries a QR code
> pointing back at the same link, so it's tamper-evident.

---

## What's already in the repo (done by Claude)

| Piece | Path |
| --- | --- |
| AWS config (region + resource names, no secrets) | `src/lib/aws/env.ts` |
| Lazy SDK clients (DynamoDB / S3 / SES) | `src/lib/aws/clients.ts` |
| Data models | `src/lib/aws/types.ts` |
| DynamoDB data access | `src/lib/aws/repo.ts` |
| S3 template + PDF storage (+ presigned download) | `src/lib/aws/storage.ts` |
| PDF generation (`pdf-lib` + QR) | `src/lib/aws/pdf.ts` |
| SES email | `src/lib/aws/email.ts` |
| One-call issuance (PDF → S3 → DB → email) | `src/lib/aws/issue.ts` |
| Public verification page | `src/app/cert/[id]/page.tsx` → `/cert/<id>` |
| Connection health check | `src/app/api/aws-health/route.ts` → `/api/aws-health` |
| Env template | `.env.example` |
| IAM policies | `infra/iam/*.json` |
| Provisioning script (AWS CLI) | `infra/provision.sh` |

Credentials are **never** in code or env — the AWS SDK uses your local AWS CLI
profile in dev and the **Amplify compute role** in production.

---

## Your checklist

### 1. Pick names
- **Region** — e.g. `us-east-1` (recommended; SES + Amplify are simplest there).
- **S3 bucket** — globally unique, start it with `sbg-cert-` (e.g.
  `sbg-cert-upb-2026`). Resource names matter: the IAM policies are scoped to the
  `sbg-cert*` prefix.

### 2. Create the resources — choose ONE path

**Path A — let Claude provision it (fastest).**
1. In the AWS Console → IAM → **Create user** (e.g. `claude-cert-setup`), *no*
   console access.
2. Attach an inline policy using **`infra/iam/claude-cli-policy.json`** (this is
   the "permissions JSON for AWS CLI access" you asked about — see below).
3. Create an **access key** for that user and share it with me **securely** (not
   in plain chat — use a password manager / one-time-secret link). I'll run
   `infra/provision.sh`, create the tables/bucket/SES identity, and test.
4. **Delete the access key** once setup is verified.

**Path B — do it yourself.**
```bash
export AWS_REGION=us-east-1
export SBG_S3_BUCKET=sbg-cert-<your-unique-suffix>
export SBG_SES_SENDER=certificados@yourdomain.com
bash infra/provision.sh
```
(Or run the equivalent in the Console. Windows: run the script via Git Bash/WSL,
or translate the `aws` commands to PowerShell — they're identical flags.)

### 3. Grant the running app access
Attach **`infra/iam/app-runtime-policy.json`** to your **Amplify app's compute
service role** (Amplify Console → App settings → IAM role, or the SSR Lambda
execution role). This is least-privilege: data ops only, no create/delete. Do
this yourself — the CLI user above intentionally has **no IAM permissions**.

### 4. Verify the SES sender
- SES → Identities → confirm `SBG_SES_SENDER` (click the email link, or add DNS
  records for a domain identity).
- New SES accounts are in the **sandbox** (can only email *verified* addresses).
  To email real attendees, request **production access** in the SES console
  (takes ~24h). Until then, verify a couple of test addresses to try the flow.

### 5. Upload your certificate template
AWS sends you a PDF template; upload it as the template key:
```bash
aws s3 cp certificate-template.pdf s3://$SBG_S3_BUCKET/templates/certificate-template.pdf
```
Then tune the text positions in `src/lib/aws/pdf.ts` (the `centerText(...)` Y
coordinates) to land on the right lines of your template. Until a template is
uploaded, generation falls back to a basic built-in certificate so you can test.

### 6. Set environment variables
- **Local:** copy `.env.example` → `.env.local` and fill in the values.
- **Production:** set the same vars in **Amplify Console → Environment variables**.
  Set `NEXT_PUBLIC_BASE_URL` to your real domain (used for the QR + email links).

### 7. Test the connection
Run the app and open **`/api/aws-health`**. You want:
```json
{ "dynamodb": { "ok": true }, "s3": { "ok": true }, "ses": { "configured": true } }
```
If something is `false`, the `error` field names the failing service.
**Protect or delete this route before launch** — see Security.

---

## The permissions JSON (your question)

- **`infra/iam/claude-cli-policy.json`** — attach to the IAM user whose access key
  you share with me. Lets me create/describe DynamoDB tables, create the S3 bucket
  and read/write objects, and register/send via SES — **all scoped to `sbg-cert*`
  resources**, and with **no IAM permissions** (so I can't escalate). Revoke the
  key when done.
- **`infra/iam/app-runtime-policy.json`** — attach to the Amplify runtime role.
  Only the data operations the app performs.

---

## Reference

### DynamoDB tables (created by the script)
| Table | Key | Index |
| --- | --- | --- |
| `sbg-cert-events` | `eventId` (HASH) | — |
| `sbg-cert-participants` | `participantId` (HASH) | `email-index` (email) |
| `sbg-cert-attendance` | `eventId` (HASH) + `participantId` (RANGE) | — |
| `sbg-cert-certificates` | `certId` (HASH) | `eventId-index` (eventId) |

All on-demand billing (PAY_PER_REQUEST) — you pay per request, ~$0 at this scale.

### Environment variables
| Var | Purpose |
| --- | --- |
| `SBG_AWS_REGION` | Region (prod uses Amplify's `AWS_REGION` automatically) |
| `SBG_S3_BUCKET` | Bucket for template + generated PDFs |
| `SBG_CERT_TEMPLATE_KEY` | Template key (default `templates/certificate-template.pdf`) |
| `SBG_DDB_*` | Table name overrides (defaults match the script) |
| `SBG_SES_SENDER` | Verified SES sender identity |
| `NEXT_PUBLIC_BASE_URL` | Public site URL for verification links |

---

## Security notes
- `/api/aws-health` reveals which resources are reachable — **gate it behind admin
  auth or remove it** before launch.
- Keep the bucket **private** (the script blocks public access); downloads use
  short-lived presigned URLs from the verification page.
- Tighten `app-runtime-policy.json` from `sbg-cert-*` wildcards to your exact
  table/bucket ARNs once names are final.
- `certId` is a random UUID — links are unguessable; that *is* the verification.

---

## Next phase (not built yet)
- **Admin panel** (`/admin/...`) behind **Amazon Cognito**: list events, view
  attendance, cross-check who came, and trigger issuance for the batch (calls
  `issueCertificate` per verified attendee).
- **Bulk orchestration** via **SQS / Step Functions** if events get large.
- **Check-in/registration** capture (the meetup signup → `participants` +
  `attendance` rows).

Once the resources above exist and `/api/aws-health` is green, that's the natural
next step.
