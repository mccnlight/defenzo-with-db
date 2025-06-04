import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { UserBadge } from '@/app/store/badgeStore';

interface BadgeCardProps {
  badge: UserBadge;
  onPress: () => void;
}

export default function BadgeCard({ badge, onPress }: BadgeCardProps) {
  // Determine badge progress text color based on completion status
  const progressTextColor = badge.completed ? Colors.dark.success : Colors.dark.primary;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: Colors.dark.primary + '20' }
      ]}>
        <Text style={[styles.icon, { color: Colors.dark.text }]}>{badge.badge.icon}</Text>
      </View>
      
      <View style={[styles.textContainer]}>
        <Text style={[styles.title, fonts.bold, { color: Colors.dark.text }]} numberOfLines={1}>
          {badge.badge.name}
        </Text>
        
        <Text style={[styles.description, fonts.regular, { color: Colors.dark.text }]} numberOfLines={2}>
          {badge.badge.description}
        </Text>
      </View>
      
      <View style={[styles.progressContainer]}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(100, badge.progress)}%`,
                backgroundColor: badge.completed ? Colors.dark.success : Colors.dark.primary
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, fonts.medium, { color: progressTextColor }]}>
          {badge.completed ? 'Completed' : `${badge.progress}%`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    minHeight: 180, 
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: fontSizes.sm,
    marginBottom: Layout.spacing.xs,
  },
  description: {
    fontSize: fontSizes.xs,
    marginBottom: Layout.spacing.sm,
    lineHeight: fontSizes.xs * 1.4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontSize: fontSizes.xs,
    minWidth: 48,
    textAlign: 'right',
  },
}); 