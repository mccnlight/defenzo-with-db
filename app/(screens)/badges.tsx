import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, ChevronLeft, Shield, Star, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { useRouter } from 'expo-router';

const badges = [
  {
    id: 'b1',
    title: 'Security Expert',
    description: 'Completed all security courses',
    icon: Shield,
    color: Colors.dark.primary,
    earned: true,
    date: 'Jun 15, 2024',
  },
  {
    id: 'b2',
    title: 'Course Master',
    description: 'Finished 10 courses with perfect scores',
    icon: BookOpen,
    color: Colors.dark.accent,
    earned: true,
    date: 'May 22, 2024',
  },
  {
    id: 'b3',
    title: 'Rising Star',
    description: 'Earned 1000 points',
    icon: Star,
    color: Colors.dark.warning,
    earned: true,
    date: 'May 10, 2024',
  },
  {
    id: 'b4',
    title: 'Elite Defender',
    description: 'Complete advanced security training',
    icon: Award,
    color: Colors.dark.secondary,
    earned: false,
  },
];

export default function BadgesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color={Colors.dark.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Badges & Certificates</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>75%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Badges</Text>
        
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <View 
                style={[
                  styles.badgeIconContainer,
                  { backgroundColor: badge.color + '20' }
                ]}
              >
                <badge.icon color={badge.color} size={32} />
              </View>
              
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
              
              {badge.earned ? (
                <View style={styles.earnedContainer}>
                  <Award color={Colors.dark.warning} size={14} />
                  <Text style={styles.earnedText}>Earned {badge.date}</Text>
                </View>
              ) : (
                <View style={styles.lockedContainer}>
                  <Text style={styles.lockedText}>In Progress</Text>
                </View>
              )}
            </View>
          ))}
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
    paddingHorizontal: Layout.spacing.md,
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
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  content: {
    padding: Layout.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  badgeTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  badgeDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.sm,
  },
  earnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnedText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.warning,
    marginLeft: Layout.spacing.xs,
  },
  lockedContainer: {
    backgroundColor: Colors.dark.text + '20',
    paddingVertical: 4,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    alignSelf: 'flex-start',
  },
  lockedText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.7,
  },
}); 