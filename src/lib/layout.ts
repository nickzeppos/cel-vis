// Breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Container
export const container = {
  maxWidth: 1180,
  padding: {
    x: 16,
    y: 32,
  },
  gap: {
    sm: 16,
    md: 24,
  },
} as const;

// Map Grid
export const mapGrid = {
  columns: 12,
  rows: 8,
  tileSize: 20,
  gap: 8,
  minWidth: 12 * 20 + 11 * 8, // columns * tileSize + (columns-1) * gap
} as const;

// Column Widths (as percentages)
export const columnWidths = {
  name: "50%",
  partyRank: "15%",
  benchmark: "15%",
  score: "20%",
} as const;

// Component Sizes
export const sizes = {
  controlPanel: {
    minWidth: mapGrid.minWidth,
    padding: 16,
    spacing: 16,
  },
  table: {
    minWidth: 600,
  },
  glossary: {
    padding: 16,
  },
} as const;

// Grid Areas
export const gridAreas = {
  mobile: [
    ["a"],
    ["b"],
    ["c"],
  ],
  desktop: [
    ["a", "b"],
    ["c", "b"],
  ],
} as const;

// Grid Templates
export const gridTemplates = {
  mobile: {
    columns: "1fr",
    rows: "min-content min-content min-content",
  },
  desktop: {
    columns: `minmax(${sizes.controlPanel.minWidth}px, 1fr) minmax(${sizes.table.minWidth}px, 2fr)`,
    rows: "min-content 1fr",
  },
} as const;

// Accessibility
export const a11y = {
  minTouchTarget: 44,
  minContrastRatio: 4.5,
} as const;
