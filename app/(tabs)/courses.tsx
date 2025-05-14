import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  Globe,
  Smartphone
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import CourseCard from '@/components/courses/CourseCard';
import { mockCourses } from '@/data/mockCourses';

const categories = [
  { id: 'all', name: 'All', icon: BookOpen, color: Colors.dark.primary },
  { id: 'basics', name: 'Basics', icon: ShieldCheck, color: Colors.dark.accent },
  { id: 'passwords', name: 'Passwords', icon: Lock, color: Colors.dark.warning },
  { id: 'web', name: 'Web Safety', icon: Globe, color: Colors.dark.secondary },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, color: Colors.dark.error },
];

export default function CoursesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredCourses = selectedCategory === 'all' 
    ? mockCourses 
    : mockCourses.filter(course => course.category === selectedCategory);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search color={Colors.dark.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  isSelected && { backgroundColor: category.color + '20' }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View 
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: category.color + '30' }
                  ]}
                >
                  <Icon color={category.color} size={18} />
                </View>
                <Text 
                  style={[
                    styles.categoryText,
                    isSelected && { color: category.color }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard course={item} />}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.sm,
  },
  categoryContainer: {
    marginBottom: Layout.spacing.md,
  },
  categoriesScrollContent: {
    paddingHorizontal: Layout.spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  categoryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  coursesList: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 120, // Extra padding for bottom tab bar
  },
  resultsCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.md,
  },
});