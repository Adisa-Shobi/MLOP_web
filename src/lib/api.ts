
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "https://mlop-summative-wh2a.onrender.com/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    toast.error(message);
    return Promise.reject(error);
  }
);

export interface PredictionData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  max_bpm: number;
  avg_bpm: number;
  resting_bpm: number;
  session_duration: number;
  calories_burned: number;
  workout_type: string;
  fat_percentage: number;
  water_intake: number;
  workout_frequency: number;
  bmi: number;
}

export interface PredictionResult {
  status: string;
  prediction: {
    class: number;
    probabilities: number[];
  };
  message: string;
}

export interface TrainingFile {
  filename: string;
  timestamp: number;
  datetime: string;
}

export interface VisualizationData {
  status: string;
  data: {
    summary: {
      totalMembers: number;
      averageAge: number;
      averageBMI: number;
      fitnessLevelDistribution: {
        beginner: number;
        intermediate: number;
        advanced: number;
      };
    };
    experienceLevelData: {
      ageByExperience: Array<{
        level: string;
        avgAge: number;
        count: number;
      }>;
      durationByExperience: Array<{
        level: string;
        avgDuration: number;
        avgCalories: number;
        count: number;
      }>;
      workoutPreferencesByExperience: {
        beginner: {
          cardio: number;
          strength: number;
          yoga: number;
          hiit: number;
        };
        intermediate: {
          cardio: number;
          strength: number;
          yoga: number;
          hiit: number;
        };
        advanced: {
          cardio: number;
          strength: number;
          yoga: number;
          hiit: number;
        };
      };
      bodyCompositionByExperience: Array<{
        level: string;
        avgBMI: number;
        avgBodyFat: number;
      }>;
      workoutFrequencyData: Array<{
        frequency: number;
        avgFatPercentage: number;
        count: number;
      }>;
    };
  };
  message: string;
  source_file: string;
}

export const makeApiRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
): Promise<T> => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// API functions
export const makePrediction = async (data: PredictionData): Promise<PredictionResult> => {
  return makeApiRequest<PredictionResult>("/predict", "POST", data);
};

export const uploadTrainingData = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/upload-training-data`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const retrainModel = async (filename: string): Promise<{ message: string }> => {
  return makeApiRequest<{ message: string }>("/retrain", "POST", { filename });
};

export const getModelEvaluation = async (): Promise<any> => {
  return makeApiRequest<any>("/evaluate");
};

export const getTrainingFiles = async (): Promise<TrainingFile[]> => {
  return makeApiRequest<TrainingFile[]>("/training-data");
};

export const deleteTrainingFile = async (filename: string): Promise<{ message: string }> => {
  return makeApiRequest<{ message: string }>(`/training-data/${filename}`, "DELETE");
};

export const deleteAllTrainingFiles = async (): Promise<{ message: string }> => {
  return makeApiRequest<{ message: string }>("/training-data", "DELETE");
};

export const getVisualizationData = async (filename?: string): Promise<VisualizationData> => {
  let endpoint = "/visualization-data";
  
  if (filename) {
    endpoint += `/?filename=${encodeURIComponent(filename)}`;
  }
  
  return makeApiRequest<VisualizationData>(endpoint);
};
