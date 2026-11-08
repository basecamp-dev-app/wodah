# Verification record

2026-11-08. Source inspection verified the expected dimensions, float32 band, EPSG:27700, 1m pixels, bounds and extrema. No nodata cells. SHA-256: `0b0a980aa621c8d329b332414931b23671cad6e5bf6ead7cf9f94bdcf2c5f002`.

Local checks: 8 meaningful numerical tests pass; TypeScript check and Next.js production static build pass. Tests cover a 9m³ synthetic basin, excluded disconnected depression, open escape route, nodata/study-edge truncation, monotonic area, OS published projection control/round trips, chainage spacing and robust rank changes. Synthetic geometric volume is a numerical-core check only, never a site storage estimate.

Local browser/server execution is blocked by the managed environment: server socket creation returns EPERM; Chrome exits at crashpad setsockopt with Operation not permitted. GitHub Actions runs the browser fixture against the real built data without a server (Playwright intercepts static requests). It uses explicitly arbitrary QA geometry, never presented as the actual restoration stretch. The fixture exercises drawing, setup import/persistence, native raster worker results, scenario change, CSV, GeoJSON, print/PDF and responsive screenshots. See the workflow run for the final browser result.
