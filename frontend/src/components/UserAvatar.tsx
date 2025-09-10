import React from 'react';
import { UserIcon } from 'lucide-react';
interface UserAvatarProps {
  name: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}
const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  size = 'md',
  showDetails = false
}) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  return <div className="flex items-center">
      <div className={`${sizeClasses[size]} rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium`}>
        {initials || <UserIcon className="w-5 h-5" />}
      </div>
      {showDetails && <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          {email && <p className="text-xs text-gray-500">{email}</p>}
        </div>}
    </div>;
};
export default UserAvatar;