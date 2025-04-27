import { Expectation, getExpectationColor } from "@/lib/expectations";
import { useMemo } from "react";

export interface PerformanceBarProps {
  score: number;
  benchmark: number;
  range?: [number, number];
  // Positioning and sizing
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // Calculated values
  exceedsY?: number;
  benchmarkY?: number;
  belowY?: number;
  scoreY?: number;
  expectation?: Expectation;
  // Hover state
  isHovered?: boolean;
  onHover?: (isHovered: boolean) => void;
}

export default function PerformanceBar({
  score,
  benchmark,
  range,
  // Default values for positioning and sizing
  x = 0,
  y = 0,
  width = 100,
  height = 300,
  // Pre-calculated values
  exceedsY,
  benchmarkY,
  belowY,
  scoreY,
  expectation,
  // Hover state
  isHovered = false,
  onHover,
}: PerformanceBarProps) {
  // Derive exceeds and below thresholds from benchmark
  const exceeds = benchmark * 1.5;
  const below = benchmark * 0.5;

  // Calculate dynamic range if not provided
  const calculatedRange = useMemo(() => {
    if (range) return range;

    // Find min and max values
    const values = [score, exceeds, below, benchmark];
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Add 20% margin to top and bottom
    const margin = (max - min) * 0.2;
    return [Math.max(0, min - margin), max + margin] as [number, number];
  }, [score, exceeds, below, benchmark, range]);

  // Calculate the expectation based on score relative to thresholds
  const calculatedExpectation = useMemo(() => {
    if (score >= exceeds) return Expectation.EXCEEDS;
    if (score >= below) return Expectation.MEETS;
    return Expectation.BELOW;
  }, [score, exceeds, below]);

  // Map values to Y positions (invert because SVG Y increases downward)
  const getYPosition = (value: number) => {
    const [min, max] = calculatedRange;
    const total = max - min;
    // Reserve space at top and bottom (20px each)
    const availableHeight = height - 40; // 20px padding on top and bottom
    const topPadding = 20;

    // Invert the Y position (higher values should be higher up)
    return (
      y +
      topPadding +
      availableHeight -
      ((value - min) / total) * availableHeight
    );
  };

  // Calculate positions if not provided
  const calculatedExceedsY = exceedsY ?? getYPosition(exceeds);
  const calculatedBenchmarkY = benchmarkY ?? getYPosition(benchmark);
  const calculatedBelowY = belowY ?? getYPosition(below);
  const calculatedScoreY = scoreY ?? getYPosition(score);
  const finalExpectation = expectation ?? calculatedExpectation;

  // Get highlight range based on expectation
  const getHighlightRange = () => {
    switch (finalExpectation) {
      case Expectation.EXCEEDS:
        // Highlight everything above exceeds line
        return { y: y + 20, height: calculatedExceedsY - (y + 20) };
      case Expectation.MEETS:
        // Highlight between exceeds and below lines
        return { y: calculatedExceedsY, height: calculatedBelowY - calculatedExceedsY };
      case Expectation.BELOW:
        // Highlight everything below the below line
        return { y: calculatedBelowY, height: y + height - calculatedBelowY - 20 };
    }
  };

  const highlightRange = getHighlightRange();

  // Get darker shade of expectation color for the score marker
  const getDarkerColor = () => {
    const baseColor = getExpectationColor(finalExpectation);
    // Convert hex to RGB, darken it, and convert back to hex
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Darken by multiplying by 0.7
    const darkerR = Math.floor(r * 0.7);
    const darkerG = Math.floor(g * 0.7);
    const darkerB = Math.floor(b * 0.7);

    return `#${darkerR.toString(16).padStart(2, "0")}${darkerG
      .toString(16)
      .padStart(2, "0")}${darkerB.toString(16).padStart(2, "0")}`;
  };

  const markerColor = getDarkerColor();

  // Center the plot horizontally in the SVG
  const plotWidth = width;
  const plotX = x + (width - plotWidth) / 2;
  const centerX = plotX + plotWidth / 2;

  // Create a group element for mouse events
  return (
    <g
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Highlighted range */}
      <rect
        x={plotX}
        y={highlightRange?.y}
        width={plotWidth}
        height={highlightRange?.height}
        fill={getExpectationColor(finalExpectation)}
        opacity="0.3"
      />

      {/* Center line */}
      <line
        x1={centerX}
        y1={y + 20}
        x2={centerX}
        y2={y + height - 20}
        stroke="#aaaaaa"
        strokeWidth="1"
      />

      {/* Threshold bars */}
      <rect
        x={plotX}
        y={calculatedExceedsY - 1.5}
        width={plotWidth}
        height="3"
        fill="#16a34a"
      />
      <rect
        x={plotX}
        y={calculatedBenchmarkY - 1.5}
        width={plotWidth}
        height="3"
        fill="#2563eb"
      />
      <rect
        x={plotX}
        y={calculatedBelowY - 1.5}
        width={plotWidth}
        height="3"
        fill="#dc2626"
      />

      {/* Score tick line across the plot */}
      <line
        x1={plotX}
        y1={calculatedScoreY}
        x2={plotX + plotWidth}
        y2={calculatedScoreY}
        stroke={markerColor}
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* Simple circle score marker */}
      <circle
        cx={centerX}
        cy={calculatedScoreY}
        r="5"
        fill={markerColor}
        stroke="#fff"
        strokeWidth="1"
      />
    </g>
  );
}
