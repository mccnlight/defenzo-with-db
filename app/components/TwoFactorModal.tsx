import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { X, Smartphone, Mail } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';

interface TwoFactorModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TwoFactorModal({ visible, onClose }: TwoFactorModalProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [method, setMethod] = useState<'app' | 'sms' | null>(null);

  const toggleSwitch = () => {
    if (isEnabled) {
      Alert.alert(
        'Disable 2FA',
        'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              setIsEnabled(false);
              setMethod(null);
            },
          },
        ],
      );
    } else {
      setIsEnabled(true);
    }
  };

  const selectMethod = (selectedMethod: 'app' | 'sms') => {
    setMethod(selectedMethod);
    // TODO: Implement actual 2FA setup
    Alert.alert('Coming Soon', '2FA setup will be available in the next update.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <View style={styles.enableContainer}>
              <View style={styles.enableInfo}>
                <Text style={styles.enableTitle}>Enable 2FA</Text>
                <Text style={styles.enableDescription}>
                  Add an extra layer of security to your account
                </Text>
              </View>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={isEnabled ? Colors.dark.text : Colors.dark.text + '80'}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={styles.switch}
                />
              </View>
            </View>
          </View>

          {isEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Method</Text>
              <View style={styles.methodsContainer}>
                <TouchableOpacity
                  style={[
                    styles.methodCard,
                    method === 'app' && styles.methodCardSelected,
                  ]}
                  onPress={() => selectMethod('app')}
                >
                  <View style={styles.methodIconContainer}>
                    <Smartphone size={24} color={Colors.dark.primary} />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Authenticator App</Text>
                    <Text style={styles.methodDescription}>
                      Use an authenticator app like Google Authenticator
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodCard,
                    method === 'sms' && styles.methodCardSelected,
                  ]}
                  onPress={() => selectMethod('sms')}
                >
                  <View style={styles.methodIconContainer}>
                    <Mail size={24} color={Colors.dark.primary} />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>SMS Code</Text>
                    <Text style={styles.methodDescription}>
                      Receive verification codes via SMS
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  enableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    minHeight: 80,
  },
  enableInfo: {
    flex: 1,
    marginRight: Layout.spacing.lg,
  },
  enableTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  enableDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  switchContainer: {
    justifyContent: 'center',
    paddingLeft: Layout.spacing.md,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.primary,
    marginBottom: Layout.spacing.md,
  },
  methodsContainer: {
    gap: Layout.spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  methodCardSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '10',
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  methodDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
}); 