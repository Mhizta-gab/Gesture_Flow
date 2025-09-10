import React, { useState } from 'react';
// import { a }from 'react-router-dom';
import { BellIcon, SearchIcon, MenuIcon, XIcon } from 'lucide-react';
import Button from './Button';
import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
interface NavbarProps {
  toggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}
const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  showSidebarToggle = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const {
  //   isAuthenticated,
  //   user,
  //   logout
  // } = useAuth();
  const { user } = useUser();
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  // Landing page navbar
  if (!showSidebarToggle) {
    return (
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between relative">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">SignFlow</span>
          </a>
          {/* Desktop nav links */}
          <div className="hidden md:flex ml-10 space-x-8">
            <a href="/" className="text-gray-700 hover:text-indigo-600">Home</a>
            <a href="/#features" className="text-gray-700 hover:text-indigo-600">Features</a>
            <a href="/#how-it-works" className="text-gray-700 hover:text-indigo-600">How it Works</a>
            <a href="/#testimonials" className="text-gray-700 hover:text-indigo-600">Testimonials</a>
          </div>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none">
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline text-gray-700 font-medium">
                {user?.fullName || user?.username || 'User'}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="small">Sign In</Button>
            </SignInButton>
            <a href="/sign-up">
              <Button size="small">Sign Up</Button>
            </a>
          </SignedOut>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 flex flex-col md:hidden animate-fade-in">
            <a href="/" className="px-6 py-3 text-gray-700 hover:text-indigo-600 border-b">Home</a>
            <a href="/#features" className="px-6 py-3 text-gray-700 hover:text-indigo-600 border-b">Features</a>
            <a href="/#how-it-works" className="px-6 py-3 text-gray-700 hover:text-indigo-600 border-b">How it Works</a>
            <a href="/#testimonials" className="px-6 py-3 text-gray-700 hover:text-indigo-600 border-b">Testimonials</a>
            <div className="flex flex-col px-6 py-3 space-y-2">
              <SignedIn>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">{user?.fullName || user?.username || 'User'}</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="small" className="w-full">Sign In</Button>
                </SignInButton>
                <a href="/sign-up">
                  <Button size="small" className="w-full">Sign Up</Button>
                </a>
              </SignedOut>
            </div>
          </div>
        )}
      </nav>
    );
  }
  // Dashboard navbar
  return <nav className="bg-white shadow-sm py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {showSidebarToggle && <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none mr-2">
            <MenuIcon className="h-6 w-6" />
          </button>}
        <div className="relative w-64 max-w-xs hidden md:block">
          <input type="text" placeholder="Search..." className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-md focus:outline-none focus:bg-white focus:border-indigo-300" />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
          <BellIcon className="h-6 w-6" />
        </button>
        {/* Clerk Auth UI */}
        <SignedIn>
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline text-gray-700 font-medium">
              {user?.fullName || user?.username || 'User'}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="small">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>;
};
export default Navbar;