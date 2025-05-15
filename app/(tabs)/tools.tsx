import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link as LinkIcon, Lock, ShieldCheck, ShieldAlert, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_CONFIG } from '@/constants/Config';

export default function ToolsScreen() {
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [urlResult, setUrlResult] = useState<null | {
    safe: boolean;
    risk: 'none' | 'low' | 'medium' | 'high';
    message: string;
  }>(null);
  const [passwordStrength, setPasswordStrength] = useState<null | {
    score: number;
    label: string;
    color: string;
    message: string;
  }>(null);

  const checkUrl = async () => {
    if (!url) return;
    
    try {
      // Show loading state
      setUrlResult({
        safe: false,
        risk: 'medium',
        message: 'Checking URL...',
      });

      // Make request to our backend
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/scan`, {
        url: url,
      });

      const data = response.data;
      
      // Handle error from backend
      if (data.error) {
        setUrlResult({
          safe: false,
          risk: 'high',
          message: data.error,
        });
        return;
      }

      // Process VirusTotal results
      const { total_scans, positive_scans } = data.details;
    
    let result;
      if (positive_scans === 0) {
      result = {
        safe: true,
        risk: 'none' as const,
          message: `This URL appears to be safe (${total_scans} security vendors checked)`,
      };
      } else if (positive_scans <= 2) {
      result = {
        safe: false,
        risk: 'low' as const,
          message: `This URL has been flagged by ${positive_scans} out of ${total_scans} security vendors`,
      };
      } else if (positive_scans <= 5) {
      result = {
        safe: false,
          risk: 'medium' as const,
          message: `This URL has been flagged by ${positive_scans} out of ${total_scans} security vendors`,
      };
    } else {
      result = {
        safe: false,
          risk: 'high' as const,
          message: `This URL has been flagged as malicious by ${positive_scans} out of ${total_scans} security vendors`,
      };
    }
    
    setUrlResult(result);
    } catch (error) {
      console.error('Error checking URL:', error);
      setUrlResult({
        safe: false,
        risk: 'high',
        message: 'Failed to check URL. Please try again.',
      });
    }
  };

  const checkPassword = async () => {
    if (!password) return;
    try {
      setPasswordStrength({
        score: 0,
        label: 'Checking...',
        color: Colors.dark.warning,
        message: 'Checking password...',
      });
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/password-check`, {
        password: password,
      });
      const data = response.data;
      let color = Colors.dark.error;
      if (data.label === 'Medium') color = Colors.dark.warning;
      if (data.label === 'Strong') color = Colors.dark.success;
      let message = '';
      if (data.suggestions && data.suggestions.length > 0) {
        message = 'Suggestions: ' + data.suggestions.join(', ');
    } else {
        message = 'This password is ' + data.label.toLowerCase() + ' and secure';
      }
      setPasswordStrength({
        score: data.score,
        label: data.label,
        color,
        message,
      });
    } catch (error) {
      console.error('Error checking password:', error);
      setPasswordStrength({
        score: 0,
        label: 'Error',
        color: Colors.dark.error,
        message: 'Failed to check password. Please try again.',
      });
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Security Tools</Text>
          <Text style={styles.headerSubtitle}>
            Check URLs and passwords for potential security risks
          </Text>
          
          <View style={styles.toolCard}>
            <View style={styles.toolHeader}>
              <View style={styles.toolIconContainer}>
                <LinkIcon color={Colors.dark.primary} size={24} />
              </View>
              <Text style={styles.toolTitle}>URL Safety Checker</Text>
            </View>
            
            <Text style={styles.toolDescription}>
              Verify if a website is safe to visit or potentially malicious
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter a URL to check"
                placeholderTextColor={Colors.dark.text + '80'}
                value={url}
                onChangeText={setUrl}
              />
              <TouchableOpacity style={styles.searchButton} onPress={checkUrl}>
                <Search color={Colors.dark.text} size={20} />
              </TouchableOpacity>
            </View>
            
            {urlResult && (
              <View style={[styles.resultContainer, {
                backgroundColor: urlResult.safe 
                  ? Colors.dark.success + '20'
                  : (urlResult.risk === 'high' 
                    ? Colors.dark.error + '20' 
                    : Colors.dark.warning + '20')
              }]}>
                {urlResult.safe ? (
                  <CheckCircle2 
                    color={Colors.dark.success} 
                    size={24} 
                  />
                ) : urlResult.risk === 'high' ? (
                  <ShieldAlert 
                    color={Colors.dark.error} 
                    size={24} 
                  />
                ) : (
                  <AlertTriangle 
                    color={Colors.dark.warning} 
                    size={24} 
                  />
                )}
                <Text style={styles.resultText}>{urlResult.message}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.toolCard}>
            <View style={styles.toolHeader}>
              <View style={[styles.toolIconContainer, {
                backgroundColor: Colors.dark.secondary + '20'
              }]}>
                <Lock color={Colors.dark.secondary} size={24} />
              </View>
              <Text style={styles.toolTitle}>Password Strength</Text>
            </View>
            
            <Text style={styles.toolDescription}>
              Check how strong your password is against common attacks
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter a password to check"
                placeholderTextColor={Colors.dark.text + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity 
                style={styles.checkButton} 
                onPress={checkPassword}
              >
                <Text style={styles.checkButtonText}>Check</Text>
              </TouchableOpacity>
            </View>
            
            {passwordStrength && (
              <View>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: `${(passwordStrength.score / 6) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }
                    ]} 
                  />
                </View>
                <View style={styles.strengthResult}>
                  <Text style={[styles.strengthLabel, {
                    color: passwordStrength.color
                  }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
                {passwordStrength.score < 5 && (
                  <View style={styles.strengthTips}>
                    <Text style={styles.tipsTitle}>Tips to improve:</Text>
                    <Text style={styles.tipItem}>• Use at least 12 characters</Text>
                    <Text style={styles.tipItem}>• Mix uppercase and lowercase letters</Text>
                    <Text style={styles.tipItem}>• Include numbers and special characters</Text>
                    <Text style={styles.tipItem}>• Avoid common words or patterns</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          <TouchableOpacity style={styles.additionalToolButton}>
            <LinearGradient
              colors={[Colors.dark.primary + '40', Colors.dark.secondary + '40']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.additionalToolGradient}
            >
              <ShieldCheck color={Colors.dark.text} size={24} />
              <Text style={styles.additionalToolText}>
                Run Complete Security Scan
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: Layout.spacing.md,
    paddingBottom: 120, // Extra padding for bottom tab bar
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  headerSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.lg,
  },
  toolCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  toolTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
  },
  toolDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.md,
    color: Colors.dark.text,
    fontFamily: fonts.body,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.sm,
  },
  checkButton: {
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginLeft: Layout.spacing.sm,
  },
  checkButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
  },
  resultText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  strengthBar: {
    height: 8,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    marginVertical: Layout.spacing.md,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  strengthResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  strengthLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    marginRight: Layout.spacing.md,
  },
  strengthMessage: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  strengthTips: {
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
  },
  tipsTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  tipItem: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.xs,
  },
  additionalToolButton: {
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
    marginBottom: Layout.spacing.xl,
  },
  additionalToolGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
  },
  additionalToolText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.md,
  },
});