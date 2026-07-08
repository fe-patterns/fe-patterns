# Newsletter setup — Buttondown

_Owned email list via [Buttondown](https://buttondown.com), free tier. Posts are
sent **manually** — Buttondown gates automatic RSS-to-email behind a paid plan
(~$9/mo), which isn't worth it pre-audience. The site's full-content `/rss.xml`
feed is the source to copy from, and it's ready to switch to automation the day
paying is justified. Migration path to Kit later if growth demands it; we own the
list, so switching is export → import._

## What's already wired in code (this branch)

- **RSS feed** at `/rss.xml` (`site/src/pages/rss.xml.ts`) — **full-content**:
  each item carries the whole post as rendered HTML in `content:encoded`, so the
  Buttondown email ships the full post in the body. It also includes a short
  `description` summary (frontmatter `description`, falling back to the first
  paragraph) and a `link` back to the canonical blog post. The body is rendered
  from markdown with `markdown-it` + `sanitize-html`, with root-relative
  link/image URLs rewritten to absolute so they resolve in email clients.
- **Feed discovery** `<link rel="alternate" type="application/rss+xml">` in
  `site/src/layouts/Base.astro`.
- **Signup form** `site/src/components/Newsletter.astro` — rendered at the end of
  every blog post and on the home page. Collects an optional first name
  (`metadata__first_name` → `subscriber.metadata.first_name`) and a required email.
  The username is hardcoded to `zaboco` (it's public — it appears in the form
  action), overridable via `PUBLIC_BUTTONDOWN_USERNAME` if ever needed.
- **Subscribe proxy** `netlify/functions/subscribe.mjs` (Netlify Functions v2, path
  `/api/subscribe`) — holds the Buttondown **API key server-side** and returns JSON.
  The form's JS POSTs to it and renders the result inline, so the reader never
  leaves the site. On success it sets a first-party `nl_subscribed` cookie (mirrored
  to `localStorage`) so a returning reader sees a "you're subscribed" state instead
  of the form. This is a soft, per-browser hint only — not authoritative state
  (anonymous visitors can't be identified server-side; clearing cookies resets it).
  **Without JS the form still posts straight to Buttondown** (progressive enhancement).

## One-time setup (Buttondown dashboard — you do this)

1. Create the Buttondown account for username `zaboco` (free tier). The signup form
   already points at it — no env config needed. (To use a different username, set
   `PUBLIC_BUTTONDOWN_USERNAME`; see `site/.env.example`.)
2. **Set `BUTTONDOWN_API_KEY` in Netlify** (Site settings → Environment variables) —
   the subscribe Function reads it server-side. Grab it from Buttondown → Settings →
   Programming → API. **Not** committed; **not** `PUBLIC_`-prefixed (must stay
   server-only). Free-tier Netlify Functions comfortably cover a signup form's volume.
3. **Web archives:** with full-content emails you may *want* archives on (the email
   is a complete read), but the blog remains canonical. Your call — comments will
   live on the blog (giscus, later), not the archive.

### Local testing

`pnpm dev` (astro dev) does **not** run the Function, so `/api/subscribe` 404s and
the form shows an error. Two ways to test the real flow:

- **Deploy preview (recommended).** Push the branch; open the Netlify preview and
  submit the form. This is the only place a *successful* subscribe reliably works —
  Buttondown's spam firewall rejects subscribes coming from a localhost/datacenter
  IP (you'll get "blocked by your firewall"), but a real preview has a real visitor
  IP. It also avoids the `netlify dev` quirks below.
- **`netlify dev` locally.** Needs `BUTTONDOWN_API_KEY` in a root `.env` (gitignored)
  and the functions dir passed explicitly (the CLI won't auto-load it from
  `[functions]` in dev): `netlify dev -f netlify/functions`, serving on
  http://localhost:8888. Astro self-daemonizes, so stop it afterwards with
  `pnpm --filter fe-patterns-site exec astro dev stop`. Good for testing the proxy
  and error paths; the success path will likely hit the firewall as above.

Either way, use a Gmail `+alias` (e.g. `you+test1@gmail.com`) so you can re-test
without burning your real address on Buttondown's suppression list — and don't
delete/unsubscribe the alias afterward, or it gets suppressed too.

## Publishing a post (per post — manual send)

1. Publish the post to the blog as usual.
2. In Buttondown, compose a new email. Copy the post body in — the rendered
   `/rss.xml` item (`content:encoded`) is the ready-made full-content source, or
   paste from the blog. Set the canonical/link to the blog URL for SEO.
3. Send yourself a test first, confirm it renders, then send to the list.

_When manual sending gets tedious (higher cadence / more subscribers), flip
Buttondown to a paid plan and point RSS-to-email at
`https://fe-patterns.netlify.app/rss.xml` — the feed is already built for it._

## Notes

- The username is **not a secret** — it's visible in the rendered form action, so
  it's hardcoded (`zaboco`) with an optional `PUBLIC_BUTTONDOWN_USERNAME` override.
- Comments (giscus) are **postponed** until there's an audience — see the original
  handoff doc. This branch is newsletter-only.

## Future / migration

If growth stalls or monetization starts, evaluate **Kit** for its Creator Network +
native product/course selling. We own the Buttondown list, so export → import is the
whole migration.
