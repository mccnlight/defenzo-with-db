import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export const BASE_URL = 'http://10.202.15.93:8081';
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

  if (result.canceled) {
    throw new Error('Image picking was canceled');
  }

  // Create form data
  const formData = new FormData();
  formData.append('profile_picture', {
    uri: result.assets[0].uri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  } as any);

  // Upload image
  const response = await api.post('/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.profile_picture_url;
};

export const updateProfile = async (data: { full_name?: string }) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/profile');
  return response.data;
};

export default api; 