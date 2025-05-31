import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Trophy, Activity, Shield, BookOpen, AlertTriangle, ChevronRight, Eye, Target, Settings, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import RecommendedCourseCard from '@/components/home/RecommendedCourseCard';
import SecurityScoreCard from '@/components/home/SecurityScoreCard';
import AchievementCard from '@/components/home/AchievementCard';
import { mockNewsArticles } from '@/data/mockNews';
import { Link, router, useRouter } from 'expo-router';
import { getRecommendedCourses, getContinueLearningCourses } from '@/hooks/useSecurityScore';
import { useCourseStore } from '@/app/store/courseStore';
import { getProfile, User as ApiUser } from '@/app/services/api';
import NewsCard from '@/components/news/NewsCard';

// Temporary mock data for demonstration
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  color: string;
}

// Общие достижения для всего приложения
export const globalAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'Quick Learner',
    description: 'Complete 5 courses in Cybersecurity Basics',
    icon: '🚀',
    progress: 60,
    color: Colors.dark.primary
  },
  {
    id: 'ach2',
    title: 'Quiz Master',
    description: 'Score 90%+ in 3 security assessment quizzes',
    icon: '🎯',
    progress: 30,
    color: Colors.dark.warning
  },
  {
    id: 'ach3',
    title: 'Security Expert',
    description: 'Complete all advanced security modules',
    icon: '🛡️',
    progress: 45,
    color: Colors.dark.secondary
  },
  {
    id: 'ach4',
    title: 'Network Guardian',
    description: 'Master network security fundamentals',
    icon: '🌐',
    progress: 75,
    color: Colors.dark.accent
  },
  {
    id: 'ach5',
    title: 'Privacy Champion',
    description: 'Complete data privacy and protection courses',
    icon: '🔐',
    progress: 20,
    color: Colors.dark.error
  }
];

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { courses, userProgress, fetchCourses, fetchUserProgress } = useCourseStore();
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    // Fetch user profile and progress
    getProfile().then(setUser).catch(() => setUser(null));
    fetchCourses();
    fetchUserProgress();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Оптимизируем получение курсов с помощью useMemo
  const { recommendedCourses, continuelearningCourses, featuredCourse } = useMemo(() => {
    const recommended = getRecommendedCourses(courses, mockUserMetrics);
    const continuing = getContinueLearningCourses(courses, userProgress || []);
    
    // Calculate progress for each course
    const coursesWithProgress = continuing.map(course => {
      const courseProgress = (userProgress || []).filter(p => p.course_id === course.id && p.lesson_id) || [];
      const completedLessons = courseProgress.filter(p => p.completed).length;
      const totalLessons = course.lessons?.length || 0;
      const calculatedProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return { ...course, progress: calculatedProgress };
    });

    return {
      recommendedCourses: recommended,
      continuelearningCourses: coursesWithProgress,
      featuredCourse: coursesWithProgress[0] || courses[0]
    };
  }, [courses, userProgress]);
  
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
            <Text style={styles.nameText}>{user?.full_name || 'User'}</Text>
          </View>
        </View>
        
        {!isLoading && (
          <>
        <SecurityScoreCard />
        
        {continuelearningCourses.length > 0 && (
              <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
            </View>
            
                <TouchableOpacity 
                  style={styles.featuredCourse}
                  onPress={() => router.push({
                    pathname: '/(screens)/course/[id]',
                    params: { id: featuredCourse.id }
                  })}
                >
              <LinearGradient
                colors={['#2563EB', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredCourseGradient}
              >
                <View style={styles.featuredCourseContent}>
                  <View style={styles.featuredCourseInfo}>
                    <Text style={styles.featuredCourseCategory}>CONTINUE</Text>
                        <Text style={styles.featuredCourseTitle} numberOfLines={2}>
                          {featuredCourse.title}
                        </Text>
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
              </View>
            )}

            <View style={styles.section}>
              <LatestAchievements achievements={globalAchievements.slice(0, 3)} />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Security News</Text>
              </View>
              <SecurityNewsPreview />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface LatestAchievementsProps {
  achievements: Achievement[];
}

const LatestAchievements = ({ achievements }: LatestAchievementsProps) => {
  const router = useRouter();

  return (
    <>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => router.push('/(screens)/badges')}
      >
        <View style={styles.sectionTitleContainer}>
          <Trophy size={20} color={Colors.dark.primary} />
          <Text style={styles.sectionTitle}>Latest Achievements</Text>
        </View>
        <ChevronRight size={20} color={Colors.dark.text} style={{ opacity: 0.6 }} />
      </TouchableOpacity>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContainer}
        >
        {achievements.map((achievement: Achievement) => (
          <TouchableOpacity 
            key={achievement.id} 
            style={styles.achievementCard}
            onPress={() => router.push('/(screens)/badges')}
          >
            <View style={[
              styles.achievementIcon,
              { backgroundColor: achievement.color + '20' }
            ]}>
              <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription} numberOfLines={2}>
                {achievement.description}
              </Text>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${achievement.progress}%`,
                      backgroundColor: achievement.color
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: achievement.color }]}>
                {achievement.progress}% Complete
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        </ScrollView>
    </>
  );
};

const SecurityNewsPreview = () => {
  const router = useRouter();
  const latestNews = mockNewsArticles[0]; // Get the most recent news article

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'active threats':
        return '#FF6B6B';
      case 'security tips':
        return '#4ECB71';
      case 'education':
        return '#4DABF7';
      case 'industry news':
        return '#9775FA';
      case 'tech updates':
        return '#FFB057';
      default:
        return Colors.dark.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'active threats':
        return AlertTriangle;
      case 'security tips':
        return Shield;
      case 'education':
        return BookOpen;
      case 'industry news':
        return Target;
      case 'tech updates':
        return Settings;
      default:
        return TrendingUp;
    }
  };

  const Icon = getCategoryIcon(latestNews.category);
  const categoryColor = getCategoryColor(latestNews.category);

  return (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => router.push('/news')}
    >
      <View style={[
        styles.newsIconContainer,
        { backgroundColor: categoryColor + '20' }
      ]}>
        <Icon size={24} color={categoryColor} />
          </View>
          <View style={styles.newsContent}>
            <View style={styles.newsHeader}>
          <View style={styles.categoryContainer}>
            <Text style={[styles.newsCategory, { color: categoryColor }]}>
              {latestNews.category}
            </Text>
              <Text style={styles.newsDate}>{latestNews.date}</Text>
          </View>
          {latestNews.views && (
            <View style={styles.viewsContainer}>
              <Eye size={14} color={Colors.dark.text} style={styles.viewIcon} />
              <Text style={styles.viewsText}>
                {latestNews.views.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {latestNews.title}
        </Text>
            <Text style={styles.newsDescription} numberOfLines={2}>
              {latestNews.summary}
            </Text>
            <View style={styles.newsFooter}>
          <Text style={styles.readMoreText}>Read more</Text>
          <ChevronRight size={16} color={Colors.dark.primary} />
            </View>
          </View>
        </TouchableOpacity>
  );
};

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
  section: {
    marginTop: Layout.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
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
    flexShrink: 1,
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
    paddingVertical: Layout.spacing.xs,
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
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsCategory: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    marginRight: Layout.spacing.sm,
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
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: {
    marginRight: 4,
    opacity: 0.6,
  },
  viewsText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    width: 300,
    alignItems: 'flex-start',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
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
    marginBottom: Layout.spacing.md,
    lineHeight: fontSizes.sm * 1.4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.xs,
  },
  progressBar: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
  },
});