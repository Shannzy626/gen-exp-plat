import type { GridSize, PlacedItem } from "@/store/useBuilderStore";

/**
 * Generates inline styles for a grid item wrapper
 * Ensures components scale properly within their allocated grid cells
 */
function getGridItemWrapperStyles(item: PlacedItem): string {
  return `
    grid-column: ${item.c + 1} / span ${item.w}; 
    grid-row: ${item.r + 1} / span ${item.h}; 
    min-height: 0;
    min-width: 0;
    display: flex;
    overflow: hidden;
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Generates inline styles for the inner content wrapper
 * Allows scrolling if content exceeds available space
 */
function getContentWrapperStyles(): string {
  return `
    width: 100%; 
    height: 100%; 
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Builds the complete HTML document for the iframe preview
 * @param grid - Grid dimensions (rows and columns)
 * @param items - Array of placed components with their positions
 * @returns Complete HTML document string
 */
export function buildSrcDocGrid(grid: GridSize, items: PlacedItem[]): string {
  const rendered = items
    .map((item) => `
      <div style="${getGridItemWrapperStyles(item)}">
        <div style="${getContentWrapperStyles()}">
          ${item.html}
        </div>
      </div>
    `.trim())
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

