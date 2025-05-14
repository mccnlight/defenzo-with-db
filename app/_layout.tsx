import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { 
  PlusJakartaSans_700Bold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { SplashScreen } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import LoginScreen from './auth/LoginScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    PlusJakartaSans_700Bold,
  });

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <LoginScreen onAuthSuccess={() => setAuthenticated(true)} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { 
          backgroundColor: Colors.dark.background 
        },
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});