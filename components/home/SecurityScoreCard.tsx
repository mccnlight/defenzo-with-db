import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

interface SecurityScoreCardProps {
  score: number;
}

export default function SecurityScoreCard({ score }: SecurityScoreCardProps) {
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
    // Pulse animation
    scale.value = withSequence(
      withDelay(
        500,
        withTiming(1.05, { duration: 300 })
      ),
      withTiming(1, { duration: 300 })
    );
    
    // Subtle rotation to catch attention
    rotation.value = withSequence(
      withDelay(
        200,
        withTiming(-5, { duration: 200 })
      ),
      withTiming(5, { duration: 300 }),
      withTiming(0, { duration: 200 })
    );
  }, []);
  
  // Determine status and color based on score
  let status = 'Critical';
  let statusColor = Colors.dark.error;
  
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
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>Your Security Score</Text>
        
        <View style={styles.scoreContainer}>
          <Animated.View style={[styles.scoreCircle, rotationStyle]}>
            <ShieldCheck color={statusColor} size={24} />
            <Text style={[styles.scoreText, { color: statusColor }]}>
              {score}
            </Text>
          </Animated.View>
          
          <View style={styles.scoreInfo}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {status}
            </Text>
            <Text style={styles.description}>
              {score < 80 ? 'Some improvements needed' : 'Your security is strong'}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsText}>Details</Text>
        <ChevronRight color={Colors.dark.text} size={16} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.md,
  },
  leftContent: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  scoreText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    marginTop: Layout.spacing.xs,
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
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
  },
  detailsText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    marginRight: Layout.spacing.xs,
  },
});