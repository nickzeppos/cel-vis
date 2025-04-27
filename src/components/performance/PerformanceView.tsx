import { getScorecardData, getTableData } from "@/services/api";
import { sortAscending } from "@/services/api.utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import PerformanceBar from "./PerformanceBar";
import { Expectation } from "@/lib/expectations";

interface Props {
  bioguideID: string;
  congress: number;
}

type PerformanceData = {
  congress: number;
  chamber: "H" | "S";
  score: number;
  benchmark: number;
};

// Common calculations needed by both PerformanceBar and PerformanceBarLabels
interface CalculatedBarData {
  exceedsY: number;
  benchmarkY: number;
  belowY: number;
  scoreY: number;
  expectation: Expectation;
  exceeds: number;
  below: number;
  plotX: number;
  plotWidth: number;
  centerX: number;
}

// Calculate all the necessary data for a performance bar
function calculateBarData(
  score: number,
  benchmark: number,
  range: [number, number],
  x: number,
  y: number,
  width: number,
  height: number
): CalculatedBarData {
  // Derive exceeds and below thresholds from benchmark
  const exceeds = benchmark * 1.5;
  const below = benchmark * 0.5;

  // Map values to Y positions (invert because SVG Y increases downward)
  const getYPosition = (value: number) => {
    const [min, max] = range;
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

  // Calculate positions
  const exceedsY = getYPosition(exceeds);
  const benchmarkY = getYPosition(benchmark);
  const belowY = getYPosition(below);
  const scoreY = getYPosition(score);

  // Calculate the expectation based on score relative to thresholds
  let expectation: Expectation;
  if (score >= exceeds) expectation = Expectation.EXCEEDS;
  else if (score >= below) expectation = Expectation.MEETS;
  else expectation = Expectation.BELOW;

  // Center the plot horizontally in the SVG
  const plotWidth = width;
  const plotX = x + (width - plotWidth) / 2;
  const centerX = plotX + plotWidth / 2;

  return {
    exceedsY,
    benchmarkY,
    belowY,
    scoreY,
    expectation,
    exceeds,
    below,
    plotX,
    plotWidth,
    centerX,
  };
}

// Component for rendering the labels for a hovered bar
function PerformanceBarLabels({
  score,
  benchmark,
  barData,
  x,
  y,
  width,
  height,
}: {
  score: number;
  benchmark: number;
  barData: CalculatedBarData;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  const {
    exceedsY,
    benchmarkY,
    belowY,
    scoreY,
    exceeds,
    below,
    plotX,
    plotWidth,
    centerX,
  } = barData;

  // Format number for axis labels with 3 decimal places
  const formatValue = (value: number) => {
    return value.toFixed(3);
  };

  const labelRightOffset = 20; // Increased offset to make space for connectors

  // Label dimensions
  const labelHeight = 20;
  const labelPadding = 10; // Minimum padding between labels
  const textPadding = 6; // Padding around text in label cards

  // Calculate label positions with overlap detection
  const calculateLabelPositions = useCallback(() => {
    // Initial positions - benchmark is fixed at its threshold position
    const benchmarkLabelY = benchmarkY - labelHeight / 2;
    const exceedsLabelY = exceedsY - labelHeight / 2;
    const belowLabelY = belowY - labelHeight / 2;

    // Check if exceeds label overlaps with benchmark label
    let adjustedExceedsY = exceedsLabelY;
    if (exceedsLabelY + labelHeight + labelPadding > benchmarkLabelY) {
      // Only push exceeds label up (never down)
      adjustedExceedsY = benchmarkLabelY - labelHeight - labelPadding;
    }

    // Check if below label overlaps with benchmark label
    let adjustedBelowY = belowLabelY;
    if (belowLabelY < benchmarkLabelY + labelHeight + labelPadding) {
      // Only push below label down (never up)
      adjustedBelowY = benchmarkLabelY + labelHeight + labelPadding;
    }

    return {
      score: scoreY - labelHeight / 2,
      exceeds: adjustedExceedsY,
      benchmark: benchmarkLabelY,
      below: adjustedBelowY,
    };
  }, [scoreY, exceedsY, benchmarkY, belowY, labelHeight, labelPadding]);

  const labelPositions = useMemo(
    () => calculateLabelPositions(),
    [calculateLabelPositions]
  );

  // Calculate text widths (approximate)
  const scoreTextWidth = formatValue(score).length * 6;
  const exceedsTextWidth = `Exceeds (${formatValue(exceeds)})`.length * 6;
  const benchmarkTextWidth = `Benchmark (${formatValue(benchmark)})`.length * 6;
  const belowTextWidth = `Below (${formatValue(below)})`.length * 6;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Score label - on left side */}
      <g>
        <rect
          x={plotX - scoreTextWidth - textPadding * 2}
          y={labelPositions.score}
          width={scoreTextWidth + textPadding * 2}
          height={labelHeight}
          rx={3}
          fill="white"
          stroke="#eee"
          strokeWidth={1}
        />
        <text
          x={plotX - textPadding}
          y={labelPositions.score + 14}
          fontSize="10"
          fill="#444"
          textAnchor="end"
        >
          {formatValue(score)}
        </text>

        {/* Connector line from score marker to label */}
        <path
          d={`M ${centerX} ${scoreY} 
              H ${(centerX + plotX - textPadding) / 2} 
              V ${labelPositions.score + labelHeight / 2} 
              H ${plotX - textPadding}`}
          stroke="#888"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2,1"
        />
      </g>

      {/* Exceeds label */}
      <g>
        <rect
          x={plotX + plotWidth + labelRightOffset}
          y={labelPositions.exceeds}
          width={exceedsTextWidth + textPadding * 2}
          height={labelHeight}
          rx={3}
          fill="white"
          stroke="#eee"
          strokeWidth={1}
        />
        <text
          x={plotX + plotWidth + labelRightOffset + textPadding}
          y={labelPositions.exceeds + 14}
          fontSize="10"
          fill="#16a34a"
        >
          Exceeds ({formatValue(exceeds)})
        </text>

        {/* Connector line from exceeds bar to label */}
        <path
          d={`M ${plotX + plotWidth} ${exceedsY} 
              H ${
                (plotX + plotWidth + (plotX + plotWidth + labelRightOffset)) /
                2
              } 
              V ${labelPositions.exceeds + labelHeight / 2} 
              H ${plotX + plotWidth + labelRightOffset}`}
          stroke="#16a34a"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* Benchmark label */}
      <g>
        <rect
          x={plotX + plotWidth + labelRightOffset}
          y={labelPositions.benchmark}
          width={benchmarkTextWidth + textPadding * 2}
          height={labelHeight}
          rx={3}
          fill="white"
          stroke="#eee"
          strokeWidth={1}
        />
        <text
          x={plotX + plotWidth + labelRightOffset + textPadding}
          y={labelPositions.benchmark + 14}
          fontSize="10"
          fill="#2563eb"
        >
          Benchmark ({formatValue(benchmark)})
        </text>

        {/* Connector line from benchmark bar to label */}
        <path
          d={`M ${plotX + plotWidth} ${benchmarkY} 
              H ${
                (plotX + plotWidth + (plotX + plotWidth + labelRightOffset)) /
                2
              } 
              V ${labelPositions.benchmark + labelHeight / 2} 
              H ${plotX + plotWidth + labelRightOffset}`}
          stroke="#2563eb"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* Below label */}
      <g>
        <rect
          x={plotX + plotWidth + labelRightOffset}
          y={labelPositions.below}
          width={belowTextWidth + textPadding * 2}
          height={labelHeight}
          rx={3}
          fill="white"
          stroke="#eee"
          strokeWidth={1}
        />
        <text
          x={plotX + plotWidth + labelRightOffset + textPadding}
          y={labelPositions.below + 14}
          fontSize="10"
          fill="#dc2626"
        >
          Below ({formatValue(below)})
        </text>

        {/* Connector line from below bar to label */}
        <path
          d={`M ${plotX + plotWidth} ${belowY} 
              H ${
                (plotX + plotWidth + (plotX + plotWidth + labelRightOffset)) /
                2
              } 
              V ${labelPositions.below + labelHeight / 2} 
              H ${plotX + plotWidth + labelRightOffset}`}
          stroke="#dc2626"
          strokeWidth="1"
          fill="none"
        />
      </g>
    </g>
  );
}

