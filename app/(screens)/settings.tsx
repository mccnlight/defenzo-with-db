import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Info,
  FileText,
  HelpCircle,
  Shield,
  Mail,
  ChevronRight,
  Star,
  ChevronLeft,
  ExternalLink
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { router } from 'expo-router';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  isLast?: boolean;
  description?: string;
  isExternal?: boolean;
}

const SettingsItem = ({ 
  icon, 
  title, 
  onPress, 
  isLast,
  description,
  isExternal 
}: SettingsItemProps) => (
  <TouchableOpacity 
    style={[
      styles.settingsItem,
      !isLast && styles.settingsItemBorder
    ]} 
    onPress={onPress}
  >
    <View style={styles.settingsItemLeft}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingsItemDescription}>{description}</Text>
        )}
      </View>
    </View>
    {isExternal ? (
      <ExternalLink size={20} color={Colors.dark.text} style={{ opacity: 0.6 }} />
    ) : (
      <ChevronRight size={20} color={Colors.dark.text} style={{ opacity: 0.6 }} />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@defenzo.com');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ChevronLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<HelpCircle size={24} color={Colors.dark.primary} />}
              title="FAQ"
              description="Get answers to common questions"
              onPress={() => console.log("FAQ pressed")}
            />
            <SettingsItem
              icon={<Mail size={24} color={Colors.dark.accent} />}
              title="Contact Support"
              description="We're here to help"
              onPress={handleEmailSupport}
              isLast
              isExternal
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Info size={24} color={Colors.dark.secondary} />}
              title="About Us"
              description="Learn more about Defenzo"
              onPress={() => console.log("About Us pressed")}
            />
            <SettingsItem
              icon={<Star size={24} color={Colors.dark.warning} />}
              title="Rate App"
              description="Share your feedback"
              onPress={() => console.log("Rate App pressed")}
              isLast
              isExternal
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<FileText size={24} color={Colors.dark.error} />}
              title="Terms of Service"
              description="Read our terms of service"
              onPress={() => console.log("Terms pressed")}
            />
            <SettingsItem
              icon={<Shield size={24} color={Colors.dark.primary} />}
              title="Privacy Policy"
              description="Learn how we protect your data"
              onPress={() => console.log("Privacy pressed")}
              isLast
            />
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.primary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    marginHorizontal: Layout.spacing.md,
    padding: Layout.spacing.xs,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsItemTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: 2,
  },
  settingsItemDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
  },
  versionText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
  },
}); 