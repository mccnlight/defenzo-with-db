import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, Users, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import type { Course } from '@/types/course';

interface RecommendedCourseCardProps {
  course: Course;
}

export default function RecommendedCourseCard({ course }: RecommendedCourseCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <BookOpen color={Colors.dark.primary} size={24} />
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {course.title}
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Star size={16} color={Colors.dark.warning} />
          <Text style={styles.statText}>
            {course.rating.toFixed(1)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Users size={16} color={Colors.dark.text} />
          <Text style={styles.statText}>
            {(course.learners / 1000).toFixed(1)}k
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
    height: 44, // Фиксированная высота для двух строк
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  statText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
});