function PerformanceView({ bioguideID, congress }: Props) {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // TODO: single endpoint to get all this data
  const getPerformanceData = useCallback(
    (bioguideID: string) =>
      getScorecardData(congress, bioguideID)
        .then(({ data: { validCongresses } }) => validCongresses)
        .then((congresses) =>
          Promise.all(congresses.map(([congress]) => getTableData(congress)))
        )
        .then((tables) =>
          tables
            .map((t) => {
              const legislator = t.data.find((l) => l.bioguide === bioguideID);
              return legislator
                ? {
                    congress: t.congress,
                    chamber: legislator.chamber,
                    score: legislator.les,
                    benchmark: legislator.benchmark,
                  }
                : null;
            })
            .filter(notNull)
        )
        .then((data) => sortAscending(data, (d) => d.congress)),
    [congress]
  );

  useEffect(() => {
    setIsLoading(true);
    getPerformanceData(bioguideID)
      .then(setData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [bioguideID, getPerformanceData]);

  // Calculate global min/max range for all bars
  const globalRange = useMemo(() => {
    if (data.length === 0) return [0, 1] as [number, number];

    const allValues = data.flatMap((d) => {
      const exceeds = d.benchmark * 1.5;
      const below = d.benchmark * 0.5;
      return [d.score, d.benchmark, exceeds, below];
    });

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    // Add 20% margin
    const margin = (max - min) * 0.2;
    return [Math.max(0, min - margin), max + margin] as [number, number];
  }, [data]);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (data.length === 0) {
    return <div>No data</div>;
  }

  // Constants for SVG layout
  const leftMargin = 60;
  const barWidth = 20;
  const barHeight = 300;
  const spacing = 5;
  const svgWidth = data.length * (barWidth + spacing) - spacing + leftMargin;
  const svgHeight = barHeight;

  // Get the hovered bar data if any
  const hoveredBarData = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col">
      <div>{bioguideID}</div>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* Main layer for bars */}
        <g>
          {data.map((d, index) => {
            const xPosition = leftMargin + index * (barWidth + spacing);
            
            // Pre-calculate all the bar data
            const barData = calculateBarData(
              d.score,
              d.benchmark,
              globalRange,
              xPosition,
              0,
              barWidth,
              barHeight
            );
            
            // Set opacity based on hover state
            const isCurrentlyHovered = hoveredIndex === index;
            const opacity = hoveredIndex === null || isCurrentlyHovered ? 1 : 0.2;
            
            return (
              <g key={d.congress} opacity={opacity}>
                <PerformanceBar
                  score={d.score}
                  benchmark={d.benchmark}
                  range={globalRange}
                  x={xPosition}
                  y={0}
                  width={barWidth}
                  height={barHeight}
                  // Pass pre-calculated values
                  exceedsY={barData.exceedsY}
                  benchmarkY={barData.benchmarkY}
                  belowY={barData.belowY}
                  scoreY={barData.scoreY}
                  expectation={barData.expectation}
                  // Handle hover state
                  isHovered={isCurrentlyHovered}
                  onHover={(isHovered) => {
                    if (isHovered) {
                      setHoveredIndex(index);
                    } else if (hoveredIndex === index) {
                      setHoveredIndex(null);
                    }
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Single labels layer that only shows for the hovered bar */}
        {hoveredBarData && hoveredIndex !== null && (
          <PerformanceBarLabels
            score={hoveredBarData.score}
            benchmark={hoveredBarData.benchmark}
            barData={calculateBarData(
              hoveredBarData.score,
              hoveredBarData.benchmark,
              globalRange,
              leftMargin + hoveredIndex * (barWidth + spacing),
              0,
              barWidth,
              barHeight
            )}
            x={leftMargin + hoveredIndex * (barWidth + spacing)}
            y={0}
            width={barWidth}
            height={barHeight}
          />
        )}
      </svg>
    </div>
  );
}

export default function WithCongressList(props: Props) {
  return <PerformanceView {...props} />;
}

function notNull<T>(value: T | null): value is T {
  return value !== null;
}
