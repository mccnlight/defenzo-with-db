import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { X } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useBadgeStore, UserBadge } from '@/app/store/badgeStore';
import BadgeCard from '@/app/components/badges/BadgeCard';
import BadgeDetailModal from '@/app/components/badges/BadgeDetailModal';

// Badge categories
const badgeCategories = [
  {
    id: 'course_completion',
    title: 'Course Completion',
    description: 'Badges earned by completing courses',
  },
  {
    id: 'tool_usage',
    title: 'Security Tools',
    description: 'Badges earned by using security tools',
  },
  {
    id: 'learning_progress',
    title: 'Learning Progress',
    description: 'Badges earned through your learning journey',
  },
  {
    id: 'quiz_performance',
    title: 'Quiz Performance',
    description: 'Badges earned by performing well in quizzes',
  }
];

export default function BadgesScreen() {
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null);
  const { badges, loading, error, fetchBadges } = useBadgeStore();

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const renderBadge = useCallback(({ item, index }: { item: UserBadge, index: number }) => (
    <Animated.View
      key={item.id}
      entering={FadeIn.delay(index * 100)}
      style={styles.badgeGridItem}
    >
      <BadgeCard
        badge={item}
        onPress={() => setSelectedBadge(item)}
      />
    </Animated.View>
  ), []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading badges...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              fetchBadges();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (badges.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No badges yet</Text>
          <Text style={styles.emptySubtext}>
            Complete courses, use security tools, and take quizzes to earn badges!
          </Text>
        </View>
      );
    }

    // Group badges by category
    const categorizedBadges: { [key: string]: UserBadge[] } = {};
    badges.forEach(badge => {
      if (!categorizedBadges[badge.badge.category]) {
        categorizedBadges[badge.badge.category] = [];
      }
      categorizedBadges[badge.badge.category].push(badge);
    });

    return (
      <>
        <Text style={styles.headerDescription}>
          Track your achievements and progress in cybersecurity learning
        </Text>

        {badgeCategories.map(category => {
          const categoryBadges = categorizedBadges[category.id] || [];
          if (categoryBadges.length === 0) return null;

          return (
            <View key={category.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{category.title}</Text>
              <Text style={styles.sectionDescription}>
                {category.description}
              </Text>
              <View style={styles.badgesGridContainer}>
                <FlatList
                  data={categoryBadges}
                  renderItem={renderBadge}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.badgeRow}
                  contentContainerStyle={styles.badgesListContent}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: Layout.spacing.sm }} />}
                />
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Badges & Achievements</Text>
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
        {renderContent()}
      </ScrollView>

      {selectedBadge && (
        <BadgeDetailModal
          visible={true}
          onClose={() => setSelectedBadge(null)}
          badge={selectedBadge}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.padding,
    paddingVertical: Layout.padding / 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTitle: {
    ...fonts.bold,
    fontSize: fontSizes.large,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.sm,
  },
  scrollContent: {
    paddingVertical: Layout.padding,
  },
  headerDescription: {
    ...fonts.regular,
    fontSize: fontSizes.medium,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.padding,
  },
  section: {
    marginBottom: Layout.spacing.xxl,
  },
  sectionTitle: {
    ...fonts.bold,
    fontSize: fontSizes.medium,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
    paddingHorizontal: Layout.padding,
  },
  sectionDescription: {
    ...fonts.regular,
    fontSize: fontSizes.small,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.padding,
  },
  badgesGridContainer: {
  },
  badgesListContent: {
    paddingHorizontal: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
  },
  badgeRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeGridItem: {
    width: '48%',
    marginHorizontal: '1%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.padding * 2,
  },
  loadingText: {
    ...fonts.regular,
    fontSize: fontSizes.medium,
    color: Colors.dark.textSecondary,
    marginTop: Layout.padding,
  },
  errorText: {
    ...fonts.regular,
    fontSize: fontSizes.medium,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Layout.padding,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.padding,
    paddingVertical: Layout.padding / 2,
    borderRadius: 8,
  },
  retryButtonText: {
    ...fonts.medium,
    fontSize: fontSizes.small,
    color: Colors.light.text,
  },
  emptyText: {
    ...fonts.bold,
    fontSize: fontSizes.large,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtext: {
    ...fonts.regular,
    fontSize: fontSizes.medium,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Layout.padding,
  },
}); 