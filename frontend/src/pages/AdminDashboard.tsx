import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { 
  BookOpenIcon, 
  UsersIcon, 
  BarChart3Icon, 
  SettingsIcon, 
  PlusIcon,
  EditIcon,
  TrashIcon,
  UploadIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  TrendingUpIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

// Admin data structures
interface AdminStats {
  totalCourses: number;
  totalStudents: number;
  totalLessons: number;
  averageRating: number;
  activeUsers: number;
  revenue: number;
}

interface CourseAnalytics {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
  lastUpdated: string;
}

// Mock admin data
const adminStats: AdminStats = {
  totalCourses: 6,
  totalStudents: 5737,
  totalLessons: 156,
  averageRating: 4.7,
  activeUsers: 1243,
  revenue: 28450
};

const courseAnalytics: CourseAnalytics[] = [
  {
    id: 'asl-basics',
    title: 'ASL Basics: Your First Steps',
    enrollments: 1247,
    completionRate: 78,
    averageRating: 4.8,
    revenue: 0,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'asl-conversation',
    title: 'ASL Conversation Skills',
    enrollments: 892,
    completionRate: 65,
    averageRating: 4.9,
    revenue: 8920,
    lastUpdated: '2024-01-10'
  },
  {
    id: 'asl-business',
    title: 'ASL for Business & Professional Settings',
    enrollments: 456,
    completionRate: 72,
    averageRating: 4.7,
    revenue: 4560,
    lastUpdated: '2024-01-08'
  },
  {
    id: 'asl-family',
    title: 'ASL for Families',
    enrollments: 2341,
    completionRate: 85,
    averageRating: 4.9,
    revenue: 0,
    lastUpdated: '2024-01-12'
  },
  {
    id: 'asl-medical',
    title: 'ASL for Healthcare Professionals',
    enrollments: 678,
    completionRate: 68,
    averageRating: 4.8,
    revenue: 6780,
    lastUpdated: '2024-01-05'
  },
  {
    id: 'asl-education',
    title: 'ASL for Educators',
    enrollments: 523,
    completionRate: 71,
    averageRating: 4.6,
    revenue: 5230,
    lastUpdated: '2024-01-03'
  }
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'users' | 'analytics' | 'settings'>('overview');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleCreateCourse = () => {
    navigate('/admin/course/new');
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/admin/course/${courseId}`);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      toast.success('Course deleted successfully!');
    }
  };

  const handleUploadContent = (courseId: string) => {
    toast.info(`Upload content for ${courseId} - feature coming soon!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your sign language learning platform</p>
            </div>
            <Button onClick={handleCreateCourse} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Create New Course
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalCourses}</p>
              </div>
              <BookOpenIcon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalStudents.toLocaleString()}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalLessons}</p>
              </div>
              <BarChart3Icon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.averageRating}</p>
              </div>
              <StarIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.activeUsers.toLocaleString()}</p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${adminStats.revenue.toLocaleString()}</p>
              </div>
              <BarChart3Icon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3Icon },
                { id: 'courses', label: 'Course Management', icon: BookOpenIcon },
                { id: 'users', label: 'User Management', icon: UsersIcon },
                { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
                { id: 'settings', label: 'Settings', icon: SettingsIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">No recent activity to display</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button onClick={handleCreateCourse} className="flex items-center gap-2">
                      <PlusIcon className="w-4 h-4" />
                      Create Course
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <UploadIcon className="w-4 h-4" />
                      Upload Content
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" />
                      Manage Users
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'courses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Course Management</h3>
                  <Button onClick={handleCreateCourse} className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Add New Course
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courseAnalytics.map(course => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500">Last updated: {course.lastUpdated}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.enrollments.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${course.completionRate}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900">{course.completionRate}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="text-sm text-gray-900">{course.averageRating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${course.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCourse(course.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUploadContent(course.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <UploadIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <Button variant="outline" className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    Export Users
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Management Coming Soon</h3>
                  <p className="text-gray-600">Advanced user management features will be available here.</p>
                </div>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <BarChart3Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">Detailed analytics and reporting features will be available here.</p>
                </div>
              </div>
            )}

            {selectedTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Platform Settings</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
                  <p className="text-gray-600">Platform configuration and settings will be available here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
