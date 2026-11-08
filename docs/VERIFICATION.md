# Verification record

2026-11-08. Source inspection verified the expected dimensions, float32 band, EPSG:27700, 1m pixels, bounds and extrema. No nodata cells. SHA-256: `0b0a980aa621c8d329b332414931b23671cad6e5bf6ead7cf9f94bdcf2c5f002`.

Local checks: 8 meaningful numerical tests pass; TypeScript check and Next.js production static build pass. Tests cover a 9m³ synthetic basin, excluded disconnected depression, open escape route, nodata/study-edge truncation, monotonic area, OS published projection control/round trips, chainage spacing and robust rank changes. Synthetic geometric volume is a numerical-core check only, never a site storage estimate.

Local browser/server execution is blocked by the managed environment: server socket creation returns EPERM; Chrome exits at crashpad setsockopt with Operation not permitted. GitHub Actions runs the browser fixture against the real built data without a server (Playwright intercepts static requests). It uses explicitly arbitrary QA geometry, never presented as the actual restoration stretch. The fixture exercises drawing, setup import/persistence, native raster worker results, scenario change, CSV, GeoJSON, print/PDF and responsive screenshots. See the workflow run for the final browser result.

## Browser verification passed

GitHub Actions run [42499260307](https://github.com/basecamp-dev-app/wodah/actions/runs/42499260307) passed for commit `50341728f57bdddeda87bfbd5af8795f70d32592`. All eight numerical tests, type check, lint, production build and complete browser fixture passed. Five arbitrary QA candidates produced 90 calculated candidate/level/sensitivity rows; CSV and GeoJSON were checked, volumes remained null, setup survived refresh, and desktop/mobile screenshots plus printable PDF were produced. No browser JavaScript errors or mobile horizontal overflow were detected. Desktop screenshot was inspected. The unchanged raster worker was also exercised locally against real PNG tiles using Node canvas/fetch shims; footprint cell count matched calculated area.

The browser test accepts `WODAH_BASE_URL=https://wodah.com` to exercise the same workflow against the public deployment, verify the source metadata hash, and check the www redirect. Production verification runs on main after the static fixture.
