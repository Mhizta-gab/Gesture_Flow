import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import FAQAccordion from '../components/FAQAccordion';
import { MessageCircleIcon, MailIcon, BookOpenIcon } from 'lucide-react';
import Button from '../components/Button';
const HelpPage: React.FC = () => {
  const faqItems = [{
    question: 'How do I start learning sign language?',
    answer: "Begin with our 'Basic Sign Language Alphabet' course in the Learning section. This will teach you the fundamental hand signs for each letter, forming the foundation for your sign language journey."
  }, {
    question: 'What equipment do I need for sign language detection?',
    answer: "You'll need a webcam or device camera with good resolution and adequate lighting. Make sure your hands are clearly visible against a plain background for best results."
  }, {
    question: 'How accurate is the sign language detection?',
    answer: 'Our AI-powered detection system typically achieves 85-95% accuracy for well-performed signs. The accuracy improves with proper lighting and clear hand positioning.'
  }, {
    question: 'Can I practice offline?',
    answer: 'Yes! You can download lesson materials for offline practice. However, the real-time detection features require an internet connection.'
  }, {
    question: 'How long does it take to become proficient?',
    answer: 'With regular practice (15-30 minutes daily), most users achieve basic conversational proficiency within 2-3 months. Advanced proficiency typically takes 6-12 months.'
  }];
  return <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-500">
            Find answers to common questions and get support
          </p>
        </div>
        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
              <MessageCircleIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Live Chat
            </h3>
            <p className="text-gray-500 mb-4">
              Get instant help from our support team
            </p>
            <Button variant="outline">Start Chat</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
              <MailIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Email Support
            </h3>
            <p className="text-gray-500 mb-4">Send us a message anytime</p>
            <Button variant="outline">Contact Us</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Documentation
            </h3>
            <p className="text-gray-500 mb-4">Browse our detailed guides</p>
            <Button variant="outline">View Guides</Button>
          </div>
        </div>
        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={faqItems} />
        </div>
      </div>
    </DashboardLayout>;
};
export default HelpPage;