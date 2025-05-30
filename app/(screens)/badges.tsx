import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { globalAchievements } from '@/app/(tabs)';
import AchievementDetailModal from '@/app/components/badges/AchievementDetailModal';
import { X } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Achievement categories
const achievementCategories = [
  {
    id: 'course',
    title: 'Course Completion',
    description: 'Achievements earned by completing courses',
    achievements: globalAchievements.filter(a => 
      a.title.includes('Learner') || 
      a.description.includes('course') || 
      a.description.includes('Complete')
    )
  },
  {
    id: 'skills',
    title: 'Skills Mastery',
    description: 'Achievements earned through practical skills and assessments',
    achievements: globalAchievements.filter(a => 
      a.title.includes('Master') || 
      a.title.includes('Expert') ||
      a.description.includes('master') ||
      a.description.includes('skills')
    )
  },
  {
    id: 'special',
    title: 'Special Achievements',
    description: 'Special recognition and milestone achievements',
    achievements: globalAchievements.filter(a => 
      !a.title.includes('Learner') && 
      !a.description.includes('course') && 
      !a.description.includes('Complete') &&
      !a.title.includes('Master') && 
      !a.title.includes('Expert') &&
      !a.description.includes('master') &&
      !a.description.includes('skills')
    )
  }
];

export default function BadgesScreen() {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const renderAchievement = (achievement: any) => {
    const nextProgress = Math.min(100, Math.ceil(achievement.progress / 20) * 20);
    
    return (
      <AnimatedTouchableOpacity 
        key={achievement.id} 
        style={styles.achievementCard}
        onPress={() => setSelectedAchievement(achievement)}
        entering={FadeIn.duration(300).delay(achievement.id.length * 100)}
      >
        <View style={[
          styles.achievementIcon,
          { backgroundColor: achievement.color + '20' }
        ]}>
          <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        </View>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${achievement.progress}%`,
                    backgroundColor: achievement.color
                  }
                ]} 
              />
            </View>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: achievement.color }]}>
                {achievement.progress}% Complete
              </Text>
              {achievement.progress < 100 && (
                <Text style={styles.nextMilestone}>
                  Next milestone: {nextProgress}%
                </Text>
              )}
            </View>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Badges & Certificates</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerDescription}>
          Track your achievements and progress in cybersecurity learning
        </Text>

        {achievementCategories.map(category => (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <Text style={styles.sectionDescription}>
              {category.description}
            </Text>
            <View style={styles.achievementsGrid}>
              {category.achievements.map(renderAchievement)}
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedAchievement && (
        <AchievementDetailModal
          visible={true}
          onClose={() => setSelectedAchievement(null)}
          achievement={selectedAchievement}
        />
      )}
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
    padding: Layout.spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  section: {
    padding: Layout.spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  sectionDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.lg,
  },
  achievementsGrid: {
    gap: Layout.spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
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
    gap: Layout.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
  },
  nextMilestone: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
}); 