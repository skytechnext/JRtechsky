# Project: JR Tech Solution — Static Site Export

This repository holds a static, WordPress-free export of **https://jrtech.com.my/**.
See `README.md` for the full overview. The exported site lives in `jrtech.com.my/`
(open `jrtech.com.my/index.html`).

## Working preferences (apply in every response)

- **Always include a "Links" section** listing the relevant URLs (1-click live preview,
  repo/branch, original source site).
- **For any GitHub-hosted static site, provide a 1-click preview link** via raw.githack.com.
  Pattern: take the file's GitHub URL, swap `github.com` → `raw.githack.com`, drop `/blob/`:
  `https://raw.githack.com/<owner>/<repo>/<branch-or-sha>/<path>/index.html`

## 1-click preview for this site

https://raw.githack.com/skytechnext/JRtechsky/claude/lucid-mendel-7jhfcx/jrtech.com.my/index.html

(Branch-based, so it auto-updates on every push. For a frozen link, swap in a commit SHA
and use `rawcdn.githack.com`.)

## How this export was produced

- Crawled with `wget --mirror --page-requisites --convert-links --adjust-extension`,
  seeded from the WordPress sitemap (`wp-sitemap.xml`, 221 content URLs; recursion found more).
- The PHP `Warning:` preamble that the broken `wp-config.php` prepends to every page was
  stripped from every `.html` file.
- Media referenced via `srcset` / lazy-load was back-filled.
- External resources (Google Fonts, etc.) still load from their original CDNs; all
  first-party content is local.

## To refresh the export

Re-run the crawl (sitemap-seeded `wget` mirror), strip the warning preamble, then
recommit the `jrtech.com.my/` directory.
