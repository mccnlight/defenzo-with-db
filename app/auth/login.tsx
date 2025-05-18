import React from 'react';
import { useRouter } from 'expo-router';
import LoginScreen from './LoginScreen';

export default function LoginWrapper() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.replace('/(tabs)');
  };

  return <LoginScreen onAuthSuccess={handleAuthSuccess} />;
} 