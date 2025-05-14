import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Clock, Users, Star, BookOpen, Lock } from 'lucide-react-native';

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  learners: number;
  rating: number;
  progress: number;
  isLocked?: boolean;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {course.isLocked ? (
            <Lock color={Colors.dark.text} size={24} />
          ) : (
            <BookOpen color={Colors.dark.text} size={24} />
          )}
        </View>
        
        {course.isLocked ? (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>Locked</Text>
          </View>
        ) : (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{course.category}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title}>{course.title}</Text>
      
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Clock color={Colors.dark.text} size={14} style={styles.metaIcon} />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <Users color={Colors.dark.text} size={14} style={styles.metaIcon} />
          <Text style={styles.metaText}>{course.learners.toLocaleString()}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <Star color={Colors.dark.warning} size={14} style={styles.metaIcon} />
          <Text style={styles.metaText}>{course.rating.toFixed(1)}</Text>
        </View>
      </View>
      
      {!course.isLocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${course.progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {course.progress === 0 ? 'Start Course' : `${course.progress}% Complete`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.primary + '20',
  },
  categoryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.primary,
  },
  lockedBadge: {
    paddingVertical: 4,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.text + '20',
  },
  lockedText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  metaIcon: {
    marginRight: 4,
    opacity: 0.7,
  },
  metaText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: Layout.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
  },
});