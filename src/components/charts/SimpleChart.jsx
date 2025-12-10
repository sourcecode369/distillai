import React from "react";
import PropTypes from "prop-types";

/**
 * Simple Line Chart Component
 * Creates a simple SVG-based line chart
 */
export const LineChart = ({ data, width = "100%", height = 200, color = "#6366f1", showGrid = true }) => {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = typeof width === "number" ? width : 400;
  const chartHeight = typeof height === "number" ? height : 200;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.count || d.value || 0));
  const minValue = Math.min(...data.map((d) => d.count || d.value || 0));
  const range = maxValue - minValue || 1;

  const xScale = (index) => (index / (data.length - 1 || 1)) * innerWidth;
  const yScale = (value) => innerHeight - ((value - minValue) / range) * innerHeight;

  const points = data.map((d, i) => ({
    x: padding.left + xScale(i),
    y: padding.top + yScale(d.count || d.value || 0),
  }));

  const pathData = points
    .map((point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
    .join(" ");

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full h-full">
      {showGrid && (
        <g>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + ratio * innerHeight;
            const value = Math.round(minValue + (1 - ratio) * range);
            return (
              <g key={`grid-${ratio}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.5"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </g>
      )}
      {/* Area fill */}
      <path
        d={`${pathData} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`}
        fill={`url(#gradient-${color.replace("#", "")})`}
        opacity="0.2"
      />
      <defs>
        <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Points */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      ))}
      {/* X-axis labels */}
      <g transform={`translate(${padding.left}, ${padding.top + innerHeight})`}>
        {data.map((d, i) => {
          if (data.length > 10 && i % Math.ceil(data.length / 5) !== 0) return null;
          const x = xScale(i);
          const label = d.date ? new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : d.label || i;
          return (
            <text
              key={i}
              x={x}
              y={20}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity="0.6"
            >
              {label}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      value: PropTypes.number,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      label: PropTypes.string,
    })
  ).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
  color: PropTypes.string,
  showGrid: PropTypes.bool,
};

/**
 * Simple Bar Chart Component
 */
export const BarChart = ({ data, width = "100%", height = 200, color = "#14b8a6", showValues = false }) => {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = typeof width === "number" ? width : 400;
  const chartHeight = typeof height === "number" ? height : 200;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value || d.count || 0));
  const barWidth = innerWidth / data.length - 4;
  const barSpacing = 4;

  const yScale = (value) => ((maxValue - value) / maxValue || 0) * innerHeight;

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full h-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = padding.top + ratio * innerHeight;
        const value = Math.round(maxValue * (1 - ratio));
        return (
          <g key={`grid-${ratio}`}>
            <line
              x1={padding.left}
              y1={y}
              x2={padding.left + innerWidth}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.1"
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="currentColor"
              opacity="0.5"
            >
              {value}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const value = d.value || d.count || 0;
        const barHeight = yScale(value);
        const x = padding.left + i * (barWidth + barSpacing);
        return (
          <g key={i}>
            <rect
              x={x}
              y={padding.top + barHeight}
              width={barWidth}
              height={innerHeight - barHeight}
              fill={d.color || color}
              rx="4"
              className="hover:opacity-80 transition-opacity"
            />
            {showValues && value > 0 && (
              <text
                x={x + barWidth / 2}
                y={padding.top + barHeight - 5}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                fontWeight="600"
              >
                {value}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={padding.top + innerHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity="0.6"
            >
              {d.label || i}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      count: PropTypes.number,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
  color: PropTypes.string,
  showValues: PropTypes.bool,
};

/**
 * Histogram/Score Distribution Chart
 */
export const HistogramChart = ({ data, width = "100%", height = 200, color = "#6366f1" }) => {
  if (!data || typeof data !== "object") return null;

  const buckets = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values);

  const chartData = buckets.map((bucket, i) => ({
    label: bucket,
    value: values[i],
    color: i < 2 ? "#ef4444" : i < 3 ? "#f59e0b" : i < 4 ? "#3b82f6" : "#10b981",
  }));

  return <BarChart data={chartData} width={width} height={height} showValues={true} />;
};

HistogramChart.propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
  color: PropTypes.string,
};


