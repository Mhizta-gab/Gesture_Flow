import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { 
  BookOpenIcon, 
  ClockIcon, 
  UsersIcon, 
  StarIcon, 
  PlayIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  AwardIcon,
  TargetIcon,
  VideoIcon,
  FileTextIcon,
  Users2Icon,
  MessageCircleIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

// Course data structure (same as LearningPage)
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

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'quiz' | 'practice';
  isCompleted?: boolean;
  isLocked?: boolean;
}

// Mock course data (same as LearningPage)
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

// Mock lessons data
const courseLessons: Record<string, Lesson[]> = {
  'asl-basics': [
    {
      id: '1',
      title: 'Introduction to ASL',
      description: 'Learn about the history and importance of American Sign Language.',
      duration: '15 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '2',
      title: 'The ASL Alphabet',
      description: 'Master the 26 letters of the alphabet in sign language.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Alphabet Practice',
      description: 'Practice fingerspelling with interactive exercises.',
      duration: '25 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '4',
      title: 'Numbers 1-10',
      description: 'Learn to sign numbers from 1 to 10.',
      duration: '18 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '5',
      title: 'Basic Greetings',
      description: 'Learn common greetings like hello, goodbye, and thank you.',
      duration: '22 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '6',
      title: 'Greetings Quiz',
      description: 'Test your knowledge of basic greetings.',
      duration: '10 min',
      type: 'quiz',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '7',
      title: 'Numbers 11-20',
      description: 'Expand your number vocabulary with numbers 11-20.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '8',
      title: 'Family Signs',
      description: 'Learn to sign family-related words like mother, father, sister, brother.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '9',
      title: 'Family Practice',
      description: 'Practice family signs with interactive exercises.',
      duration: '30 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '10',
      title: 'Colors in ASL',
      description: 'Learn the signs for basic colors in American Sign Language.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '11',
      title: 'Days of the Week',
      description: 'Master the signs for the seven days of the week.',
      duration: '18 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '12',
      title: 'Basic Questions',
      description: 'Learn how to ask basic questions in ASL.',
      duration: '22 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '13',
      title: 'Question Practice',
      description: 'Practice asking and answering basic questions.',
      duration: '25 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '14',
      title: 'Common Phrases',
      description: 'Learn everyday phrases and expressions in ASL.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '15',
      title: 'Basic Conversation',
      description: 'Practice having a simple conversation in ASL.',
      duration: '30 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '16',
      title: 'Comprehensive Quiz',
      description: 'Test your knowledge of all the basics covered in this course.',
      duration: '15 min',
      type: 'quiz',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '17',
      title: 'Course Review',
      description: 'Review all the key concepts and signs learned in this course.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '18',
      title: 'Final Assessment',
      description: 'Complete the final assessment to test your ASL basics knowledge.',
      duration: '20 min',
      type: 'quiz',
      isCompleted: false,
      isLocked: false
    }
  ],
  'asl-conversation': [
    {
      id: '1',
      title: 'Conversation Basics',
      description: 'Learn the fundamentals of ASL conversation structure.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '2',
      title: 'Weather Signs',
      description: 'Learn to discuss weather and seasons in ASL.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Food and Dining',
      description: 'Master signs related to food, drinks, and dining experiences.',
      duration: '30 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '4',
      title: 'Hobbies and Activities',
      description: 'Learn to discuss your interests and activities in ASL.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '5',
      title: 'Conversation Practice',
      description: 'Practice real-world conversations using all learned signs.',
      duration: '35 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false
    }
  ],
  'asl-business': [
    {
      id: '1',
      title: 'Professional Greetings',
      description: 'Learn appropriate greetings and introductions for business settings.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '2',
      title: 'Meeting Vocabulary',
      description: 'Essential signs for participating in business meetings.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Workplace Communication',
      description: 'Common workplace phrases and professional communication.',
      duration: '30 min',
      type: 'video',
      isCompleted: false,
      isLocked: false
    }
  ]
};

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  const course = useMemo(() => {
    return courses.find(c => c.id === courseId);
  }, [courseId]);

  const lessons = useMemo(() => {
    return courseLessons[courseId || ''] || [];
  }, [courseId]);

  const handleEnroll = () => {
    if (course?.price === 'Premium') {
      toast.info('Premium courses coming soon!');
      return;
    }
    setIsEnrolled(true);
    toast.success(`Enrolled in ${course?.title}!`);
  };

  const handleStartLearning = () => {
    if (lessons.length > 0) {
      navigate(`/learning/course/${courseId}/lesson/${lessons[0].id}`);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isLocked) {
      toast.warning('Complete previous lessons to unlock this one.');
      return;
    }
    navigate(`/learning/course/${courseId}/lesson/${lesson.id}`);
  };

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/learning')}>
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/learning')}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Courses
          </Button>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.price === 'Free' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                }`}>
                  {course.price}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === 'Beginner' ? 'bg-blue-500 text-white' :
                  course.level === 'Intermediate' ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg text-gray-200 max-w-3xl">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpenIcon },
                    { id: 'curriculum', label: 'Curriculum', icon: TargetIcon },
                    { id: 'reviews', label: 'Reviews', icon: StarIcon }
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
                      <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.tags.map(tag => (
                          <div key={tag} className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Course description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>No prior sign language experience required</li>
                        <li>Basic computer skills</li>
                        <li>Webcam for practice sessions (recommended)</li>
                        <li>Dedication to practice regularly</li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedTab === 'curriculum' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Course content</h3>
                      <span className="text-sm text-gray-500">
                        {lessons.length} lessons • {course.duration}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            lesson.isLocked
                              ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex-shrink-0">
                            {lesson.isCompleted ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : lesson.isLocked ? (
                              <div className="w-5 h-5 bg-gray-300 rounded-full" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {index + 1}. {lesson.title}
                              </span>
                              {lesson.isLocked && (
                                <span className="text-xs text-gray-500">(Locked)</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{lesson.duration}</span>
                            {lesson.type === 'video' && <VideoIcon className="w-4 h-4" />}
                            {lesson.type === 'quiz' && <FileTextIcon className="w-4 h-4" />}
                            {lesson.type === 'practice' && <Users2Icon className="w-4 h-4" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div className="text-center py-8">
                    <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews coming soon</h3>
                    <p className="text-gray-600">Student reviews and ratings will be available here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {course.price === 'Free' ? 'Free' : '$49.99'}
                </div>
                <div className="text-sm text-gray-500">One-time payment</div>
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="font-medium">Enrolled</span>
                    </div>
                    <div className="text-sm text-green-700">
                      Progress: {progress}% ({completedLessons}/{lessons.length} lessons)
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <Button onClick={handleStartLearning} className="w-full">
                    {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button onClick={handleEnroll} className="w-full">
                    {course.price === 'Free' ? 'Enroll for Free' : 'Enroll Now'}
                  </Button>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">30-Day Money-Back Guarantee</div>
                    <div className="text-sm text-gray-500">Full lifetime access</div>
                  </div>
                </div>
              )}
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Course includes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <VideoIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">{course.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">{course.students.toLocaleString()} students enrolled</span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">{course.rating} average rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <AwardIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">Certificate of completion</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{course.instructor}</div>
                  <div className="text-sm text-gray-500">ASL Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;
