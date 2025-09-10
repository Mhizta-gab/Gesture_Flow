import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  UploadIcon,
  VideoIcon,
  FileTextIcon,
  Users2Icon,
  ImageIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

interface CourseFormData {
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
  isPublished: boolean;
}

interface LessonFormData {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'quiz' | 'practice';
  videoUrl?: string;
  instructions?: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  } | null;
  order: number;
}

const AdminCourseEditor: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isEditing = courseId !== 'new';

  const [courseData, setCourseData] = useState<CourseFormData>({
    id: courseId || 'new',
    title: '',
    description: '',
    category: 'Fundamentals',
    level: 'Beginner',
    duration: '4-6 weeks',
    lessons: 0,
    students: 0,
    rating: 0,
    image: '',
    instructor: '',
    price: 'Free',
    tags: [],
    isPublished: false
  });

  const [lessons, setLessons] = useState<LessonFormData[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedTab, setSelectedTab] = useState<'details' | 'lessons' | 'preview'>('details');

  const categories = ['Fundamentals', 'Conversation', 'Professional', 'Family', 'Healthcare', 'Education'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSaveCourse = () => {
    if (!courseData.title || !courseData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success(isEditing ? 'Course updated successfully!' : 'Course created successfully!');
    navigate('/admin');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddLesson = () => {
    const newLesson: LessonFormData = {
      id: `lesson-${Date.now()}`,
      title: '',
      description: '',
      duration: '15 min',
      type: 'video',
      order: lessons.length + 1
    };
    setLessons(prev => [...prev, newLesson]);
  };

  const handleUpdateLesson = (lessonId: string, updates: Partial<LessonFormData>) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    ));
  };

  const handleRemoveLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseData(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Course' : 'Create New Course'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Update course information and content' : 'Set up a new course for your platform'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedTab('preview')}>
                Preview
              </Button>
              <Button onClick={handleSaveCourse} className="flex items-center gap-2">
                <SaveIcon className="w-4 h-4" />
                {isEditing ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'details', label: 'Course Details', icon: FileTextIcon },
                { id: 'lessons', label: 'Lessons', icon: VideoIcon },
                { id: 'preview', label: 'Preview', icon: ImageIcon }
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
            {selectedTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        value={courseData.title}
                        onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter course title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={courseData.description}
                        onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter course description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={courseData.category}
                          onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level
                        </label>
                        <select
                          value={courseData.level}
                          onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={courseData.duration}
                          onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 4-6 weeks"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <select
                          value={courseData.price}
                          onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Free">Free</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructor
                      </label>
                      <input
                        type="text"
                        value={courseData.instructor}
                        onChange={(e) => setCourseData(prev => ({ ...prev, instructor: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter instructor name"
                      />
                    </div>
                  </div>

                  {/* Course Image */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Course Image</h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {courseData.image ? (
                        <div className="space-y-4">
                          <img
                            src={courseData.image}
                            alt="Course preview"
                            className="w-full h-48 object-cover rounded-lg mx-auto"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setCourseData(prev => ({ ...prev, image: '' }))}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Button variant="outline" className="flex items-center gap-2">
                                <UploadIcon className="w-4 h-4" />
                                Upload Image
                              </Button>
                            </label>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Recommended: 800x600 pixels, JPG or PNG
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Add a tag"
                        />
                        <Button onClick={handleAddTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {courseData.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Publishing */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={courseData.isPublished}
                          onChange={(e) => setCourseData(prev => ({ ...prev, isPublished: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Publish course immediately</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'lessons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Course Lessons</h3>
                  <Button onClick={handleAddLesson} className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Add Lesson
                  </Button>
                </div>

                {lessons.length === 0 ? (
                  <div className="text-center py-12">
                    <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
                    <p className="text-gray-600 mb-4">Add your first lesson to get started</p>
                    <Button onClick={handleAddLesson} className="flex items-center gap-2">
                      <PlusIcon className="w-4 h-4" />
                      Add First Lesson
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Lesson {index + 1}</h4>
                          <button
                            onClick={() => handleRemoveLesson(lesson.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => handleUpdateLesson(lesson.id, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Lesson title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select
                              value={lesson.type}
                              onChange={(e) => handleUpdateLesson(lesson.id, { type: e.target.value as any })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="video">Video</option>
                              <option value="quiz">Quiz</option>
                              <option value="practice">Practice</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => handleUpdateLesson(lesson.id, { duration: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g., 15 min"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Video URL (for video lessons)
                            </label>
                            <input
                              type="url"
                              value={lesson.videoUrl || ''}
                              onChange={(e) => handleUpdateLesson(lesson.id, { videoUrl: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="YouTube embed URL"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={lesson.description}
                            onChange={(e) => handleUpdateLesson(lesson.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Lesson description"
                          />
                        </div>

                        {lesson.type === 'quiz' && (
                          <div className="mt-4 space-y-4">
                            <h5 className="font-medium">Quiz Configuration</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  value={lesson.quiz?.question || ''}
                                  onChange={(e) => handleUpdateLesson(lesson.id, {
                                    quiz: { 
                                      question: e.target.value,
                                      options: lesson.quiz?.options || ['', '', '', ''],
                                      answer: lesson.quiz?.answer || 0
                                    }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  placeholder="Quiz question"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Correct Answer Index
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="3"
                                  value={lesson.quiz?.answer || 0}
                                  onChange={(e) => handleUpdateLesson(lesson.id, {
                                    quiz: { 
                                      question: lesson.quiz?.question || '',
                                      options: lesson.quiz?.options || ['', '', '', ''],
                                      answer: parseInt(e.target.value)
                                    }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                            
                            {/* Quiz Options */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Answer Options
                              </label>
                              <div className="space-y-2">
                                {[0, 1, 2, 3].map((index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500 w-6">
                                      {String.fromCharCode(65 + index)}.
                                    </span>
                                    <input
                                      type="text"
                                      value={lesson.quiz?.options?.[index] || ''}
                                      onChange={(e) => {
                                        const newOptions = [...(lesson.quiz?.options || ['', '', '', ''])];
                                        newOptions[index] = e.target.value;
                                        handleUpdateLesson(lesson.id, {
                                          quiz: { 
                                            question: lesson.quiz?.question || '',
                                            options: newOptions,
                                            answer: lesson.quiz?.answer || 0
                                          }
                                        });
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'preview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Course Preview</h3>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    {courseData.image ? (
                      <img
                        src={courseData.image}
                        alt={courseData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        courseData.price === 'Free' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {courseData.price}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        courseData.level === 'Beginner' ? 'bg-blue-500 text-white' :
                        courseData.level === 'Intermediate' ? 'bg-orange-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {courseData.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{courseData.title || 'Course Title'}</h2>
                    <p className="text-gray-600 mb-4">{courseData.description || 'Course description will appear here'}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{courseData.duration}</span>
                      <span>{lessons.length} lessons</span>
                      <span>by {courseData.instructor || 'Instructor'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourseEditor;
