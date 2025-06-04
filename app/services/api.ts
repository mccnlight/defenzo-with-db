import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { getToken } from '@/app/services/auth';

export const BASE_URL = 'http://10.42.0.201:8081';
export const API_URL = `${BASE_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture_url: string | null;
}

export interface UserBadge {
  id: string;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    requirements: {
      type: string;
      value: number;
    };
  };
  progress: number;
  completed: boolean;
  completed_at?: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/login', credentials);
  const { token } = response.data;
  await AsyncStorage.setItem('token', token);
  return token;
};

export const register = async (credentials: RegisterCredentials) => {
  const response = await api.post('/register', credentials);
  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};

// Profile functions
export const uploadProfilePicture = async () => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // Handle cancellation gracefully
    if (result.canceled) {
      return null; // Return null instead of throwing an error
    }

    console.log('Selected image:', result.assets[0]);

    // Create form data
    const formData = new FormData();
    const imageUri = result.assets[0].uri;
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Handle file differently for web
    if (Platform.OS === 'web') {
      // For web, we need to fetch the file and create a Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('profile_picture', blob, filename);
    } else {
      // For mobile, use the existing approach
      formData.append('profile_picture', {
        uri: imageUri,
        type: type,
        name: filename,
      } as any);
    }

    console.log('FormData created, attempting upload...');
    
    // Upload image
    const response = await api.post('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', response.data);
    return response.data.profile_picture_url;
  } catch (error: any) {
    console.error('Profile picture upload error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const updateProfile = async (data: { full_name?: string }) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/profile');
  return response.data;
};

export const getBadges = async (): Promise<UserBadge[]> => {
  try {
    const response = await api.get('/user/badges');
    return response.data;
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
};

export default api; 