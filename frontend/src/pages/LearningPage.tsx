import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { 
  BookOpenIcon, 
  ClockIcon, 
  UsersIcon, 
  StarIcon, 
  PlayIcon, 
  FilterIcon,
  SearchIcon,
  TrendingUpIcon,
  AwardIcon,
  TargetIcon
} from 'lucide-react';

// Course data structure
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  image: string;
  instructor: string;
  price: 'Free' | 'Premium';
  tags: string[];
  progress?: number;
  isEnrolled?: boolean;
}

// Mock course data
const courses: Course[] = [
  {
    id: 'asl-basics',
    title: 'ASL Basics: Your First Steps',
    description: 'Master the fundamentals of American Sign Language with this comprehensive beginner course. Learn the alphabet, numbers, and essential everyday phrases.',
    category: 'Fundamentals',
    level: 'Beginner',
    duration: '4-6 weeks',
    lessons: 24,
    students: 1247,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. Sarah Johnson',
    price: 'Free',
    tags: ['Alphabet', 'Numbers', 'Greetings', 'Basic Phrases'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 'asl-conversation',
    title: 'ASL Conversation Skills',
    description: 'Develop fluency in everyday conversations. Practice real-world scenarios and build confidence in your signing abilities.',
    category: 'Conversation',
    level: 'Intermediate',
    duration: '6-8 weeks',
    lessons: 32,
    students: 892,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instructor: 'Michael Chen',
    price: 'Premium',
    tags: ['Conversation', 'Daily Life', 'Social Skills', 'Fluency'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 'asl-business',
    title: 'ASL for Business & Professional Settings',
    description: 'Learn professional sign language for workplace communication, meetings, and business interactions.',
    category: 'Professional',
    level: 'Advanced',
    duration: '8-10 weeks',
    lessons: 28,
    students: 456,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instructor: 'Lisa Rodriguez',
    price: 'Premium',
    tags: ['Business', 'Professional', 'Workplace', 'Meetings'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 'asl-family',
    title: 'ASL for Families',
    description: 'Perfect for families with deaf members or those learning together. Family-friendly content and activities.',
    category: 'Family',
    level: 'Beginner',
    duration: '6-8 weeks',
    lessons: 20,
    students: 2341,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instructor: 'Emma Thompson',
    price: 'Free',
    tags: ['Family', 'Children', 'Home', 'Activities'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 'asl-medical',
    title: 'ASL for Healthcare Professionals',
    description: 'Essential sign language for medical settings. Learn to communicate effectively with deaf patients.',
    category: 'Healthcare',
    level: 'Intermediate',
    duration: '8-12 weeks',
    lessons: 36,
    students: 678,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. James Wilson',
    price: 'Premium',
    tags: ['Medical', 'Healthcare', 'Patient Care', 'Emergency'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 'asl-education',
    title: 'ASL for Educators',
    description: 'Designed for teachers and educational professionals working with deaf students or teaching ASL.',
    category: 'Education',
    level: 'Intermediate',
    duration: '10-12 weeks',
    lessons: 40,
    students: 523,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instructor: 'Prof. David Brown',
    price: 'Premium',
    tags: ['Education', 'Teaching', 'Classroom', 'Curriculum'],
    progress: 0,
    isEnrolled: false
  }
];

const categories = ['All', 'Fundamentals', 'Conversation', 'Professional', 'Family', 'Healthcare', 'Education'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const LearningPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesLevel && matchesSearch;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // Could add date field for proper sorting
        default:
          return 0;
      }
    });
  }, [selectedCategory, selectedLevel, searchQuery, sortBy]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/learning/course/${courseId}`);
  };

  const stats = useMemo(() => ({
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    averageRating: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1),
    freeCourses: courses.filter(course => course.price === 'Free').length
  }), []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                <BookOpenIcon className="w-8 h-8" />
                Sign Language Academy
              </h1>
              <p className="text-indigo-100 text-lg max-w-2xl">
                Master American Sign Language with expert-led courses, interactive lessons, and real-world practice.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <div className="text-indigo-200 text-sm">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-indigo-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.averageRating}</div>
                <div className="text-indigo-200 text-sm">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalCourses}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.freeCourses}</div>
            <div className="text-sm text-gray-600">Free Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Students</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'newest')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => handleCourseClick(course.id)}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.price === 'Free' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {course.price}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Beginner' ? 'bg-blue-500 text-white' :
                    course.level === 'Intermediate' ? 'bg-orange-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {course.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="w-4 h-4" />
                      {course.lessons} lessons
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                    {course.rating}
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    by {course.instructor}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <UsersIcon className="w-4 h-4" />
                    {course.students.toLocaleString()}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {course.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full"
                  variant={course.isEnrolled ? 'secondary' : 'primary'}
                >
                  {course.isEnrolled ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LearningPage;