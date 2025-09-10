import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { 
  BookOpenIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  VideoIcon,
  FileTextIcon,
  Users2Icon,
  HelpCircleIcon,
  InfoIcon,
} from 'lucide-react';
import WebcamCapture from '../components/WebcamCapture';
import FAQAccordion from '../components/FAQAccordion';
import { toast } from 'react-toastify';

// Course and lesson data structures (same as other pages)
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
  videoUrl?: string;
  instructions?: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  };
}

// Mock course data (same as other pages)
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
  }
];

// Mock lessons data with more detailed content
const courseLessons: Record<string, Lesson[]> = {
  'asl-basics': [
    {
      id: '1',
      title: 'Introduction to ASL',
      description: 'Learn about the history and importance of American Sign Language.',
      duration: '15 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/7M3Qk9V1vJg',
      instructions: 'Welcome to your first ASL lesson! In this introduction, you\'ll learn about the rich history of American Sign Language and why it\'s such an important form of communication. Pay attention to the cultural aspects and the role ASL plays in the Deaf community. This lesson will give you a solid foundation for understanding the language and its cultural significance.'
    },
    {
      id: '2',
      title: 'The ASL Alphabet',
      description: 'Master the 26 letters of the alphabet in sign language.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3xQJpYhJ6s8',
      instructions: 'The ASL alphabet is your foundation for fingerspelling. Each letter has a specific handshape and position. Practice each letter slowly and clearly. Remember, fingerspelling is used for names, places, and words that don\'t have specific signs. Focus on proper hand positioning and smooth transitions between letters.'
    },
    {
      id: '3',
      title: 'Alphabet Practice',
      description: 'Practice fingerspelling with interactive exercises.',
      duration: '25 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false,
      instructions: 'Now it\'s time to practice! Use your webcam to record yourself fingerspelling. Start with simple words like "CAT", "DOG", "HELLO" and gradually increase difficulty. Focus on clear handshapes and smooth transitions between letters. Practice in front of a mirror first to ensure your handshapes are correct.'
    },
    {
      id: '4',
      title: 'Numbers 1-10',
      description: 'Learn to sign numbers from 1 to 10.',
      duration: '18 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/1X6v5h7Hc5c',
      instructions: 'Numbers in ASL are essential for everyday communication. Learn the handshapes for numbers 1-10. Pay attention to palm orientation and finger positioning. These numbers form the basis for larger numbers and counting. Practice counting forward and backward to build fluency.'
    },
    {
      id: '5',
      title: 'Basic Greetings',
      description: 'Learn common greetings like hello, goodbye, and thank you.',
      duration: '22 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3pGJ6p2J3yE',
      instructions: 'Greetings are often the first signs you\'ll use in conversation. Learn the signs for hello, goodbye, thank you, please, and sorry. Notice how facial expressions enhance the meaning of these signs. Practice with different facial expressions to convey the right emotion.'
    },
    {
      id: '6',
      title: 'Greetings Quiz',
      description: 'Test your knowledge of basic greetings.',
      duration: '10 min',
      type: 'quiz',
      isCompleted: false,
      isLocked: false,
      quiz: {
        question: 'What is the sign for "Hello" in ASL?',
        options: ['Flat hand, salute outward', 'Touch your chin', 'Point to your ear', 'Clap your hands'],
        answer: 0
      }
    },
    {
      id: '7',
      title: 'Numbers 11-20',
      description: 'Expand your number vocabulary with numbers 11-20.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/1X6v5h7Hc5c',
      instructions: 'Building on your knowledge of numbers 1-10, learn numbers 11-20. These numbers follow specific patterns in ASL. Pay attention to the movement and handshape changes. Practice counting from 1-20 to build fluency and confidence.'
    },
    {
      id: '8',
      title: 'Family Signs',
      description: 'Learn to sign family-related words like mother, father, sister, brother.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3pGJ6p2J3yE',
      instructions: 'Family signs are commonly used in everyday conversation. Learn the signs for mother, father, sister, brother, grandmother, grandfather, and more. Notice how some signs use specific locations on the face or body. Practice introducing your family members.'
    },
    {
      id: '9',
      title: 'Family Practice',
      description: 'Practice family signs with interactive exercises.',
      duration: '30 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false,
      instructions: 'Practice signing about your family. Use your webcam to record yourself signing family members\' names and relationships. Try creating simple sentences like "My mother is kind" or "I have two brothers". Focus on clear handshapes and proper facial expressions.'
    },
    {
      id: '10',
      title: 'Colors in ASL',
      description: 'Learn the signs for basic colors in American Sign Language.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/1X6v5h7Hc5c',
      instructions: 'Colors are essential for describing objects and expressing preferences. Learn the signs for red, blue, green, yellow, black, white, and more. Pay attention to the handshapes and movements used for each color. Practice describing objects by their colors.'
    },
    {
      id: '11',
      title: 'Days of the Week',
      description: 'Master the signs for the seven days of the week.',
      duration: '18 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3pGJ6p2J3yE',
      instructions: 'Learning the days of the week is crucial for scheduling and planning. Each day has a specific sign that often relates to the first letter of the word. Practice signing the days in order and learn to ask "What day is it?" and "What day is tomorrow?"'
    },
    {
      id: '12',
      title: 'Basic Questions',
      description: 'Learn how to ask basic questions in ASL.',
      duration: '22 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/7M3Qk9V1vJg',
      instructions: 'Questions are fundamental to communication. Learn how to ask "What is your name?", "How are you?", "Where do you live?", and other basic questions. Pay attention to facial expressions and eyebrow movements that indicate questions in ASL.'
    },
    {
      id: '13',
      title: 'Question Practice',
      description: 'Practice asking and answering basic questions.',
      duration: '25 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false,
      instructions: 'Practice asking and answering questions using your webcam. Try asking "What is your name?", "How are you?", and "Where do you live?". Focus on proper facial expressions and eyebrow movements for questions. Record yourself and review for clarity.'
    },
    {
      id: '14',
      title: 'Common Phrases',
      description: 'Learn everyday phrases and expressions in ASL.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3xQJpYhJ6s8',
      instructions: 'Expand your vocabulary with common phrases like "Nice to meet you", "See you later", "Take care", and "Have a good day". These phrases will help you in everyday conversations. Practice the signs with appropriate facial expressions and body language.'
    },
    {
      id: '15',
      title: 'Basic Conversation',
      description: 'Practice having a simple conversation in ASL.',
      duration: '30 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false,
      instructions: 'Now it\'s time to put everything together! Practice having a simple conversation using all the signs you\'ve learned. Introduce yourself, ask about someone\'s family, discuss colors and numbers. Focus on smooth transitions and natural conversation flow.'
    },
    {
      id: '16',
      title: 'Comprehensive Quiz',
      description: 'Test your knowledge of all the basics covered in this course.',
      duration: '15 min',
      type: 'quiz',
      isCompleted: false,
      isLocked: false,
      quiz: {
        question: 'Which of the following is the correct sign for "Thank you" in ASL?',
        options: ['Touch your chin and move hand forward', 'Wave both hands', 'Tap your chest', 'Point to your ear'],
        answer: 0
      }
    },
    {
      id: '17',
      title: 'Course Review',
      description: 'Review all the key concepts and signs learned in this course.',
      duration: '20 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/7M3Qk9V1vJg',
      instructions: 'This final lesson reviews all the key concepts, signs, and techniques you\'ve learned throughout the course. Practice the alphabet, numbers, greetings, family signs, colors, days of the week, and basic questions. This review will help reinforce your learning and prepare you for more advanced ASL courses.'
    },
    {
      id: '18',
      title: 'Final Assessment',
      description: 'Complete the final assessment to test your ASL basics knowledge.',
      duration: '20 min',
      type: 'quiz',
      isCompleted: false,
      isLocked: false,
      quiz: {
        question: 'What is the most important aspect of ASL communication besides handshapes?',
        options: ['Speed of signing', 'Facial expressions', 'Voice volume', 'Hand size'],
        answer: 1
      }
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
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/7M3Qk9V1vJg',
      instructions: 'Start your conversation journey by understanding the basic structure of ASL conversations. Learn about topic-comment structure, time indicators, and how to maintain conversation flow naturally.'
    },
    {
      id: '2',
      title: 'Weather Signs',
      description: 'Learn to discuss weather and seasons in ASL.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3xQJpYhJ6s8',
      instructions: 'Weather is a common conversation topic. Learn signs for sunny, rainy, cloudy, hot, cold, and the four seasons. Practice describing current weather conditions and seasonal activities.'
    },
    {
      id: '3',
      title: 'Food and Dining',
      description: 'Master signs related to food, drinks, and dining experiences.',
      duration: '30 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/1X6v5h7Hc5c',
      instructions: 'Food conversations are universal! Learn signs for common foods, drinks, cooking terms, and dining phrases. Practice ordering food, discussing preferences, and describing meals.'
    },
    {
      id: '4',
      title: 'Hobbies and Activities',
      description: 'Learn to discuss your interests and activities in ASL.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3pGJ6p2J3yE',
      instructions: 'Share your interests and learn about others\' hobbies. Master signs for sports, music, reading, traveling, and other common activities. Practice asking about and describing hobbies.'
    },
    {
      id: '5',
      title: 'Conversation Practice',
      description: 'Practice real-world conversations using all learned signs.',
      duration: '35 min',
      type: 'practice',
      isCompleted: false,
      isLocked: false,
      instructions: 'Put your conversation skills to the test! Practice having natural conversations about weather, food, hobbies, and daily activities. Focus on smooth transitions and natural conversation flow.'
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
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/7M3Qk9V1vJg',
      instructions: 'Master professional greetings and introductions suitable for workplace environments. Learn formal ways to introduce yourself and others in business contexts.'
    },
    {
      id: '2',
      title: 'Meeting Vocabulary',
      description: 'Essential signs for participating in business meetings.',
      duration: '25 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/3xQJpYhJ6s8',
      instructions: 'Learn signs for meeting-related terms like agenda, presentation, discussion, decision, and action items. Practice participating in mock business meetings.'
    },
    {
      id: '3',
      title: 'Workplace Communication',
      description: 'Common workplace phrases and professional communication.',
      duration: '30 min',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      videoUrl: 'https://www.youtube.com/embed/1X6v5h7Hc5c',
      instructions: 'Master professional communication including asking for help, giving feedback, discussing projects, and handling workplace situations appropriately.'
    }
  ]
};

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const videoRef = useRef<HTMLDivElement>(null);

  const course = useMemo(() => {
    return courses.find(c => c.id === courseId);
  }, [courseId]);

  const lessons = useMemo(() => {
    return courseLessons[courseId || ''] || [];
  }, [courseId]);

  const currentLesson = useMemo(() => {
    return lessons.find(l => l.id === lessonId);
  }, [lessons, lessonId]);

  const currentLessonIndex = useMemo(() => {
    return lessons.findIndex(l => l.id === lessonId);
  }, [lessons, lessonId]);

  const nextLesson = useMemo(() => {
    if (currentLessonIndex < lessons.length - 1) {
      return lessons[currentLessonIndex + 1];
    }
    return null;
  }, [lessons, currentLessonIndex]);

  const prevLesson = useMemo(() => {
    if (currentLessonIndex > 0) {
      return lessons[currentLessonIndex - 1];
    }
    return null;
  }, [lessons, currentLessonIndex]);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === currentLesson?.quiz?.answer && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      toast.success('Correct! Lesson completed.');
    }
  };

  const handleNextLesson = useCallback(() => {
    if (nextLesson) {
      navigate(`/learning/course/${courseId}/lesson/${nextLesson.id}`);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  }, [nextLesson, navigate, courseId]);

  const handlePrevLesson = useCallback(() => {
    if (prevLesson) {
      navigate(`/learning/course/${courseId}/lesson/${prevLesson.id}`);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  }, [prevLesson, navigate, courseId]);

  const handlePracticeCapture = useCallback((_blob: Blob) => {
    toast.success('Practice video captured! Keep practicing to improve your skills.');
  }, []);

  const faqItems = useMemo(() => ([
    {
      question: 'How do I know if I\'m signing correctly?',
      answer: 'Compare your handshapes, movements, and facial expressions with the video. Practice regularly and consider recording yourself to review your progress.'
    },
    {
      question: 'What if I can\'t remember a sign?',
      answer: 'Don\'t worry! Review the video multiple times, practice slowly, and use the practice sessions to reinforce your learning. Repetition is key to mastering ASL.'
    },
    {
      question: 'How long should I practice each lesson?',
      answer: 'Aim for 15-30 minutes of focused practice per lesson. It\'s better to practice a little each day than to cram everything at once.'
    }
  ]), []);

  if (!course || !currentLesson) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson not found</h3>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/learning')}>
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = completedLessons.includes(currentLesson.id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigate(`/learning/course/${courseId}`)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Course
                </Button>
                {isCompleted && (
                  <span className="inline-flex items-center text-sm text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Completed
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {currentLesson.title}
              </h1>
              <p className="text-gray-600">{currentLesson.description}</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-semibold">
                  {currentLessonIndex + 1} of {lessons.length}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                {currentLesson.type === 'video' && <VideoIcon className="w-5 h-5 text-indigo-600" />}
                {currentLesson.type === 'quiz' && <FileTextIcon className="w-5 h-5 text-indigo-600" />}
                {currentLesson.type === 'practice' && <Users2Icon className="w-5 h-5 text-indigo-600" />}
                <h2 className="text-xl font-semibold">Lesson Content</h2>
              </div>

              {currentLesson.type === 'video' && currentLesson.videoUrl && (
                <div className="w-full aspect-video rounded-lg shadow overflow-hidden bg-black mb-6">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}

              {currentLesson.type === 'practice' && (
                <div className="mb-6">
                  <WebcamCapture onCapture={handlePracticeCapture} />
                </div>
              )}

              {currentLesson.type === 'quiz' && currentLesson.quiz && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-900 mb-2">Quiz Question</h3>
                    <p className="text-indigo-800">{currentLesson.quiz.question}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {currentLesson.quiz.options.map((option, idx) => (
                      <label key={idx} className={`block px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                        quizSubmitted 
                          ? (idx === currentLesson.quiz!.answer 
                              ? 'border-green-500 bg-green-50' 
                              : quizAnswer === idx 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-gray-200')
                          : (quizAnswer === idx 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-gray-200 hover:bg-gray-50')
                      }`}>
                        <input
                          type="radio"
                          name="quiz"
                          value={idx}
                          checked={quizAnswer === idx}
                          onChange={() => setQuizAnswer(idx)}
                          disabled={quizSubmitted}
                          className="mr-3"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {!quizSubmitted ? (
                      <Button onClick={handleQuizSubmit} disabled={quizAnswer === null}>
                        Submit Answer
                      </Button>
                    ) : quizAnswer === currentLesson.quiz!.answer ? (
                      <>
                        <span className="text-green-600 font-semibold">Correct! Well done!</span>
                        {nextLesson && (
                          <Button onClick={handleNextLesson} className="flex items-center">
                            Next Lesson <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <span className="text-red-600 font-semibold">Incorrect. Try again or review the lesson.</span>
                    )}
                  </div>
                </div>
              )}

              {currentLesson.instructions && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-indigo-600" />
                    Instructions
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{currentLesson.instructions}</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <HelpCircleIcon className="w-5 h-5 text-indigo-600" />
                Learning Tips
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Take your time and practice each sign slowly at first</li>
                <li>Pay attention to facial expressions - they're crucial in ASL</li>
                <li>Practice in front of a mirror to see your handshapes clearly</li>
                <li>Don't worry about speed - accuracy comes first</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h3 className="font-semibold mb-4">Course Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Lessons completed</span>
                  <span>{completedLessons.length} of {lessons.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round((completedLessons.length / lessons.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            </div>

            {/* Lesson Navigation */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h3 className="font-semibold mb-4">Lesson Navigation</h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/learning/course/${courseId}/lesson/${lesson.id}`)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      lesson.id === currentLesson.id
                        ? 'bg-indigo-100 text-indigo-800 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{index + 1}.</span>
                      <span className="text-sm">{lesson.title}</span>
                      {completedLessons.includes(lesson.id) && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex gap-2">
                {prevLesson && (
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    className="flex items-center gap-2 flex-1"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                {nextLesson && (
                  <Button
                    onClick={handleNextLesson}
                    className="flex items-center gap-2 flex-1"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h3 className="font-semibold mb-4">FAQ</h3>
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonPage;
