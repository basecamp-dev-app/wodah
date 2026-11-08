import Script from 'next/script';
export default function Page(){return <><div id="workspace"><div className="boot"><h1>Wodah</h1><p>Loading the terrain workspace…</p><noscript>This map needs JavaScript. No account is required.</noscript></div></div><Script type="module" src="/app.mjs" strategy="afterInteractive"/></>}
