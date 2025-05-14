import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { LockKeyhole, Clock, BookOpen } from 'lucide-react-native';

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress: number;
  isLocked?: boolean;
}

interface CourseCardProps {
  course: Course;
}

export default function RecommendedCourseCard({ course }: CourseCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        {course.isLocked ? (
          <LockKeyhole color={Colors.dark.text} size={24} />
        ) : (
          <BookOpen color={Colors.dark.text} size={24} />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.durationContainer}>
            <Clock color={Colors.dark.text} size={14} />
            <Text style={styles.duration}>{course.duration}</Text>
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
            <Text style={styles.progressText}>{course.progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.7,
    marginLeft: Layout.spacing.xs,
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.primary + '30',
  },
  categoryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.primary,
  },
  lockedBadge: {
    paddingVertical: 2,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
    marginRight: Layout.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.7,
  },
});