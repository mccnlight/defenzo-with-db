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
  LogOut,
  Camera
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { fonts, fontSizes } from '../../constants/Fonts';
import { getProfile, uploadProfilePicture, logout, User, BASE_URL } from '../services/api';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
                    onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarPlaceholderText}>
                      {user?.full_name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.cameraButton}>
                  <Camera color={Colors.dark.text} size={16} />
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
        
          <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut color={Colors.dark.error} size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={loadProfile} style={{ marginTop: 16, alignSelf: 'center' }}>
          <Text style={{ color: Colors.dark.primary, fontFamily: fonts.bodyMedium, fontSize: fontSizes.md }}>Refresh Profile</Text>
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
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  settingsButton: {
    padding: Layout.spacing.sm,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
  },
  profileSection: {
    marginBottom: Layout.spacing.xl,
  },
  profileGradient: {
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  profileContent: {
    padding: Layout.spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.secondary,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
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
    marginBottom: Layout.spacing.md,
  },
  levelBadge: {
    backgroundColor: Colors.dark.primary + '40',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.round,
  },
  levelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.error + '20',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    marginTop: Layout.spacing.xl,
  },
  logoutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
    marginLeft: Layout.spacing.sm,
  },
});