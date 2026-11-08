# Wodah

Terrain-based floodplain opportunity screening for a user-defined River Gara restoration stretch. Next.js 16 / React 19 static export, Leaflet map, native browser worker. No backend, accounts, AI API or monitoring dependency.

## Run

Node 24 recommended. `npm ci`, `npm test`, `npm run check`, `npm run build`, `npm run dev`. Static output: `out/`. Serve via `python3 -m http.server 3000 --directory out` after building. No environment secrets needed.

## Define your exact stretch

1. Open the map; enable OpenStreetMap for river/road context if useful. Display conversion is approximate (3–5 m), analysis remains BNG.
2. Draw river: click along your exact centreline including both endpoints, then Finish drawing. Do not infer the study from a postcode.
3. Draw boundary: click around the surrounding floodplain, then Finish. Include enough land to investigate edge contacts. Use Edit vertices to drag points. Redrawing replaces the previous geometry only when finished. Undo removes the last drawing point.
4. Set interval, search radius, elevation stress test and assumed channel exclusion. Generate candidates. Select candidates on map, tabs or table. Change level and relative stress test; inspect footprint, cross-section, curves and edge indicators.
5. Save setup downloads a projected JSON backup; setup also survives refresh in this browser. Import it on another device. Export CSV and GeoJSON; Print report saves a PDF through your browser.

The application starts empty. No restoration endpoints, demonstration candidates or site findings are fabricated.

## Reproduce terrain preparation

Source TIFF stays outside this repository and unchanged. Obtain its licence/provenance record from the source owner.

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python scripts/preprocess.py /home/hadow/Downloads/washwalk.tif
npm run build
```

Outputs: 100 native 500 × 500 PNG data tiles, a 5 m display overview, metadata with SHA-256 and embedded tags. Original resolution retained; values encoded to centimetres (±0.005 m), nodata explicit. See [full method](public/methods.html) or `/methods.html` in the app. Calculation lives in `public/model.mjs` and `public/analysis.worker.mjs`; browser orchestration and exports in `public/app.mjs`.

## Scientific scope

Four-neighbour connectivity below flat assumed source-elevation surfaces, clipped to study and bounded windows. No virtual barrier or hydraulic calculation. Ranking is minimum off-channel area across nominal and ±chosen elevation stress tests. Cross-valley relief, gradient, sensitivity rank changes and edge flags accompany area-only rankings. Source type/date/vertical datum/bathymetry unknown. Retained-volume results are unavailable everywhere for this data. Connected area is not containable storage. Candidates may overlap and must not be added.

## Verification / deployment

`tests/model.test.mjs` covers known basin geometry, disconnected low ground, escape, nodata/study truncation, monotonic area, coordinate controls/round trips, candidate sampling and robust rankings. `scripts/browser-test.cjs` exercises the real raster workflow with a clearly labelled arbitrary test geometry in an isolated browser, not a claimed restoration stretch. See `docs/VERIFICATION.md` for results.

Existing CV checkout and Git history are preserved separately in `/home/hadow/trycvpilot`. The existing Vercel target was verified as `prj_u6h1BoV5yqrayzk28vscsukRirZW` in account `team_tcNouhefr1v2noO5H49z2nEp`, serving `wodah.com`. New source belongs to `basecamp-dev-app/wodah`; do not push changes to the CV repository. See `docs/DEPLOYMENT.md` for the verified release status and any blockers.
