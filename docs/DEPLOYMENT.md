# Deployment target

Verified existing Vercel project `trycvpilot`, ID `prj_u6h1BoV5yqrayzk28vscsukRirZW`, account `team_tcNouhefr1v2noO5H49z2nEp` (hadow / gsyrocks-projects-04d12dbb). Existing production was `dpl_FWGy15JREvxcsNyEwX27dNiw14kM`, commit `36affcf7f4cf9c51a339ba61ae8c99cb1e3a3989`, from `basecamp-dev-app/trycvpilot`. Verified custom alias: `wodah.com`. `www.wodah.com` was not in the project's returned domain list; it requires separate verification before claiming that hostname works.

Local `/home/hadow/trycvpilot` was clean and its remote was `git@github.com:washwalk/trycvpilot.git`. It has been left untouched. Wodah source is in a new directory/repository, `basecamp-dev-app/wodah`, branch `codex/wodah-mvp`, preserving the old application/history.

No secrets, original TIFF or paid infrastructure are required. Static assets are derived from the real source; Next.js exports `out/`. Local shell networking is blocked; release operations use connected GitHub/Vercel tools. Release status is recorded in the final handoff and subsequent updates to this file.

## Production release

Vercel production deployment `dpl_GYZKFyAtAvr2oT1i4W2Y6gpbyLhq` is READY from `basecamp-dev-app/wodah` branch `main`, tested application commit `50341728f57bdddeda87bfbd5af8795f70d32592`. Its custom alias is `https://wodah.com`. The preview `dpl_GvzDTpd6BFH2NNyGWzeArUgg9x5s` also reached READY. The first preview failed due to an explicit `out` Output Directory override; using the Next.js default output setting resolved it. Retain framework Next.js, build `npm run build`, and default Output Directory (do not override it to `out` in Vercel). The source still exports a static `out/` directory for generic static hosting.

The owner added the required Cloudflare TXT record and `www.wodah.com` is now verified in the same project, configured as a 308 redirect to `wodah.com`. Authoritative DNS remains Cloudflare; unrelated records were preserved. No services were purchased.

The connected Vercel fetch helper is denied alias/protection access (403); local sockets/network are restricted. The public-site browser workflow in GitHub Actions provides live HTTP and interaction verification independently of that helper. Consult the latest workflow run for its final status.
