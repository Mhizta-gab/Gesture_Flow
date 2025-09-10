import React, {  useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import WebcamCapture from '../components/WebcamCapture';
import Button from '../components/Button';
import { VideoIcon, FileTextIcon, VolumeIcon,  ShareIcon, ClipboardIcon, SettingsIcon, UploadIcon, XIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { saveDetectionHistory, fetchDetectionHistory } from '../utils/appwrite';
import { useDetection } from '../context/DetectionContext';
import { apiService } from '../utils/api';
import { toast } from 'react-toastify';

const DetectionPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelSize, setModelSize] = useState('2000');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [modelInfo, setModelInfo] = useState<any>(null);
  const { detectionResult, setDetectionResult } = useDetection();
  const { user } = useUser();
  const [recentDetections, setRecentDetections] = useState<any[]>([]);
  const [captureMode, setCaptureMode] = useState<'record' | 'upload'>('record');
  const [uploadBlob, setUploadBlob] = useState<Blob | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);

  // Check server status on component mount
  React.useEffect(() => {
    checkServerStatus();
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchDetectionHistory(user.id).then(history => {
        // Sort by createdAt descending and take the 5 most recent
        const sorted = history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentDetections(sorted.slice(0, 5));
        // console.log('Detection history from Appwrite:', history);
      }).catch(err => {
        console.error('Failed to fetch detection history:', err);
      });
    }
  }, [user]);

  const checkServerStatus = async () => {
    try {
      const health = await apiService.checkHealth();
      setServerStatus('online');
      
      // Also get model info
      try {
        const info = await apiService.getModelInfo();
        setModelInfo(info);
      } catch (error) {
        console.error('Failed to get model info:', error);
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleVideoCapture = async (videoBlob: Blob) => {
    if (serverStatus !== 'online') {
      toast.error('Server is offline. Please check if the backend is running.');
      return;
    }

    setIsProcessing(true);
    toast.info('Video sent for processing...');
    try {
      const result = await apiService.detectSignLanguage(videoBlob, modelSize);
      setDetectionResult(result);
      toast.success('Detection results received!');

      if (user) {
        await saveDetectionHistory({
          userId: user.id,
          detectedText: result.text,
          confidence: result.confidence,
          alternatives: result.alternatives
        });
        // console.log('User ID:', user.id);
      }
    } catch (error) {
      setDetectionResult(null);
      toast.error(`Detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

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

  // Upload handlers
  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file.');
      return;
    }
    setUploadBlob(file);
    const url = URL.createObjectURL(file);
    setUploadPreviewUrl(url);
  };

  React.useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    };
  }, [uploadPreviewUrl]);

  const handleUploadTranslate = async () => {
    if (!uploadBlob) return;
    await handleVideoCapture(uploadBlob);
    setUploadBlob(null);
    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    setUploadPreviewUrl(null);
  };

  const clearUploadSelection = () => {
    setUploadBlob(null);
    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    setUploadPreviewUrl(null);
  };

  const getModelSizeDescription = (size: string) => {
    const descriptions = {
      '100': 'Top 100 most common ASL words',
      '300': 'Top 300 most common ASL words',
      '1000': 'Top 1000 most common ASL words',
      '2000': 'Full dataset with 2000 ASL words'
    };
    return descriptions[size as keyof typeof descriptions] || '';
  };

  return <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sign Language Detection
          </h1>
          <p className="text-gray-500">
            Record a short video (max 4 seconds) to translate sign language.
          </p>
        </div>

        {/* Server Status */}
        <div className={`p-4 rounded-lg border ${
          serverStatus === 'online' ? 'bg-green-50 border-green-200' : 
          serverStatus === 'offline' ? 'bg-red-50 border-red-200' : 
          'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                serverStatus === 'online' ? 'bg-green-500' : 
                serverStatus === 'offline' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium">
                {serverStatus === 'online' ? 'Server Online' : 
                 serverStatus === 'offline' ? 'Server Offline' : 
                 'Checking Server Status...'}
              </span>
            </div>
            {serverStatus === 'offline' && (
              <Button 
                onClick={checkServerStatus}
                className="text-xs"
                variant="outline"
              >
                Retry
              </Button>
            )}
          </div>
          
          {/* Model Info */}
          {modelInfo && serverStatus === 'online' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Model Status: {modelInfo.status}</span>
                <span>Model Directory: {modelInfo.model_directory.split('/').pop()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-7">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <VideoIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Video Capture
            </h2>
            
            {/* Model Size Selection */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SettingsIcon className="h-4 w-4 inline mr-1" />
                Model Size
              </label>
              <select
                value={modelSize}
                onChange={(e) => setModelSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isProcessing}
              >
                <option value="100">WLASL100 - Top 100 words</option>
                <option value="300">WLASL300 - Top 300 words</option>
                <option value="1000">WLASL1000 - Top 1000 words</option>
                <option value="2000">WLASL2000 - Full dataset (2000 words)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {getModelSizeDescription(modelSize)}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="mb-4 inline-flex rounded-md shadow-sm" role="group">
              <button type="button" onClick={() => setCaptureMode('record')} className={`px-4 py-2 text-sm font-medium border ${captureMode === 'record' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}>
                Record
              </button>
              <button type="button" onClick={() => setCaptureMode('upload')} className={`px-4 py-2 text-sm font-medium border -ml-px ${captureMode === 'upload' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}>
                Upload
              </button>
            </div>

            {captureMode === 'record' ? (
              <WebcamCapture onCapture={handleVideoCapture} />
            ) : (
              <div>
                {!uploadBlob ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">MP4, WebM, MOV up to ~50MB</p>
                    </div>
                    <input type="file" accept="video/*" className="hidden" onChange={handleUploadChange} />
                  </label>
                ) : (
                  <div>
                    <div className="rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: '16 / 9' }}>
                      {uploadPreviewUrl && <video src={uploadPreviewUrl} controls className="w-full h-auto" />}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={handleUploadTranslate} className="text-sm">Translate</Button>
                      <Button onClick={clearUploadSelection} variant="outline" className="text-sm flex items-center">
                        <XIcon className="w-4 h-4 mr-1" /> Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 text-sm text-gray-500">
              <p>Tips for best results:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Ensure good lighting on your hands</li>
                <li>Keep your hands clearly visible in the frame</li>
                <li>Perform the sign slowly and clearly</li>
                <li>Use a plain background for better detection</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Translation Results
            </h2>
            {isProcessing ? <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">
                  Processing your sign language video...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Using {modelSize}-class model
                </p>
              </div> : detectionResult ? <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">
                      Detected Text:
                    </h3>
                    <span className="text-indigo-600 font-medium">
                      {Math.round(detectionResult.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-xl mt-2">{detectionResult.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      onClick={() => speakText(detectionResult.text)}
                      className="text-sm"
                      variant="outline"
                    >
                      <VolumeIcon className="h-4 w-4 mr-1" />
                      Speak
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(detectionResult.text)}
                      className="text-sm"
                      variant="outline"
                    >
                      <ClipboardIcon className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Sign Language Detection',
                            text: `Detected: "${detectionResult.text}" with ${Math.round(detectionResult.confidence * 100)}% confidence`
                          });
                        } else {
                          copyToClipboard(`Detected: "${detectionResult.text}" with ${Math.round(detectionResult.confidence * 100)}% confidence`);
                        }
                      }}
                      className="text-sm"
                      variant="outline"
                    >
                      <ShareIcon className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {detectionResult.alternatives && detectionResult.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Alternative Predictions:</h4>
                    <div className="space-y-2">
                      {detectionResult.alternatives.slice(0, 3).map((alt: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">{alt.text}</span>
                          <span className="text-sm text-gray-500">
                            {Math.round(alt.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detectionResult.model_info && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <p>Model: {detectionResult.model_info.model_size}-class</p>
                    <p>Device: {detectionResult.model_info.device}</p>
                  </div>
                )}
              </div> : <div className="text-center py-16 text-gray-500">
                <VideoIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No detection results yet</p>
                <p className="text-sm">Record a video to see the translation</p>
              </div>}
          </div>
        </div>

        {/* Recent Detections */}
        {recentDetections.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Detections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDetections.map((detection, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">{detection.detectedText}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round(detection.confidence * 100)}% confidence
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(detection.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>;
};

export default DetectionPage;