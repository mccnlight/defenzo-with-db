import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Award } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import type { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(screens)/course/[id]',
      params: { id: course.id }
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {course.image ? (
        <Image source={{ uri: course.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Award size={14} color={Colors.dark.warning} />
            <Text style={styles.levelText}>{course.level}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Clock size={14} color={Colors.dark.text} />
            <Text style={styles.duration}>{course.duration}</Text>
          </View>
        </View>

        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${course.progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{course.progress}% Complete</Text>
          </View>

          <View style={styles.tags}>
            {course.tags?.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.dark.background,
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: Layout.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.warning + '20',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.small,
  },
  levelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.warning,
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.md,
  },
  footer: {
    gap: Layout.spacing.sm,
  },
  progressContainer: {
    gap: Layout.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.round,
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
  },
  tags: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  tag: {
    backgroundColor: Colors.dark.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.small,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
  },
});