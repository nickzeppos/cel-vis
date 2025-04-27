import { Expectation, getExpectationColor } from "@/lib/expectations";
import { useMemo, useState } from "react";

export default function PerformanceBar({
  score,
  benchmark,
  range,
}: {
  score: number;
  benchmark: number;
  range?: [number, number];
}) {
  // State to track hover
  const [isHovered, setIsHovered] = useState(false);

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
  const expectation = useMemo(() => {
    if (score >= exceeds) return Expectation.EXCEEDS;
    if (score >= below) return Expectation.MEETS; 
    return Expectation.BELOW;
  }, [score, exceeds, below]);

  // Map values to Y positions (invert because SVG Y increases downward)
  const getYPosition = (value: number) => {
    const [min, max] = calculatedRange;
    const total = max - min;
    // Reserve space at top and bottom (20px each)
    const availableHeight = 260;
    const topPadding = 20;

    // Invert the Y position (higher values should be higher up)
    return (
      topPadding + availableHeight - ((value - min) / total) * availableHeight
    );
  };

  // Calculate positions
  const exceedsY = getYPosition(exceeds);
  const benchmarkY = getYPosition(benchmark);
  const belowY = getYPosition(below);
  const scoreY = getYPosition(score);

  // Get highlight range based on expectation
  const getHighlightRange = () => {
    switch (expectation) {
      case Expectation.EXCEEDS:
        // Highlight everything above exceeds line
        return { y: 20, height: exceedsY - 20 };
      case Expectation.MEETS:
        // Highlight between exceeds and below lines
        return { y: exceedsY, height: belowY - exceedsY };
      case Expectation.BELOW:
        // Highlight everything below the below line
        return { y: belowY, height: 280 - belowY };
    }
  };

  const highlightRange = getHighlightRange();

  // Format number for axis labels with 3 decimal places
  const formatValue = (value: number) => {
    return value.toFixed(3);
  };

  // Get darker shade of expectation color for the score marker
  const getDarkerColor = () => {
    const baseColor = getExpectationColor(expectation);
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
  const svgWidth = 100;
  const plotWidth = 20;
  const plotX = (svgWidth - plotWidth) / 2;
  const centerX = plotX + plotWidth / 2;

  // Label offset from the right edge of the plot
  const labelOffset = 5;

  // CSS transitions for labels
  const labelStyle = {
    opacity: isHovered ? 1 : 0,
    transition: isHovered 
      ? "opacity 150ms ease-in" 
      : "opacity 200ms ease-out"
  };

  return (
    <div 
      className="relative flex items-center justify-center w-[100px] h-[300px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="w-full h-full" viewBox="0 0 100 300">
        {/* Highlighted range */}
        <rect
          x={plotX}
          y={highlightRange?.y}
          width={plotWidth}
          height={highlightRange?.height}
          fill={getExpectationColor(expectation)}
          opacity="0.3"
        />

        {/* Center line */}
        <line
          x1={centerX}
          y1="20"
          x2={centerX}
          y2="280"
          stroke="#aaaaaa"
          strokeWidth="1"
        />

        {/* Threshold bars */}
        <rect
          x={plotX}
          y={exceedsY - 1.5}
          width={plotWidth}
          height="3"
          fill="#16a34a"
        />
        <rect
          x={plotX}
          y={benchmarkY - 1.5}
          width={plotWidth}
          height="3"
          fill="#2563eb"
        />
        <rect
          x={plotX}
          y={belowY - 1.5}
          width={plotWidth}
          height="3"
          fill="#dc2626"
        />

        {/* Score tick line across the plot */}
        <line
          x1={plotX}
          y1={scoreY}
          x2={plotX + plotWidth}
          y2={scoreY}
          stroke={markerColor}
          strokeWidth="1"
          strokeDasharray="2,2"
        />

        {/* Simple circle score marker */}
        <circle
          cx={centerX}
          cy={scoreY}
          r="5"
          fill={markerColor}
          stroke="#fff"
          strokeWidth="1"
        />

        {/* Labels */}
        {/* Score label - on left side */}
        <text
          x={plotX - 8}
          y={scoreY + 4}
          fontSize="10"
          fill="#444"
          textAnchor="end"
          style={labelStyle}
        >
          {formatValue(score)}
        </text>

        {/* Exceeds label - on right side */}
        <text
          x={plotX + plotWidth + labelOffset}
          y={exceedsY + 4}
          fontSize="10"
          fill="#16a34a"
          textAnchor="start"
          style={labelStyle}
        >
          {formatValue(exceeds)}
        </text>

        {/* Benchmark label - on right side */}
        <text
          x={plotX + plotWidth + labelOffset}
          y={benchmarkY + 4}
          fontSize="10"
          fill="#2563eb"
          textAnchor="start"
          style={labelStyle}
        >
          {formatValue(benchmark)}
        </text>

        {/* Below label - on right side */}
        <text
          x={plotX + plotWidth + labelOffset}
          y={belowY + 4}
          fontSize="10"
          fill="#dc2626"
          textAnchor="start"
          style={labelStyle}
        >
          {formatValue(below)}
        </text>
      </svg>
    </div>
  );
}
