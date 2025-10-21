import type { GridSize, PlacedItem } from "@/store/useBuilderStore";

// Configuration constants - single source of truth
const BASELINE_GRID = {
  ROWS: 4,
  COLS: 4,
} as const;

const SCALE_CONFIG = {
  MIN_FONT_SIZE: 0.6,  // Minimum readable font size in rem
  BASE_FONT_SIZE: 1.0, // Standard font size in rem
} as const;

/**
 * Calculates responsive base font size based on grid density
 * Font size decreases as grid becomes denser to prevent content overflow
 * @param gridRows - Current number of grid rows
 * @returns Font size in rem units, constrained to minimum readable size
 */
function calculateBaseFontSize(gridRows: number): number {
  const scaleFactor = BASELINE_GRID.ROWS / gridRows;
  const calculatedSize = SCALE_CONFIG.BASE_FONT_SIZE * scaleFactor;
  return Math.max(SCALE_CONFIG.MIN_FONT_SIZE, calculatedSize);
}

/**
 * Generates CSS for responsive scaling based on grid size
 * @param grid - Grid dimensions (rows and columns)
 * @returns CSS string for responsive typography and spacing
 */
function generateScalingCSS(grid: GridSize): string {
  const baseFontSize = calculateBaseFontSize(grid.rows);
  const spacingScale = BASELINE_GRID.ROWS / grid.rows;
  
  return `
    /* Responsive scaling based on grid density */
    body {
      font-size: ${baseFontSize}rem;
    }
    
    /* Scale spacing proportionally to prevent overflow */
    .grid > div {
      --spacing-scale: ${spacingScale};
    }
  `.trim();
}

/**
 * Generates inline styles for a grid item wrapper
 * Ensures components occupy correct grid cells with flexible sizing
 * @param item - Placed component with position and span information
 * @returns Inline CSS string for grid item positioning
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
 * Allows scrolling if content legitimately exceeds available space
 * @returns Inline CSS string for content container
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
 * Includes responsive scaling CSS and all placed components
 * @param grid - Grid dimensions (rows and columns)
 * @param items - Array of placed components with their positions
 * @returns Complete HTML document string ready for iframe srcDoc
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
  
  const scalingCSS = generateScalingCSS(grid);

  return `<!doctype html>
<html style="height:100%">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${scalingCSS}</style>
  </head>
  <body class="bg-white text-gray-900" style="height:100%; margin:0;">
    <main class="grid" style="height:100%; width:100%; gap:0; grid-template-columns: repeat(${grid.cols}, minmax(0,1fr)); grid-template-rows: repeat(${grid.rows}, minmax(0,1fr));">
      ${rendered}
    </main>
  </body>
  </html>`;
}

