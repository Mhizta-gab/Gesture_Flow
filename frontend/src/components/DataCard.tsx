import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
interface DataCardProps {
  title: string;
  value: string | number;
  change: number;
  period?: string;
  icon?: React.ReactNode;
}
const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  change,
  period = 'vs last week',
  icon
}) => {
  const isPositive = change >= 0;
  return <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && <div className="p-3 bg-indigo-50 rounded-lg">{icon}</div>}
      </div>
      <div className="mt-4 flex items-center">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${isPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
          {isPositive ? <TrendingUpIcon className="h-4 w-4 mr-1" /> : <TrendingDownIcon className="h-4 w-4 mr-1" />}
          {Math.abs(change)}%
        </span>
        <span className="ml-2 text-sm text-gray-500">{period}</span>
      </div>
    </div>;
};
export default DataCard;