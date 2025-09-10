import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { CalendarIcon, FilterIcon, SearchIcon, DownloadIcon, VolumeIcon, ClipboardIcon, TrashIcon } from 'lucide-react';
import Button from '../components/Button';
import { useUser } from '@clerk/clerk-react';
import { fetchDetectionHistory } from '../utils/appwrite';
import { Client, Databases, ID } from 'appwrite';
import { toast } from 'react-toastify';

const PER_PAGE = 10;

// Helper to delete a detection by ID
async function deleteDetection(detectionId: string, userId: string) {
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  const databases = new Databases(client);
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_DETECTION_COLLECTION_ID,
    detectionId
  );
}

function detectionsToCSV(detections: any[]) {
  const header = ['Date & Time', 'Translation', 'Confidence', 'Alternatives'];
  const rows = detections.map(det => [
    det.createdAt ? new Date(det.createdAt).toLocaleString() : '-',
    det.detectedText,
    det.confidence ? Math.round(det.confidence * 100) + '%' : '0%',
    det.alternatives ? JSON.parse(det.alternatives).map((alt: any) => `${alt.text} (${Math.round(alt.confidence * 100)}%)`).join('; ') : '-'
  ]);
  return [header, ...rows].map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',')).join('\n');
}

const HistoryPage: React.FC = () => {
  const { user } = useUser();
  const [detections, setDetections] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) {
      fetchDetectionHistory(user.id).then(history => {
        // Sort by createdAt descending
        const sorted = history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setDetections(sorted);
      }).catch(err => {
        console.error('Failed to fetch detection history:', err);
      });
    }
  }, [user]);

  // Enhanced search: search across all fields
  const filteredDetections = detections.filter(det => {
    let matchesSearch = true;
    let matchesFilter = true;
    if (search) {
      const searchLower = search.toLowerCase();
      matchesSearch = (
        (det.detectedText && det.detectedText.toLowerCase().includes(searchLower)) ||
        (det.confidence && String(Math.round(det.confidence * 100)).includes(searchLower)) ||
        (det.createdAt && new Date(det.createdAt).toLocaleString().toLowerCase().includes(searchLower)) ||
        (det.alternatives && JSON.parse(det.alternatives).some((alt: any) =>
          alt.text.toLowerCase().includes(searchLower) ||
          String(Math.round(alt.confidence * 100)).includes(searchLower)
        ))
      );
    }
    if (selectedFilter === 'high-accuracy') {
      matchesFilter = det.confidence >= 0.9;
    } else if (selectedFilter === 'low-accuracy') {
      matchesFilter = det.confidence < 0.7;
    }
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDetections.length / PER_PAGE);
  const paginatedDetections = filteredDetections.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (detectionId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this detection?')) return;
    try {
      await deleteDetection(detectionId, user.id);
      setDetections(detections => detections.filter(det => det.$id !== detectionId));
      toast.success('Detection deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete detection.');
      console.error(err);
    }
  };

  // Reset to first page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [search, selectedFilter]);

  const handleExport = () => {
    try {
      const csv = detectionsToCSV(filteredDetections);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'detection_history.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Exported history as CSV!');
    } catch (err) {
      toast.error('Failed to export history.');
      console.error(err);
    }
  };

  return <DashboardLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Translation History
          </h1>
          <p className="text-gray-500">
            View and manage your past sign language translations
          </p>
        </div>
        <Button onClick={handleExport}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input type="text" placeholder="Search translations..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FilterIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filter
              </button>
            </div>
            <div className="relative">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Date Range
              </button>
            </div>
          </div>
        </div>
        {/* Filter Pills */}
        <div className="mt-4 flex gap-2">
          {['all', 'high-accuracy', 'low-accuracy'].map(filter => <button key={filter} onClick={() => setSelectedFilter(filter)} className={`px-3 py-1 rounded-full text-sm ${selectedFilter === filter ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>)}
        </div>
      </div>
      {/* Table of Detections */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alternatives</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDetections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No detections found.</td>
                </tr>
              ) : (
                paginatedDetections.map((det, idx) => (
                  <tr key={det.$id || idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{det.createdAt ? new Date(det.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{det.detectedText}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {det.confidence ? Math.round(det.confidence * 100) : 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {det.alternatives ? JSON.parse(det.alternatives).map((alt: any, i: number) => (
                        <div key={i}>{alt.text} ({Math.round(alt.confidence * 100)}%)</div>
                      )) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900" onClick={() => speakText(det.detectedText)} title="Speak">
                          <VolumeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900" onClick={() => copyToClipboard(det.detectedText)} title="Copy">
                          <ClipboardIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(det.$id)} title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  </DashboardLayout>;
};
export default HistoryPage;