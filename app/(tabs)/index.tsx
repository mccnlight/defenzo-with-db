import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Trophy, Activity, Shield, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import RecommendedCourseCard from '@/components/home/RecommendedCourseCard';
import SecurityScoreCard from '@/components/home/SecurityScoreCard';
import AchievementCard from '@/components/home/AchievementCard';
import { mockCourses } from '@/data/mockCourses';

export default function HomeScreen() {
  const featuredCourse = mockCourses[0];
  const recommendedCourses = mockCourses.slice(1, 4);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>Alex</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        </View>
        
        <SecurityScoreCard score={75} />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.featuredCourse}>
          <LinearGradient
            colors={['#2563EB', '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredCourseGradient}
          >
            <View style={styles.featuredCourseContent}>
              <View style={styles.featuredCourseInfo}>
                <Text style={styles.featuredCourseCategory}>COURSE</Text>
                <Text style={styles.featuredCourseTitle}>{featuredCourse.title}</Text>
                <Text style={styles.featuredCourseProgress}>
                  {featuredCourse.progress}% Complete
                </Text>
              </View>
              <View style={styles.featuredCourseImageContainer}>
                <Shield color="white" size={48} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedCoursesContainer}
        >
          {recommendedCourses.map((course) => (
            <RecommendedCourseCard key={course.id} course={course} />
          ))}
        </ScrollView>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContainer}
        >
          <AchievementCard 
            title="Phishing Pro" 
            description="Identified 10 phishing attempts" 
            icon={<Trophy color={Colors.dark.warning} size={24} />}
            progress={100}
          />
          <AchievementCard 
            title="Password Expert" 
            description="Created a strong password" 
            icon={<Shield color={Colors.dark.primary} size={24} />}
            progress={100}
          />
          <AchievementCard 
            title="Security Analyst" 
            description="Complete 5 security courses" 
            icon={<Activity color={Colors.dark.accent} size={24} />}
            progress={60}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.lg,
  },
  welcomeText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  nameText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
  },
  viewAllText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.primary,
  },
  featuredCourse: {
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
    marginVertical: Layout.spacing.sm,
  },
  featuredCourseGradient: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
  },
  featuredCourseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredCourseInfo: {
    flex: 1,
  },
  featuredCourseCategory: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Layout.spacing.sm,
  },
  featuredCourseTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  featuredCourseProgress: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  featuredCourseImageContainer: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedCoursesContainer: {
    paddingVertical: Layout.spacing.sm,
  },
  achievementsContainer: {
    paddingVertical: Layout.spacing.sm,
  },
});