import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { globalAchievements } from '@/app/(tabs)';

export default function BadgesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Badges & Certificates</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          <Text style={styles.sectionDescription}>
            Track your progress and unlock new achievements as you learn
          </Text>
          
          <View style={styles.achievementsGrid}>
            {globalAchievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
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
              </View>
            ))}
          </View>
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
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    padding: Layout.spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
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