# Receipt — internal admin console

A standalone site for the Receipt team: every company on the platform, the
integrations they run, and how recently anyone signed in.

It lives in its own folder, with its own `package.json`, its own build, and its
own deploy, so that **nothing internal ships inside the marketing site**. The
marketing site at the repository root no longer contains this code, no longer
serves `/api/admin/*`, and has no link to here.

## How access works

There are no accounts in this app. Signing in forwards your ordinary **Receipt**
credentials to `beetle.run`, and Receipt decides whether you may see production
data. Two consequences worth keeping in mind:

- Removing someone's Receipt account removes their access here, with no
  separate step and no list to remember to prune.
- Nothing in `src/` is trusted. The browser bundle is public by definition, so
  every rule is enforced in `api/`, which runs on the server, and again in
  Receipt, which is the authority.

The rules are unchanged from the version that used to live on the marketing
site:

| Rule | Where it is enforced |
| --- | --- |
| Only `@kentron.ai` work accounts may sign in | `api/_lib/receipt.ts`, and again in Receipt |
| Signing in is not enough — the account must be allowed the console | Receipt, checked before a cookie is issued |
| Wrong password, wrong domain, and no such account all answer identically | `api/admin/session.ts` |
| No account can be created here | there is no endpoint for it |
| The Receipt session is unreadable to scripts on the page | `HttpOnly; Secure; SameSite=Lax` cookie |
| Production figures are never cached | `no-store` on every response, plus `vercel.json` |
| The console stays out of search results | `robots.txt`, a `noindex` meta tag, and `X-Robots-Tag` |

The sign-in page deliberately does not name which domain is accepted — telling a
stranger the rule tells them what to try next.

## Layout

```
admin/
├── api/
│   ├── _lib/receipt.ts     server-side link to Receipt: cookies, domain check, fetch
│   ├── _lib/preview.ts     TEMPORARY preview access — see below
│   ├── admin/session.ts    POST sign in · DELETE sign out
│   └── admin/stats.ts      GET company metrics, forwarded from Receipt
└── src/
    ├── App.tsx             sign-in state; one screen, no router
    ├── components/         AdminLogin, AdminDashboard, ReceiptMark
    └── lib/                adminApi (fetch wrappers), adminTypes (response shape)
```

`src/lib/adminTypes.ts` mirrors `lib/shared/admin/admin-overview.ts` in the
Receipt repo field for field, so drift shows up as a type error rather than a
blank column.

## Running it

```bash
npm install
npm run dev        # UI only — the API routes do not run under plain Vite
vercel dev         # UI + serverless functions, needed to actually sign in
npm run typecheck  # app and API
npm run build
```

`RECEIPT_ORIGIN` overrides where the functions look for Receipt; it defaults to
`https://beetle.run`. There is no shared service token anywhere in this flow — a
request is authorized because a named Kentron person is behind it.

## Deploying

A separate Vercel project from the marketing site, with **Root Directory** set
to `admin`. That is what keeps the two deploys, and their domains, apart.

## Temporary preview access

`api/_lib/preview.ts` bypasses authentication for one hardcoded account and
answers with invented companies, so the console can be reviewed before Receipt's
`/api/admin-metrics` endpoint is deployed. Every row it returns is labelled
demo data, and the dashboard shows a banner saying so.

Delete that file and the two blocks marked `TEMPORARY` in `api/admin/session.ts`
and `api/admin/stats.ts` before real customer numbers flow through here.
