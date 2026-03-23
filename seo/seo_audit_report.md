# SEO Audit Report — northshorejudo.co.nz

> Audited 2026-03-23 | Single-page static site on GitHub Pages

---

## Executive Summary

| Area | Score | Verdict |
|------|-------|---------|
| **Google SEO Score** | 100/100 | ✅ Excellent |
| **On-Page SEO** | 9/10 | ✅ Strong |
| **Structured Data** | 9/10 | ✅ Comprehensive |
| **Mobile Performance** | 70/100 | ⚠️ Needs work |
| **Desktop Performance** | 48/100 | 🔴 Poor |
| **Accessibility** | 82/100 | ⚠️ Good, can improve |
| **Content Quality** | 8/10 | ✅ Good |
| **Technical SEO** | 7/10 | ⚠️ Issues to fix |

**Bottom line**: The site has excellent on-page SEO fundamentals (title, meta, schema, canonical, OG tags). The biggest problems are **Core Web Vitals** (Desktop CLS 1.516, Mobile LCP 8.0s) and a **duplicate URL in Google Search Console** that splits ranking signals.

---

## 🔴 Critical Issues (Fix Immediately)

### 1. Duplicate URL Splitting Ranking Signals (Impact: HIGH)

Google Search Console shows **two separate URLs** indexing your content:

| URL | Clicks | Impressions | CTR | Avg Position |
|-----|--------|-------------|-----|-------------|
| `http://www.northshorejudo.co.nz/?ref=google` | 99 | 828 | 11.96% | 3.98 |
| `https://northshorejudo.co.nz/` | 92 | 2,000 | 4.6% | 10.32 |

The old `http://www` URL is **still indexed** and gets almost half your clicks. This is splitting your PageRank and ranking signals between two URLs.

> [!CAUTION]
> This is likely your single biggest technical SEO issue. Combined, your site would have 191 clicks and 2,828 impressions — significantly stronger authority.

**Fix**: Ensure GitHub Pages (or your DNS/CDN) properly 301-redirects `http://www.northshorejudo.co.nz` → `https://northshorejudo.co.nz/`. Check your CNAME and GitHub Pages settings. You may need to:
- Enable "Enforce HTTPS" in GitHub Pages settings
- Verify the `www` subdomain also redirects to the non-www HTTPS version
- Submit the old URL for removal in Google Search Console
- Add both `http://www.northshorejudo.co.nz` and `https://northshorejudo.co.nz` as properties in GSC

### 2. Desktop CLS 1.516 (Impact: HIGH)

Desktop Cumulative Layout Shift is **1.516** — anything above 0.1 is "poor". This means elements are shifting around massively during page load.

**Likely causes:**
- Slider images (`flexslider`) changing dimensions after load
- CSS being loaded async via `preload` → `onload` pattern — content renders unstyled then shifts
- Images without explicit `width`/`height` attributes (see below)

**Images missing `width` and `height`:**
- Line 237: `sized_oldsite_location_picture.webp` — no width/height
- Line 265: `sized_parkingspace.webp` — no width/height
- Line 389: [sign2w.png](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/images/sign2w.png) — no width/height
- Line 522: `group_photo_coaches.jpg` — no width/height
- Line 160: `logo.webp` — no width/height
- Line 819: `logo.webp` (footer) — no width/height

**Fix**: Add explicit `width` and `height` attributes to ALL `<img>` tags.

### 3. Mobile LCP 8.0 seconds (Impact: HIGH)

The Largest Contentful Paint on mobile is 8.0s — target is under 2.5s. The LCP element is the hero slider image.

**Causes:**
- Image file size (hero image needs more aggressive compression)
- CSS loaded via `preload`+`onload` pattern delays rendering
- [compressed.js](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/js/compressed.js) is 368KB — likely includes unused libraries

