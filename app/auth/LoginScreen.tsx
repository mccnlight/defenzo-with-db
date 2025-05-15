import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import { fonts, fontSizes } from '../../constants/Fonts';
import { login, register, LoginCredentials, RegisterCredentials } from '../services/api';

export default function LoginScreen({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      if (!email || !password || (!isLogin && !fullName)) {
        setError('Please fill in all fields.');
        return;
      }

      if (isLogin) {
        const credentials: LoginCredentials = { email, password };
        await login(credentials);
      } else {
        const credentials: RegisterCredentials = { email, password, full_name: fullName };
        await register(credentials);
        // After registration, log in the user
        await login({ email, password });
      }

      if (onAuthSuccess) onAuthSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={Colors.dark.text + '80'}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.dark.text + '80'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.dark.text + '80'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.dark.text} />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          disabled={loading}
        >
          <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: Colors.dark.text,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.dark.text,
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
  },
  toggleText: {
    color: Colors.dark.secondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginTop: 8,
  },
  error: {
    color: Colors.dark.error,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginBottom: 8,
  },
}); 