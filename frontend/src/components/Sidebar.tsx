import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, VideoIcon, SettingsIcon, HistoryIcon, XIcon } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose
}) => {
  const location = useLocation();
  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isOpen && onClose && window.innerWidth < 768) {
      onClose();
    }
  }, [location.pathname]);
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const menuItems = [{
    name: 'Dashboard',
    icon: <HomeIcon size={20} />,
    path: '/dashboard'
  }, {
    name: 'Detection',
    icon: <VideoIcon size={20} />,
    path: '/detection'
  }, {
    name: 'History',
    icon: <HistoryIcon size={20} />,
    path: '/history'
  }];
  return <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={onClose} />}
      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative md:translate-x-0 z-30 w-64 h-full bg-indigo-800 text-white transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-5 border-b border-indigo-700 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Gesture Flow</span>
          </Link>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-white hover:text-gray-200">
            <XIcon size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <nav>
            <ul className="space-y-2">
              {menuItems.map(item => <li key={item.name}>
                  <Link to={item.path} className={`flex items-center p-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700'}`}>
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>)}
            </ul>
          </nav>
        </div>
        {/* User profile section at bottom */}
        <div className="p-5 border-t border-indigo-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-lg font-semibold">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-indigo-300">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default Sidebar;