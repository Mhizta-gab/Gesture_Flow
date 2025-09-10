import React from 'react';
import { PlayIcon, CheckCircleIcon, FileTextIcon } from 'lucide-react';
const DemoSection: React.FC = () => {
  return <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          See It In Action
        </h2>
        <div className="relative">
          {/* Demo Video Container */}
          <div className="aspect-video bg-white rounded-lg shadow-xl overflow-hidden border-4 border-indigo-600 max-w-4xl mx-auto">
            <video className="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" controls>
              <source src="https://example.com/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          {/* Process Steps */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <PlayIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Record</h3>
              <p className="text-gray-600">
                Simply record your sign language gestures using your device's
                camera
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Process</h3>
              <p className="text-gray-600">
                Our AI model analyzes the video in real-time with high accuracy
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FileTextIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Translate</h3>
              <p className="text-gray-600">
                Get instant text translation and audio output of the signs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default DemoSection;