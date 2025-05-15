import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  Medal, 
  Award, 
  Star,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Link, useRouter } from 'expo-router';
import SecurityStats from '@/components/profile/SecurityStats';
import { getProfile, uploadProfilePicture, logout, User, BASE_URL } from '@/app/services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const statItems = [
    { 
      id: 'badges', 
      title: 'Badges Earned', 
      value: 12,
      icon: Award,
      color: Colors.dark.warning
    },
    { 
      id: 'points', 
      title: 'Total Points', 
      value: '2,450',
      icon: Star,
      color: Colors.dark.secondary
    },
  ];

  useEffect(() => {
    loadProfile();
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
      setUser((prev: User | null) => prev ? { ...prev, profile_picture_url: profilePictureUrl } : null);
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
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings color={Colors.dark.text} size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[Colors.dark.primary + '40', Colors.dark.secondary + '40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.profileContent}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleUploadPicture}
                disabled={uploading}
              >
                {user?.profile_picture_url ? (
                  <Image
                    source={{ uri: `${BASE_URL}/${user.profile_picture_url}` }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarPlaceholderText}>
                      {user?.full_name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.badgeContainer}>
                  <Medal color="#FFD700" size={20} />
                </View>
                {uploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator color={Colors.dark.text} />
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.full_name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Advanced User</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <SecurityStats />
        
        <View style={styles.statsGrid}>
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.id} style={styles.statItem}>
                <View style={[styles.statIconContainer, {
                  backgroundColor: item.color + '20'
                }]}>
                  <Icon color={item.color} size={24} />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statTitle}>{item.title}</Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <Text style={styles.progressText}>70% Complete</Text>
          </View>
          <Text style={styles.progressDescription}>
            Complete more courses to reach Expert level
          </Text>
        </View>
        
        <Link href="/(screens)/badges" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Award color={Colors.dark.warning} size={22} />
            <Text style={styles.menuItemText}>Badges & Certificates</Text>
            <ChevronRight color={Colors.dark.text} size={20} />
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
    paddingBottom: 120, // Extra padding for bottom tab bar
  },
  profileSection: {
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  profileGradient: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
  },
  profileContent: {
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
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  profileEmail: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  statTitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  progressContainer: {
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  progressDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  menuItemText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  logoutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
  },
});