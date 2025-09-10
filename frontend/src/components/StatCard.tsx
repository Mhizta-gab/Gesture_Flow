import React from 'react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className = ''
}) => {
  return <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change && <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                {change.positive ? '+' : ''}
                {change.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>}
        </div>
        <div className="p-3 bg-indigo-50 rounded-md">{icon}</div>
      </div>
    </div>;
};
export default StatCard;