**Fix**:
- Convert hero image to AVIF format (better compression than WebP)
- Consider inlining critical CSS instead of async-loading ALL stylesheets
- Audit [compressed.js](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/js/compressed.js) for unused code

### 4. Broken HTML — Missing `</li>` Tag (Impact: MEDIUM)

Line 264 opens a new `<li>` for slide 3 without closing the `<li>` for slide 2 (line 236). The slide 2 `<li>` is never closed.

```diff
 			</div><!-- eof .container-fluid -->
+			</li>
 			<li class="ds text-left">
```

**Fix**: Add the closing `</li>` tag before line 264.

---

## ⚠️ Important Issues

### 5. CSS Async Loading Strategy Backfiring

The current approach of `preload` + `onload="this.rel='stylesheet'"` for ALL four stylesheets (bootstrap, animations, font-awesome, main.css) is causing:
- **Flash of unstyled content** (FOUC) → contributes to CLS
- **Delayed rendering** of styled content

**Recommendation**: Load [bootstrap.min.css](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/css/bootstrap.min.css) and [main.css](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/css/main.css) as regular `<link rel="stylesheet">` (they're critical). Keep [animations.css](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/css/animations.css) and [font-awesome.css](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/css/font-awesome.css) as async if desired.

### 6. Image Delivery — 803 KiB Potential Savings

PageSpeed found ~803 KiB in image savings. The senior class image is still a [.jpg](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/images/404.jpg):
- [images/gallery/14.jpg](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/images/gallery/14.jpg) (line 462) — should be converted to WebP/AVIF
- `images/team/group_photo_coaches.jpg` (line 522) — should be converted to WebP
- [images/sign2w.png](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/images/sign2w.png) (line 389) — should be converted to WebP

### 7. Cache Headers Missing

Static assets need proper cache headers. Since you're on GitHub Pages, you get limited control, but you can:
- Use Cloudflare (if available) to set long cache TTLs
- Ensure image file names include content hashes for cache-busting

### 8. Accessibility Score 82 (Target: 90+)

Common issues to investigate:
- Check all interactive elements have sufficient color contrast
- Verify `<a>` tags with only icon content have `aria-label` (lines 418, 442, 467 — empty `<a>` tags wrapping class titles)
- The phone number display `+64278910027` should be formatted as `+64 27 891 0027` for readability

---

## 📊 Google Search Console Analysis

### Traffic Trends (Dec 2025 – Mar 2026)

| Period | Clicks | Impressions | CTR | Avg Position |
|--------|--------|-------------|-----|-------------|
| Dec 22-31, 2025 | 10 | 215 | 4.65% | 10.4 |
| Jan 2026 | 77 | 929 | 8.29% | 9.9 |
| Feb 2026 | 69 | 792 | 8.71% | 8.0 |
| Mar 1-21, 2026 | 33 | 496 | 6.65% | 8.4 |

**Trend**: Position improved from 10.4 → 8.0 (Jan-Feb) but slipped to 8.4 in March. CTR peaked at 8.71% in February.

### High-Value Keyword Opportunities

These queries have high impressions but your position is just off page 1 (positions 7-12). Moving these into the top 3-5 would dramatically increase clicks:

| Query | Impressions | Position | Opportunity |
|-------|-------------|----------|-------------|
| **judo** | 347 | 9.6 | 🔥 Huge volume, needs page 1 |
| **judo auckland** | 344 | 9.5 | 🔥 Primary target keyword |
| **judo near me** | 85 | 8.8 | 🔥 High-intent local query |
| **judo nz** | 69 | 9.6 | National brand visibility |
| **auckland judo** | 49 | 8.4 | Variant of primary keyword |
| **judo studio** | 30 | 3.7 | ✅ Already strong |
| **judo for kids** | 16 | 7.3 | Target parent audience |
| **judo club** | 16 | 12.7 | Needs content work |
| **judo classes near me** | 15 | 12.7 | Needs to break page 1 |

### Device Split

| Device | Clicks | Impressions | CTR | Avg Position |
|--------|--------|-------------|-----|-------------|
| Mobile | 132 | 1,384 | 9.54% | 6.73 |
| Desktop | 56 | 1,018 | 5.50% | 12.09 |
| Tablet | 1 | 30 | 3.33% | 10.20 |

> [!IMPORTANT]
> Mobile ranks significantly better (pos 6.7 vs 12.1 desktop). This aligns with the CLS issue — **fixing Desktop CLS could unlock significantly more desktop traffic**.

---

## ✅ What's Working Well

1. **Rich Schema Markup** — LocalBusiness + SportsActivityLocation + FAQPage schema are well-implemented
2. **Title & Meta Description** — Well-crafted, include target keywords
3. **Canonical URL** — Properly set
4. **Open Graph + Twitter Cards** — Complete
5. **Geo-meta tags** — Properly configured for Auckland/North Shore
6. **FAQ Section** — 8 well-written Q&As with matching FAQPage schema
7. **Image Alt Text** — All images have descriptive, keyword-rich alt text
8. **robots.txt** — Smart approach allowing AI search bots while blocking training bots
9. **llms.txt** — Ahead of the curve for AI search optimization
10. **LCP Image Preload** — Hero image is preloaded and has `fetchpriority="high"`
11. **Font preconnects & preloads** — Properly configured
12. **SR-only H1** — Good hidden H1 for accessibility + SEO
13. **External links to authority sites** — IJF, NZJF, Auckland Judo Association

---

## 📋 Prioritized Recommendations

### Priority 1 — Fix Now (Biggest SEO Impact)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | Fix duplicate URL (http www → https redirect) | 🔴 Critical | Low |
| 2 | Add `width`/`height` to all images (fix CLS) | 🔴 High | Low |
| 3 | Fix broken `</li>` HTML at line 264 | 🔴 Medium | Trivial |
| 4 | Convert remaining JPG/PNG images to WebP | ⚠️ High | Medium |

### Priority 2 — Improve Performance

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 5 | Inline critical CSS (at least base layout) | ⚠️ High | Medium |
| 6 | Load bootstrap + main.css as blocking stylesheets | ⚠️ High | Low |
| 7 | Audit [compressed.js](file:///Users/arthurab/Documents/coding/websites/northshorejudo/Smachine2014.github.io/js/compressed.js) (368KB) for unused code | ⚠️ Medium | High |
| 8 | Add `loading="lazy"` to below-the-fold images | ⚠️ Medium | Low |

### Priority 3 — Content & Keyword Optimization

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 9 | Create separate landing pages (e.g., `/kids-judo-auckland`, `/adult-judo-classes`) | 🔥 High | High |
| 10 | Add more content around "judo Auckland" and "judo near me" keywords | ⚠️ Medium | Medium |
| 11 | Add Google Business Profile link to `sameAs` in schema | ⚠️ Medium | Trivial |
| 12 | Add a `WebSite` schema with `SearchAction` (sitelinks search box) | ⚠️ Low | Low |

### Priority 4 — Polish

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 13 | Format phone number as `+64 27 891 0027` | Accessibility | Trivial |
| 14 | Fix empty `<a>` tags in class cards (add descriptive text or aria-label) | Accessibility | Low |
| 15 | Add `rel="noopener"` to external links missing it | Security | Trivial |
| 16 | Copyright year should auto-update (currently says "2021-present") | Trust | Trivial |

---

## Screenshots

### PageSpeed Insights — Desktop Diagnostics
![PageSpeed Insights desktop analysis showing diagnostics and opportunities](/Users/arthurab/.gemini/antigravity/brain/ea865035-b554-46c5-bf0c-edacae07b987/pagespeed_mobile_results_1774248246776.png)

---

*Report generated by SEO audit using PageSpeed Insights, Google Search Console data, source code analysis, and SEO best practices.*
