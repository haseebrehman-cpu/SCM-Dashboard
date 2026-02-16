import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface KpiInfo {
  metric: string;
  value: string;
  change: string;
  icon: string;
  bgColor: string;
  textColor: string;
  des: string;
}

interface KpiCardsProps {
  kpiInfo: KpiInfo;
}

const KpiCards: React.FC<KpiCardsProps> = ({ kpiInfo }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { metric, value, icon, bgColor, textColor, des } = kpiInfo;

  // const isPositive = change.startsWith('+');

  return (
    <div
      className={`${isDark ? "bg-gray-800" : "bg-white"} 
  p-6 rounded-md shadow-sm 
  hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`${isDark ? "text-white" : "text-gray-500"} 
            text-sm font-medium`}
          >{metric}</p>
          <span className="text-gray-400 text-xs">{des}</span>

          <h3
            className={`${isDark ? "text-white" : "text-gray-900"} 
              font-bold`}
          >{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      {/* 
      <div className="mt-4 flex items-center">
        <span
          className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {change}
        </span>
        <span className="text-gray-400 text-sm ml-2">vs last month</span>
      </div> */}
    </div>
  );
};

export default KpiCards;