import React from 'react';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
interface TimelineItemProps {
  date: string;
  time: string;
  text: string;
  accuracy: number;
  status: 'success' | 'error' | 'warning';
}
const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  time,
  text,
  accuracy,
  status
}) => {
  const statusColors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };
  const statusIcons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    error: <XCircleIcon className="h-5 w-5 text-red-500" />,
    warning: <XCircleIcon className="h-5 w-5 text-yellow-500" />
  };
  return <div className="flex gap-4 pb-8 relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
      {/* Date column */}
      <div className="w-32 flex-shrink-0 pt-3">
        <p className="text-sm font-medium text-gray-900">{date}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
      {/* Content */}
      <div className="flex-grow bg-white rounded-lg shadow p-4">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <p className="text-gray-900 font-medium">{text}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {accuracy}% Accuracy
              </span>
              {statusIcons[status]}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Play audio</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-3.536 5 5 0 00-1.414-3.536M2.757 17.657a9 9 0 012.829-6.364 9 9 0 00-2.829-6.364" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Download</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default TimelineItem;