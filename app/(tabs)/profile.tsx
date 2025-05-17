import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  Award,
  LogOut,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Link, useRouter } from 'expo-router';
import SecurityStats from '@/components/profile/SecurityStats';
import { getProfile, uploadProfilePicture, logout, User as ApiUser } from '@/app/services/api';
import { API_CONFIG } from '@/constants/Config';

// Security tips that will rotate
const securityTips = [
  {
    title: 'Password Security',
    tip: 'Use a unique password for each account and make them at least 12 characters long.',
    icon: '🔐',
  },
  {
    title: 'Two-Factor Authentication',
    tip: 'Enable 2FA wherever possible to add an extra layer of security to your accounts.',
    icon: '🔒',
  },
  {
    title: 'Software Updates',
    tip: 'Keep your software and systems up to date to protect against known vulnerabilities.',
    icon: '🔄',
  },
  {
    title: 'Phishing Awareness',
    tip: 'Always verify the sender and be cautious of unexpected emails asking for personal information.',
    icon: '📧',
  },
  {
    title: 'Public Wi-Fi Safety',
    tip: 'Use a VPN when connecting to public Wi-Fi networks to protect your data.',
    icon: '📶',
  },
  {
    title: 'Data Backup',
    tip: 'Regularly backup your important data to prevent loss from ransomware attacks.',
    icon: '💾',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    loadProfile();
    // Rotate tips every 20 minutes
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % securityTips.length);
    }, 1200000);

    return () => {
      clearInterval(tipInterval);
    };
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      console.log('Profile data:', userData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadPicture = async () => {
    try {
      setUploading(true);
      const profilePictureUrl = await uploadProfilePicture();
      setUser((prev: ApiUser | null) => prev ? { ...prev, profile_picture_url: profilePictureUrl } : null);
      Alert.alert('Success', 'Profile picture updated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const currentTip = securityTips[currentTipIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/(screens)/settings')}
        >
          <Settings color={Colors.dark.text} size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.welcomeSection}>
          <LinearGradient
            colors={[Colors.dark.primary + '40', Colors.dark.secondary + '40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleUploadPicture}
                disabled={uploading}
              >
                {user?.profile_picture_url ? (
                  <Image
                    source={{ uri: `${API_CONFIG.BASE_URL}/${user.profile_picture_url}` }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarPlaceholderText}>
                      {user?.full_name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
                {uploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator color={Colors.dark.text} />
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.welcomeInfo}>
                <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Advanced User</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.securityTipCard}>
          <View style={styles.tipHeader}>
            <View style={styles.tipTitleContainer}>
              <Shield color={Colors.dark.primary} size={20} />
              <Text style={styles.tipTitle}>Security Tip</Text>
            </View>
          </View>
          <View style={styles.tipContent}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipEmoji}>{currentTip.icon}</Text>
            </View>
            <View style={styles.tipTextContent}>
              <Text style={styles.tipSubtitle}>{currentTip.title}</Text>
              <Text style={styles.tipText}>{currentTip.tip}</Text>
            </View>
          </View>
        </View>

        <SecurityStats />
        
        <Link href="/(screens)/badges" asChild>
          <TouchableOpacity style={styles.badgesButton}>
            <View style={styles.badgesContent}>
              <View style={styles.badgesIconContainer}>
                <Award color={Colors.dark.warning} size={24} />
              </View>
              <View style={styles.badgesTextContainer}>
                <Text style={styles.badgesTitle}>Badges & Certificates</Text>
                <Text style={styles.badgesSubtitle}>View your achievements and progress</Text>
              </View>
            </View>
            <ChevronRight color={Colors.dark.text} size={24} style={styles.badgesArrow} />
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={Colors.dark.error} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 120, // Increased padding for better scrolling
  },
  welcomeSection: {
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  welcomeGradient: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Layout.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.round,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarPlaceholder: {
    backgroundColor: Colors.dark.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  userName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  userEmail: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.sm,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Layout.borderRadius.round,
  },
  levelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  securityTipCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  tipTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  tipTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.md,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipTextContent: {
    flex: 1,
  },
  tipSubtitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  tipText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    lineHeight: fontSizes.sm * 1.6,
  },
  badgesButton: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  badgesContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgesIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  badgesTextContainer: {
    flex: 1,
  },
  badgesTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  badgesSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  badgesArrow: {
    position: 'absolute',
    right: Layout.spacing.lg,
    top: '50%',
    marginTop: -12,
    opacity: 0.6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.error + '20',
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  logoutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
  },
});
