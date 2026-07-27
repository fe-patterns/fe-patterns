# Analytics setup — Umami

_Privacy-friendly, cookieless analytics via [Umami](https://umami.is), **Umami
Cloud free tier**. No cookie banner, no GA. Loads only when a website ID is
configured, so local dev and forks stay untracked. The website ID is **public**
(it ships in the page) — it is not a secret; the account credentials are._

## What's already wired in code (this branch)

- **Tracking script** in `site/src/layouts/Base.astro` — a deferred
  `<script>` that renders **only** when `PUBLIC_UMAMI_WEBSITE_ID` is set. Script
  host defaults to Umami Cloud US (`https://cloud.umami.is/script.js`); override
  with `PUBLIC_UMAMI_SRC` for the EU region
  (`https://eu.umami.is/script.js`) or a self-hosted instance.
- **Signup conversion event** in `site/src/components/Newsletter.astro` — on a new
  signup the form fires `umami.track("newsletter-subscribe")`. The call is
  null-safe, so nothing breaks when Umami isn't loaded. (Double-opt-in confirmation
  happens off-site in Buttondown, so this on-site submit is the trackable event.)
- **Env vars** documented in `site/.env.example`.

## Enabling

Tracking is off until `PUBLIC_UMAMI_WEBSITE_ID` (the website's UUID from the Umami
dashboard) is set in the deploy environment; set `PUBLIC_UMAMI_SRC` too when the
account is in the EU region or self-hosted. Unset in local dev and forks means no
tracking. The `newsletter-subscribe` event surfaces as a conversion once a matching
goal/report exists in the dashboard.

## Attribution (UTM)

Umami reads `utm_*` query parameters automatically — no code needed. Tag every
outbound link you post elsewhere so traffic is attributable by source and
campaign, e.g.:

```
https://<site>/blog/<slug>?utm_source=<channel>&utm_medium=<medium>&utm_campaign=<slug>
```

Keep `utm_source` values consistent (one per channel) so the dashboard groups them
cleanly.

## Notes

- **No cookie banner needed** — Umami is cookieless and doesn't collect personal
  data. Keep it that way (don't add PII to event payloads).
- **Free-tier ceiling** is far above this site's volume for the foreseeable future;
  revisit only if it's ever approached.
