import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information We Collect</Text>
              <Text style={styles.text}>
                We collect the following types of information to provide and improve our services:{'\n\n'}
                • Account information (email, username){'\n'}
                • Learning progress and achievements{'\n'}
                • Usage data and analytics{'\n'}
                • Device information{'\n'}
                • Technical logs and performance data
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How We Use Your Information</Text>
              <Text style={styles.text}>
                Your information is used to:{'\n\n'}
                • Provide and personalize our services{'\n'}
                • Track and save your learning progress{'\n'}
                • Improve our educational content{'\n'}
                • Send important updates and notifications{'\n'}
                • Maintain the security of our platform
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Security</Text>
              <Text style={styles.text}>
                We implement industry-standard security measures to protect your data. This includes encryption, secure data storage, and regular security audits. We never share your personal information with third parties without your explicit consent.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights</Text>
              <Text style={styles.text}>
                You have the right to:{'\n\n'}
                • Access your personal data{'\n'}
                • Request data correction{'\n'}
                • Delete your account and data{'\n'}
                • Opt-out of marketing communications{'\n'}
                • Export your learning data
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cookies and Tracking</Text>
              <Text style={styles.text}>
                We use cookies and similar technologies to enhance your experience and collect usage data. You can control these through your device settings.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Children's Privacy</Text>
              <Text style={styles.text}>
                Users under 13 years of age require parental consent. We do not knowingly collect personal information from children under 13 without verifiable parental consent.
              </Text>
            </View>

            <View style={[styles.section, styles.lastUpdated]}>
              <Text style={styles.lastUpdatedText}>Last updated: January 2024</Text>
              <TouchableOpacity>
                <Text style={styles.contactText}>Contact: privacy@defenzo.com</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.primary,
    marginBottom: Layout.spacing.md,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  lastUpdated: {
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  contactText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.primary,
    marginTop: Layout.spacing.xs,
  },
}); 