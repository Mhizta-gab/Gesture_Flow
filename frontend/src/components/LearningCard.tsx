import React from 'react';
import { PlayCircleIcon, CheckCircleIcon, BookOpenIcon } from 'lucide-react';
interface LearningCardProps {
  title: string;
  description: string;
  duration: string;
  progress: number;
  image: string;
  isCompleted?: boolean;
}
const LearningCard: React.FC<LearningCardProps> = ({
  title,
  description,
  duration,
  progress,
  image,
  isCompleted = false
}) => {
  return <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {isCompleted && <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <CheckCircleIcon className="h-5 w-5" />
          </div>}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              {duration}
            </div>
            <span>{progress}% Complete</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 rounded-full h-2" style={{
            width: `${progress}%`
          }} />
          </div>
        </div>
        <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <PlayCircleIcon className="h-4 w-4 mr-2" />
          {isCompleted ? 'Review Lesson' : 'Continue Learning'}
        </button>
      </div>
    </div>;
};
export default LearningCard;