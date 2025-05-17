import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  color: string;
}

interface AchievementDetailModalProps {
  visible: boolean;
  onClose: () => void;
  achievement: Achievement;
}

export default function AchievementDetailModal({
  visible,
  onClose,
  achievement,
}: AchievementDetailModalProps) {
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
      <View style={styles.content}>
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
          styles.achievementIcon,
          { backgroundColor: achievement.color + '20' }
        ]}>
          <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        </View>

        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>

        <View style={styles.progressSection}>
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
          <Text style={[styles.progressText, { color: achievement.color }]}>
            {achievement.progress}% Complete
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
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
  achievementIcon: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  achievementEmoji: {
    fontSize: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontFamily: fonts.body,
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
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
}); 