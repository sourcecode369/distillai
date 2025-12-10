import React from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Custom tooltip with better styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatValue = (value) => {
      if (value === null || value === undefined) return '—';
      if (typeof value === 'number') return value.toLocaleString();
      if (typeof value === 'object') {
        // Handle objects like {date, count} - extract the numeric value
        if ('count' in value) return value.count?.toLocaleString() || '—';
        if ('value' in value) return value.value?.toLocaleString() || '—';
        // If it's an object, try to stringify safely
        return JSON.stringify(value);
      }
      return String(value);
    };

    return (
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200/80 dark:border-slate-700/80 rounded-xl shadow-xl p-3">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{label || 'Data'}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name || 'Value'}: <span className="font-bold">{formatValue(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Line Chart Component
export const AnalyticsLineChart = ({ data, color = "#6366f1", height = 300 }) => {
  const chartData = Array.isArray(data) ? data.map((item, index) => {
    // Handle different data formats
    if (typeof item === 'object' && item !== null) {
      if ('date' in item && 'count' in item) {
        return {
          name: item.date || `Day ${index + 1}`,
          value: item.count || 0,
        };
      }
      if ('label' in item && 'value' in item) {
        return {
          name: item.label || `Day ${index + 1}`,
          value: typeof item.value === 'number' ? item.value : 0,
        };
      }
      // If it's an object with a numeric property, try to extract it
      const numericValue = Object.values(item).find(v => typeof v === 'number');
      return {
        name: item.label || item.name || `Day ${index + 1}`,
        value: numericValue || 0,
      };
    }
    // Handle primitive values
    return {
      name: `Day ${index + 1}`,
      value: typeof item === 'number' ? item : 0,
    };
  }) : [];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          className="dark:stroke-slate-400"
          fontSize={11}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280"
          className="dark:stroke-slate-400"
          fontSize={11}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, r: 5 }}
          activeDot={{ r: 7, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

AnalyticsLineChart.propTypes = {
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  height: PropTypes.number,
};

// Bar Chart Component
export const AnalyticsBarChart = ({ data, color = "#14b8a6", height = 300, showValues = false }) => {
  const chartData = Array.isArray(data) ? data.map((item, index) => {
    // Handle different data formats
    if (typeof item === 'object' && item !== null) {
      if ('date' in item && 'count' in item) {
        return {
          name: item.date || `Item ${index + 1}`,
          value: item.count || 0,
        };
      }
      if ('label' in item && 'value' in item) {
        return {
          name: item.label || `Item ${index + 1}`,
          value: typeof item.value === 'number' ? item.value : 0,
        };
      }
      // If it's an object with a numeric property, try to extract it
      const numericValue = Object.values(item).find(v => typeof v === 'number');
      return {
        name: item.label || item.name || `Item ${index + 1}`,
        value: numericValue || 0,
      };
    }
    // Handle primitive values
    return {
      name: `Item ${index + 1}`,
      value: typeof item === 'number' ? item : 0,
    };
  }) : [];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          className="dark:stroke-slate-400"
          fontSize={11}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280"
          className="dark:stroke-slate-400"
          fontSize={11}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill={color}
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

AnalyticsBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  height: PropTypes.number,
  showValues: PropTypes.bool,
};

// Area Chart Component
export const AnalyticsAreaChart = ({ data, color = "#6366f1", height = 300 }) => {
  const chartData = Array.isArray(data) ? data.map((item, index) => {
    // Handle different data formats
    if (typeof item === 'object' && item !== null) {
      if ('date' in item && 'count' in item) {
        return {
          name: item.date || `Day ${index + 1}`,
          value: item.count || 0,
        };
      }
      if ('label' in item && 'value' in item) {
        return {
          name: item.label || `Day ${index + 1}`,
          value: typeof item.value === 'number' ? item.value : 0,
        };
      }
      // If it's an object with a numeric property, try to extract it
      const numericValue = Object.values(item).find(v => typeof v === 'number');
      return {
        name: item.label || item.name || `Day ${index + 1}`,
        value: numericValue || 0,
      };
    }
    // Handle primitive values
    return {
      name: `Day ${index + 1}`,
      value: typeof item === 'number' ? item : 0,
    };
  }) : [];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          className="dark:stroke-slate-400"
          fontSize={11}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280"
          className="dark:stroke-slate-400"
          fontSize={11}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fill={`url(#gradient-${color})`}
          strokeWidth={2.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

AnalyticsAreaChart.propTypes = {
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  height: PropTypes.number,
};

// Pie Chart Component
export const AnalyticsPieChart = ({ data, height = 300, colors = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"] }) => {
  const chartData = Array.isArray(data) ? data.map((item, index) => ({
    name: item.label || item.name || `Item ${index + 1}`,
    value: item.value || item,
  })) : [];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

