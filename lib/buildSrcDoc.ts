export function buildSrcDoc(zones: Record<string, string[]>) {
  const html = [
    ...(zones.header || []),
    ...(zones.main || []),
    ...(zones.footer || []),
  ].join("\n\n");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-white text-gray-900">
    ${html}
  </body>
  </html>`;
}

