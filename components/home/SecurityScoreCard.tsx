import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { ShieldCheck, ChevronRight } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSecurityScore } from '@/hooks/useSecurityScore';
import { router } from 'expo-router';

export default function SecurityScoreCard() {
  const { details, loading } = useSecurityScore();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotation.value}deg` },
        { scale: scale.value }
      ],
    };
  });
  
  useEffect(() => {
    if (!loading && details) {
      scale.value = withSequence(
        withDelay(500, withTiming(1.05, { duration: 300 })),
        withTiming(1, { duration: 300 })
      );
      
      rotation.value = withSequence(
        withDelay(200, withTiming(-5, { duration: 200 })),
        withTiming(5, { duration: 300 }),
        withTiming(0, { duration: 200 })
      );
    }
  }, [loading, details]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load security score</Text>
        </View>
      </View>
    );
  }
  
  let status = 'Critical';
  let statusColor = Colors.dark.error;
  let description = 'Your security needs attention';
  const score = details.overall;
  
  if (score >= 80) {
    status = 'Excellent';
    statusColor = Colors.dark.success;
    description = 'Your security is strong';
  } else if (score >= 60) {
    status = 'Good';
    statusColor = Colors.dark.primary;
    description = 'Keep improving your security';
  } else if (score >= 40) {
    status = 'Fair';
    statusColor = Colors.dark.warning;
    description = 'Some improvements needed';
  }

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: statusColor }]} 
      onPress={handleProfilePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <ShieldCheck color={statusColor} size={20} />
            <Text style={styles.title}>Security Score</Text>
          </View>
          
          <View style={styles.scoreSection}>
            <Animated.View style={[styles.scoreCircle, rotationStyle, { backgroundColor: `${statusColor}20` }]}>
              <Text style={[styles.scoreText, { color: statusColor }]}>
                {score}
              </Text>
            </Animated.View>
            
            <View style={styles.scoreInfo}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {status}
              </Text>
              <Text style={styles.description}>
                {description}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <ChevronRight color={Colors.dark.text} size={20} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
  },
  scoreInfo: {
    flex: 1,
  },
  statusText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    marginBottom: Layout.spacing.xs,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
  },
});