import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Trophy, Activity, Shield, BookOpen, AlertTriangle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import RecommendedCourseCard from '@/components/home/RecommendedCourseCard';
import SecurityScoreCard from '@/components/home/SecurityScoreCard';
import AchievementCard from '@/components/home/AchievementCard';
import { mockCourses } from '@/app/data/mockCourses';
import { mockNewsArticles } from '@/data/mockNews';
import { Link, router } from 'expo-router';
import { getRecommendedCourses, getContinueLearningCourses } from '@/hooks/useSecurityScore';

// Временные моковые данные для демонстрации
const mockUserMetrics = {
  coursesCompleted: 3,
  totalCourses: 8,
  quizScores: [85, 90, 75],
  practicalTasksCompleted: 2,
  totalPracticalTasks: 5,
  lastAccessedCourses: {
    'c1': new Date('2024-05-23'),
    'c2': new Date('2024-05-24'),
  },
  completedCategories: ['basics'],
  preferredCategories: ['web', 'passwords']
};

export default function HomeScreen() {
  // Получаем отсортированные курсы с помощью новой логики
  const recommendedCourses = getRecommendedCourses(mockCourses, mockUserMetrics);
  const continuelearningCourses = getContinueLearningCourses(mockCourses, mockUserMetrics);
  const featuredCourse = continuelearningCourses[0] || mockCourses[0];
  
  const latestNews = mockNewsArticles[0];

  const handleNewsPress = () => {
    // Переходим на вкладку News и передаем ID новости
    router.push({
      pathname: "/(tabs)/news",
      params: { selectedNewsId: latestNews.id }
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
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
        
        <SecurityScoreCard />
        
        {continuelearningCourses.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity>
              <LinearGradient
                colors={['#2563EB', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredCourseGradient}
              >
                <View style={styles.featuredCourseContent}>
                  <View style={styles.featuredCourseInfo}>
                    <Text style={styles.featuredCourseCategory}>CONTINUE</Text>
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
          </>
        )}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
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
          <Text style={styles.sectionTitle}>Latest Achievements</Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContainer}
        >
          <AchievementCard
            title="Quick Learner"
            description="Complete 5 courses in Cybersecurity Basics"
            icon={<Trophy color={Colors.dark.primary} size={24} />}
            progress={60}
            color={Colors.dark.primary}
            onPress={() => router.push('/(screens)/badges')}
          />
          <AchievementCard
            title="Quiz Master"
            description="Score 90%+ in 3 security assessment quizzes"
            icon={<Activity color={Colors.dark.warning} size={24} />}
            progress={30}
            color={Colors.dark.warning}
            onPress={() => router.push('/(screens)/badges')}
          />
          <AchievementCard
            title="Security Expert"
            description="Complete all advanced security modules"
            icon={<Shield color={Colors.dark.secondary} size={24} />}
            progress={45}
            color={Colors.dark.secondary}
            onPress={() => router.push('/(screens)/badges')}
          />
        </ScrollView>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security News</Text>
        </View>
        
        <TouchableOpacity style={styles.newsCard} onPress={handleNewsPress}>
          <View style={styles.newsIconContainer}>
            <AlertTriangle color={Colors.dark.warning} size={24} />
          </View>
          
          <View style={styles.newsContent}>
            <View style={styles.newsHeader}>
              <Text style={styles.newsCategory}>{latestNews.category}</Text>
              <Text style={styles.newsDate}>{latestNews.date}</Text>
            </View>
            
            <Text style={styles.newsTitle}>{latestNews.title}</Text>
            <Text style={styles.newsDescription} numberOfLines={2}>
              {latestNews.summary}
            </Text>
            
            <View style={styles.newsFooter}>
              <Text style={styles.readMoreText}>Read More</Text>
              <ChevronRight color={Colors.dark.primary} size={16} />
            </View>
          </View>
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
  scrollContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 120,
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
  newsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  newsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  newsContent: {
    flex: 1,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  newsCategory: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.warning,
  },
  newsDate: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  newsTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  newsDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.sm,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.primary,
    marginRight: Layout.spacing.xs,
  },
});