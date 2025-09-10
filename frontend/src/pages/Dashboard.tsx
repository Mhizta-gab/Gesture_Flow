import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { BarChart as BarChartIcon, HandIcon, ClockIcon, TrendingUpIcon, CheckCircleIcon, XCircleIcon, UserIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useUser } from '@clerk/clerk-react';
import { fetchDetectionHistory } from '../utils/appwrite';
const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchDetectionHistory(user.id)
      .then(docs => setDetections(docs))
      .catch(() => setDetections([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Derive stats
  const totalTranslations = detections.length;
  const avgConfidence = useMemo(() => {
    if (detections.length === 0) return 0;
    const sum = detections.reduce((acc, d) => acc + (Number(d.confidence) || 0), 0);
    return Math.round((sum / detections.length) * 100) / 100;
  }, [detections]);

  const weeklyData = useMemo(() => {
    // group by weekday
    const counts: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    detections.forEach(d => {
      const date = new Date(d.createdAt || d.created_at || d.$createdAt || d.$createdAt);
      const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
      counts[day as keyof typeof counts] = (counts[day as keyof typeof counts] || 0) + 1;
    });
    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(name => ({ name, translations: counts[name as keyof typeof counts] || 0 }));
  }, [detections]);

  const monthlyData = useMemo(() => {
    // last 6 months translations by month
    const now = new Date();
    const labels: string[] = [];
    const data: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleString(undefined, { month: 'short' }));
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = detections.filter(doc => {
        const dt = new Date(doc.createdAt || doc.created_at || doc.$createdAt || doc.$createdAt);
        return dt.getMonth() === month && dt.getFullYear() === year;
      }).length;
      data.push(count);
    }
    return labels.map((name, idx) => ({ name, translations: data[idx] }));
  }, [detections]);

  const accuracyData = useMemo(() => {
    const accurate = detections.filter(d => (Number(d.confidence) || 0) >= 0.8).length;
    const inaccurate = detections.length - accurate;
    return [
      { name: 'Accurate', value: accurate },
      { name: 'Inaccurate', value: inaccurate }
    ];
  }, [detections]);

  const COLORS = ['#4F46E5', '#E5E7EB'];

  const recentDetections = useMemo(() => {
    const sorted = [...detections].sort((a, b) => new Date(b.createdAt || b.$createdAt).getTime() - new Date(a.createdAt || a.$createdAt).getTime());
    return sorted.slice(0, 5).map((d, idx) => ({
      id: d.$id || idx,
      gesture: d.detectedText,
      timestamp: new Date(d.createdAt || d.$createdAt).toLocaleString(),
      accuracy: Math.round((Number(d.confidence) || 0) * 100),
      status: (Number(d.confidence) || 0) >= 0.8 ? 'success' : (Number(d.confidence) || 0) >= 0.5 ? 'warning' : 'error'
    }));
  }, [detections]);
  return <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's an overview of your sign language detection
            activity.
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Translations" value={String(totalTranslations)} icon={<BarChartIcon className="h-6 w-6 text-indigo-600" />} change={{
          value: '12%',
          positive: true
        }} />
          <StatCard title="Average Confidence" value={`${Math.round(avgConfidence * 100)}%`} icon={<CheckCircleIcon className="h-6 w-6 text-indigo-600" />} change={{
          value: '3%',
          positive: true
        }} />
          <StatCard title="Avg. Processing Time" value="1.4s" icon={<ClockIcon className="h-6 w-6 text-indigo-600" />} change={{
          value: '0.3s',
          positive: true
        }} />
          <StatCard title="Active Users" value="24" icon={<UserIcon className="h-6 w-6 text-indigo-600" />} change={{
          value: '5',
          positive: true
        }} />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Weekly Translations
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="translations" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Translation Accuracy
            </h2>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={accuracyData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {accuracyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Monthly Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="translations" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Detections
              </h2>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentDetections.map(detection => <div key={detection.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <HandIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {detection.gesture}
                        </p>
                        <p className="text-sm text-gray-500">
                          {detection.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {detection.status === 'success' ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" /> : <XCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />}
                      <span className={`text-sm ${detection.accuracy > 90 ? 'text-green-600' : detection.accuracy > 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {detection.accuracy}%
                      </span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default Dashboard;