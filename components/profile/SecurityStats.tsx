import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { ShieldCheck, Book, Target, Award } from 'lucide-react-native';
import { useSecurityScore } from '@/hooks/useSecurityScore';

export default function SecurityStats() {
  const { details, loading } = useSecurityScore();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load security stats</Text>
      </View>
    );
  }

  // Determine status and color based on score
  let status = 'Critical';
  let statusColor = Colors.dark.error;
  const score = details.overall;
  
  if (score >= 80) {
    status = 'Excellent';
    statusColor = Colors.dark.success;
  } else if (score >= 60) {
    status = 'Good';
    statusColor = Colors.dark.primary;
  } else if (score >= 40) {
    status = 'Fair';
    statusColor = Colors.dark.warning;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ShieldCheck color={statusColor} size={24} />
          <Text style={styles.title}>Security Level</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: statusColor }]}>{score}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Book color={Colors.dark.primary} size={20} />
            <Text style={styles.statTitle}>Course Progress</Text>
            <Text style={[styles.statValue, { color: Colors.dark.primary }]}>
              {details.metrics.coursesProgress}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${details.metrics.coursesProgress}%`,
                  backgroundColor: Colors.dark.primary 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Target color={Colors.dark.accent} size={20} />
            <Text style={styles.statTitle}>Quiz Results</Text>
            <Text style={[styles.statValue, { color: Colors.dark.accent }]}>
              {details.metrics.quizResults}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${details.metrics.quizResults}%`,
                  backgroundColor: Colors.dark.accent 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Award color={Colors.dark.success} size={20} />
            <Text style={styles.statTitle}>Practical Tasks</Text>
            <Text style={[styles.statValue, { color: Colors.dark.success }]}>
              {details.metrics.practicalTasks}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${details.metrics.practicalTasks}%`,
                  backgroundColor: Colors.dark.success 
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
  },
  status: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
  },
  statsContainer: {
    gap: Layout.spacing.lg,
  },
  statItem: {
    gap: Layout.spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  statTitle: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  statValue: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
    textAlign: 'center',
  },
}); 