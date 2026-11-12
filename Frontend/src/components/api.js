import axios from "axios";
import { auth } from "../firebase";

const API_BASE_URL = import.meta.env.VITE_FASTAPI_LINK || "/api"; // same-origin Vercel function by default

// Create axios instance with interceptors for JWT token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get current Firebase user
    const user = auth.currentUser;
    if (user) {
      try {
        // Get the ID token (Firebase automatically refreshes if expired)
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          // Force refresh the token
          const token = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          // Retry the original request with new token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, user needs to re-authenticate
        console.error("Token refresh failed:", refreshError);
        // Redirect to login or handle logout
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Function to send chat input to the FastAPI backend
export const sendChatMessage = async (userId, message) => {
  try {
    // Send the chat message in JSON format
    const response = await apiClient.post(`/chat/${userId}`, {
      user_id: userId,
      message: message, // sending JSON message
    });

    // Check if the response is in JSON format
    return response.data; // assuming the response is a JSON object with structured data
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Function to send audio message
export const sendAudioMessage = async (userId, audioBlob) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("user_id", userId);

    const response = await apiClient.post(`/chat/audio/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Mood Tracking Functions
export const getMoodHistory = async (userId, days = 7) => {
  try {
    const response = await apiClient.get(`/mood/history/${userId}`, {
      params: { days },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

export const storeMoodEntry = async (userId, moodData) => {
  try {
    const response = await apiClient.post(`/mood/entry`, {
      user_id: userId,
      mood_score: moodData.moodScore,
      mood_label: moodData.moodLabel,
      journal_text: moodData.journalText || "",
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Journal Functions
export const getJournalEntries = async (userId) => {
  try {
    const response = await apiClient.get(`/journal/entries/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

export const createJournalEntry = async (userId, entry) => {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("text", entry.text);
    if (entry.image) {
      formData.append("image", entry.image);
    }
    if (entry.mood) {
      formData.append("mood", entry.mood);
    }

    const response = await apiClient.post(`/journal/entry`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Session Reports Functions
export const getSessionReports = async (userId) => {
  try {
    const response = await apiClient.get(`/reports/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

export const getActiveSessionReports = async (userId) => {
  try {
    const response = await apiClient.get(`/reports/active/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Distress Detection Functions
export const getDistressScore = async (userId) => {
  try {
    const response = await apiClient.get(`/distress/score/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

export const calculateDistressScore = async (text) => {
  try {
    const response = await apiClient.post(`/distress/calculate`, {
      text,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Psychologist Booking Functions
export const getAvailablePsychologists = async (specialty = null) => {
  try {
    const params = specialty ? { specialty } : {};
    const response = await apiClient.get(`/psychologists`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

export const bookPsychologistSession = async (bookingData) => {
  try {
    const response = await apiClient.post(`/bookings`, bookingData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Progress Tracking Functions
export const updateProgress = async (reportId, userId, progressData) => {
  try {
    const response = await apiClient.put(`/reports/${reportId}/progress`, {
      user_id: userId,
      progress_notes: progressData,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Escalation Functions
export const logEscalation = async (escalationData) => {
  try {
    const response = await apiClient.post(`/escalations`, escalationData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};
