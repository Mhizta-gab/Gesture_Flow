import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DataCard from '../components/DataCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ActivityIcon, ClockIcon, TrendingUpIcon, UserIcon } from 'lucide-react';
const DataPage: React.FC = () => {
  const practiceData = [{
    date: 'Mon',
    minutes: 30
  }, {
    date: 'Tue',
    minutes: 45
  }, {
    date: 'Wed',
    minutes: 35
  }, {
    date: 'Thu',
    minutes: 50
  }, {
    date: 'Fri',
    minutes: 40
  }, {
    date: 'Sat',
    minutes: 60
  }, {
    date: 'Sun',
    minutes: 55
  }];
  const accuracyData = [{
    date: 'Mon',
    accuracy: 75
  }, {
    date: 'Tue',
    accuracy: 82
  }, {
    date: 'Wed',
    accuracy: 78
  }, {
    date: 'Thu',
    accuracy: 85
  }, {
    date: 'Fri',
    accuracy: 88
  }, {
    date: 'Sat',
    accuracy: 92
  }, {
    date: 'Sun',
    accuracy: 90
  }];
  return <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500">
            Track your sign language learning progress
          </p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataCard title="Practice Time" value="315 mins" change={12} icon={<ClockIcon className="h-6 w-6 text-indigo-600" />} />
          <DataCard title="Average Accuracy" value="87%" change={5} icon={<ActivityIcon className="h-6 w-6 text-indigo-600" />} />
          <DataCard title="Signs Learned" value="124" change={-2} icon={<TrendingUpIcon className="h-6 w-6 text-indigo-600" />} />
          <DataCard title="Practice Sessions" value="28" change={8} icon={<UserIcon className="h-6 w-6 text-indigo-600" />} />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Practice Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={practiceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="minutes" stroke="#4f46e5" fill="#e0e7ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sign Recognition Accuracy
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default DataPage;