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

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsModal({ visible, onClose }: TermsModalProps) {
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
            <Text style={styles.modalTitle}>Terms of Service</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.text}>
                By accessing and using the Defenzo application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. User Accounts</Text>
              <Text style={styles.text}>
                • You must be at least 13 years old to use this service{'\n'}
                • You are responsible for maintaining the confidentiality of your account{'\n'}
                • You agree to provide accurate and complete information{'\n'}
                • You are responsible for all activities under your account
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Content and Conduct</Text>
              <Text style={styles.text}>
                • All content provided is for educational purposes only{'\n'}
                • You agree not to use the service for malicious purposes{'\n'}
                • You will not attempt to breach or test the security of real systems without authorization{'\n'}
                • You will not share solutions to challenges or exercises
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
              <Text style={styles.text}>
                All content, features, and functionality of the Defenzo application are owned by Defenzo and are protected by international copyright, trademark, and other intellectual property laws.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Service Modifications</Text>
              <Text style={styles.text}>
                We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will provide notice when possible but are not obligated to do so.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
              <Text style={styles.text}>
                Defenzo is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
              <Text style={styles.text}>
                We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
              </Text>
            </View>

            <View style={[styles.section, styles.lastUpdated]}>
              <Text style={styles.lastUpdatedText}>Last updated: January 2024</Text>
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
}); 