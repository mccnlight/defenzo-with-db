import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import BottomSheet from '../common/BottomSheet';
import { UserBadge } from '@/app/store/badgeStore';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface BadgeDetailModalProps {
  visible: boolean;
  onClose: () => void;
  badge: UserBadge;
}

export default function BadgeDetailModal({
  visible,
  onClose,
  badge,
}: BadgeDetailModalProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <AnimatedTouchableOpacity 
            style={[styles.closeButton, buttonStyle]}
            onPress={onClose}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <X size={24} color={Colors.dark.text} />
          </AnimatedTouchableOpacity>
        </View>

        <View style={[
          styles.badgeIcon,
          { backgroundColor: Colors.dark.primary + '20' }
        ]}>
          <Text style={styles.badgeEmoji}>{badge.badge.icon}</Text>
        </View>

        <Text style={styles.title}>{badge.badge.name}</Text>
        <Text style={styles.description}>{badge.badge.description}</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${badge.progress}%`,
                  backgroundColor: badge.completed ? Colors.dark.success : Colors.dark.primary
                }
              ]} 
            />
          </View>
          <Text style={[
            styles.progressText,
            { color: badge.completed ? Colors.dark.success : Colors.dark.primary }
          ]}>
            {badge.completed ? 'Completed' : `${badge.progress}% Complete`}
          </Text>
        </View>

        {badge.completed && (
          <View style={styles.completionInfo}>
            <Text style={styles.completionLabel}>Awarded on</Text>
            <Text style={styles.completionDate}>
              {new Date(badge.awarded_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: Layout.spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  badgeEmoji: {
    fontSize: 40,
  },
  title: {
    ...fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  description: {
    ...fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    lineHeight: fontSizes.md * 1.6,
  },
  progressSection: {
    width: '100%',
    gap: Layout.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.border,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    ...fonts.bodyMedium,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
  completionInfo: {
    marginTop: Layout.spacing.xl,
    alignItems: 'center',
  },
  completionLabel: {
    ...fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  completionDate: {
    ...fonts.bold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
}); 