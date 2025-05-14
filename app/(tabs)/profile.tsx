import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  Medal, 
  Award, 
  BookOpen, 
  ChevronRight,
  Shield,
  Star,
  LogOut
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('stats');
  
  const statItems = [
    { 
      id: 'courses', 
      title: 'Courses Completed', 
      value: 7,
      icon: BookOpen,
      color: Colors.dark.primary
    },
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
    { 
      id: 'level', 
      title: 'Security Level', 
      value: 'Advanced',
      icon: Shield,
      color: Colors.dark.accent
    },
  ];
  
  const achievementItems = [
    {
      id: 'a1',
      title: 'Phishing Expert',
      description: 'Successfully identified 20 phishing attempts',
      date: 'Jun 15, 2024',
      icon: Shield,
      color: Colors.dark.primary
    },
    {
      id: 'a2',
      title: 'Course Champion',
      description: 'Completed 5 security courses with perfect scores',
      date: 'May 22, 2024',
      icon: BookOpen,
      color: Colors.dark.accent
    },
    {
      id: 'a3',
      title: 'Password Master',
      description: 'Created password strategies that beat common attacks',
      date: 'May 10, 2024',
      icon: Shield,
      color: Colors.dark.warning
    },
    {
      id: 'a4',
      title: 'Learning Streak',
      description: 'Completed learning activities for 30 consecutive days',
      date: 'Apr 28, 2024',
      icon: Award,
      color: Colors.dark.secondary
    },
  ];
  
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
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600' }}
                  style={styles.avatar}
                />
                <View style={styles.badgeContainer}>
                  <Medal color="#FFD700" size={20} />
                </View>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Alex Johnson</Text>
                <Text style={styles.profileEmail}>alex@example.com</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Advanced User</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'stats' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'stats' && styles.activeTabText
            ]}>
              Statistics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'achievements' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'achievements' && styles.activeTabText
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'stats' && (
          <>
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
            
            <TouchableOpacity style={styles.menuItem}>
              <BookOpen color={Colors.dark.primary} size={22} />
              <Text style={styles.menuItemText}>My Courses</Text>
              <ChevronRight color={Colors.dark.text} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Award color={Colors.dark.warning} size={22} />
              <Text style={styles.menuItemText}>Badges & Certificates</Text>
              <ChevronRight color={Colors.dark.text} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Shield color={Colors.dark.accent} size={22} />
              <Text style={styles.menuItemText}>Security Score</Text>
              <ChevronRight color={Colors.dark.text} size={20} />
            </TouchableOpacity>
          </>
        )}
        
        {activeTab === 'achievements' && (
          <View style={styles.achievementsContainer}>
            {achievementItems.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={styles.achievementItem}>
                  <View style={[styles.achievementIconContainer, {
                    backgroundColor: item.color + '20'
                  }]}>
                    <Icon color={item.color} size={24} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{item.title}</Text>
                    <Text style={styles.achievementDescription}>
                      {item.description}
                    </Text>
                    <Text style={styles.achievementDate}>{item.date}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        
        <TouchableOpacity style={styles.logoutButton}>
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.medium,
  },
  activeTabButton: {
    backgroundColor: Colors.dark.primary,
  },
  tabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
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
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  progressContainer: {
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.sm,
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
  achievementsContainer: {
    marginBottom: Layout.spacing.lg,
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  achievementDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.xs,
  },
  achievementDate: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.error + '20',
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xxl,
  },
  logoutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
    marginLeft: Layout.spacing.sm,
  },
});