# HANDOFF — paused 2026-07-07

Work paused after completing the **v1 milestone**. This doc is the cold-start resume point.

## Where things stand

- **All 5 GSD phases complete, verified, live.** Repo `wolfwdavid/raj` (public), branch `main`, everything committed and pushed. Working tree clean.
- **Live:** https://wolfwdavid.github.io/raj/ — hub + all four sites + deep dynamic routes + conversion routes all returned **200** on the final smoke; unknown URLs return the styled **404**.
- **CI:** last GitHub Actions run green (build ×4 → assemble → deploy). Every push re-runs svelte-check, the portability guard, content/file-count assertions, and the compliance gate.
- **Commits:** 80+, **zero** AI-assistant mentions (verified).

### Phase ledger (all ✓, 2026-07-07)

| Phase | Delivered | Verifier |
|-------|-----------|----------|
| 1 Deploy Pipeline | matrix build → assemble → single Pages deploy; hub + 404 | 9/9 passed |
| 2 Shells + Conventions | 4 branded shells (distinct design systems); CI svelte-check + portability gates | 4/4 passed |
| 3 Content + Routes | 10 products, 10 dentists, 14 articles/4 regions, pool services/gallery/JSON-LD; all prerendered | 20/20 passed |
| 4 Conversion Paths | runes cart + Stripe-link stub + /thanks; shared LeadForm (quote + appointment) | 6/6 passed |
| 5 SEO + Compliance | SITE_URL-driven canonical/OG on all 15 pages; article metadata; disclaimer; compliance CI gate | 4/4 passed |

## What is NOT done (intentionally — v1 scope boundary)

These are the resume options, in rough priority order:

1. **Wire real service keys** (fastest value, no code). Paste a Stripe Payment Link into `vfamigos/src/lib/config.ts` and a Formspree/Web3Forms endpoint into `lipool/` + `lidentist/` `config.ts`. Until then the UI shows honest "not configured" states. Tracked as `KEYS-01`.
2. **Custom-domain cutover** (vfamigos.com, lipool.com, lidentist.reviews, cannaworldnews.com). Per site: extract the folder to its own repo → `BASE_PATH=''` → set `SITE_URL` to the real domain → add `CNAME` → 301 from the github.io subpath. Architecture already supports this cleanly. Tracked as `DOM-01`. **Needs a registrar + DNS — user action.**
3. **Real content** — real dentist data + reviews (removes lidentist's sample-data banner), real pool project photos. Tracked as `CONT-01`.
4. **SEO extras** — RSS feed + sitemap.xml (cannaworldnews), JSON-LD NewsArticle, generated og:image.
5. **Legal review** of the cannabis-news compliance posture before any custom-domain cutover (flagged by the Phase-5 verifier).

To start a new milestone in GSD: `/gsd:new-milestone`. To just do a quick task: edit the relevant `config.ts` and push.

## How to resume / verify quickly

```bash
cd C:/Users/Mkaru/Documents/Hello_World/hugginface_profile/Websites/raj
git pull

# rebuild + gate any one site (Git Bash on Windows needs the MSYS prefix)
cd vfamigos && npm ci && npm run check && MSYS_NO_PATHCONV=1 BASE_PATH=/raj/vfamigos npm run build

# re-run the live smoke against production
gh run list --workflow deploy.yml --limit 1        # confirm last run green
```

## Landmines (full detail in tasks/lessons.md)

- **Prerender crawler + `rel="external"`** — a card linking to a dynamic route with no `rel` makes the build crawl it; if the route doesn't exist yet the build *fails*. Use temp `rel="external"`, strip it in the task that creates the route. (Bit us twice; both caught by the plan-checker.)
- **localStorage** must be `browser`-guarded (`$app/environment`) or prerender crashes.
- **GitHub Pages first-enable race** — on a fresh repo, enable via `gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow`, then re-run. (Already done here.)
- **Windows Git Bash** mangles `BASE_PATH=/raj/x` — prefix `MSYS_NO_PATHCONV=1`.
- **Never touch** `raj_one/` or `raj_two/` — separate git-ignored repos.

## Key files

- Product docs: [`README.md`](README.md)
- Milestone review: [`tasks/todo.md`](tasks/todo.md)
- Gotchas: [`tasks/lessons.md`](tasks/lessons.md)
- GSD state: [`.planning/STATE.md`](.planning/STATE.md), [`.planning/ROADMAP.md`](.planning/ROADMAP.md), [`.planning/REQUIREMENTS.md`](.planning/REQUIREMENTS.md)
- Design systems: [`.planning/design/`](.planning/design/)
