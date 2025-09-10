const API_BASE_URL = 'http://127.0.0.1:8000';

export interface DetectionResult {
  text: string;
  confidence: number;
  alternatives: Array<{
    text: string;
    confidence: number;
  }>;
  model_info?: {
    model_size: string;
    num_classes: number;
    device: string;
  };
  file_info?: {
    filename: string;
    file_size: number;
    content_type: string;
  };
  error?: string;
}

export interface ServerStatus {
  status: string;
  message: string;
}

export interface ModelInfo {
  model_venv_available: boolean;
  inference_script_available: boolean;
  model_directory: string;
  status: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async checkHealth(): Promise<ServerStatus> {
    return this.makeRequest<ServerStatus>('/health');
  }

  async getModelInfo(): Promise<ModelInfo> {
    return this.makeRequest<ModelInfo>('/model-info');
  }

  async detectSignLanguage(
    videoBlob: Blob,
    modelSize: string = '2000'
  ): Promise<DetectionResult> {
    const formData = new FormData();
    formData.append('file', videoBlob, 'video.webm');

    const url = `${this.baseUrl}/detect?model_size=${modelSize}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async detectBatchSignLanguage(
    videoBlobs: Blob[],
    modelSize: string = '2000'
  ): Promise<{
    results: DetectionResult[];
    total_files: number;
    successful_detections: number;
  }> {
    const formData = new FormData();
    
    videoBlobs.forEach((blob, index) => {
      formData.append('files', blob, `video_${index}.webm`);
    });

    const url = `${this.baseUrl}/detect-batch?model_size=${modelSize}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }
}

export const apiService = new ApiService();
export default apiService; 