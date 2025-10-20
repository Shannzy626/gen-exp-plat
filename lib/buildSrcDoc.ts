import type { GridSize, PlacedItem } from "@/store/useBuilderStore";

export function buildSrcDocGrid(grid: GridSize, items: PlacedItem[]) {
  const rendered = items
    .map(
      (it) =>
        `<div style="grid-column: ${it.c + 1} / span ${it.w}; grid-row: ${it.r + 1} / span ${it.h};">${it.html}</div>`
    )
    .join("\n");

  return `<!doctype html>
<html style="height:100%">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-white text-gray-900" style="height:100%; margin:0;">
    <main class="grid" style="height:100%; width:100%; gap:0; grid-template-columns: repeat(${grid.cols}, minmax(0,1fr)); grid-template-rows: repeat(${grid.rows}, minmax(0,1fr));">
      ${rendered}
    </main>
  </body>
  </html>`;
}

