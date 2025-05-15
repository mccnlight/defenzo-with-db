import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  Globe,
  Smartphone,
  X
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import CourseCard from '@/components/courses/CourseCard';
import { mockCourses } from '@/app/data/mockCourses';
import type { Course } from '@/app/data/mockCourses';

const categories = [
  { id: 'all', name: 'All', icon: BookOpen, color: Colors.dark.primary },
  { id: 'basics', name: 'Basics', icon: ShieldCheck, color: Colors.dark.accent },
  { id: 'passwords', name: 'Passwords', icon: Lock, color: Colors.dark.warning },
  { id: 'web', name: 'Web Safety', icon: Globe, color: Colors.dark.secondary },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, color: Colors.dark.error },
];

interface FilterOptions {
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: 'short' | 'medium' | 'long';
}

export default function CoursesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  
  const filterCourses = useCallback((courses: Course[]) => {
    return courses.filter(course => {
      // Category filter
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }
      
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDescription = course.description.toLowerCase().includes(query);
        const matchesTags = course.tags.some((tag: string) => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }
      
      // Level filter
      if (filterOptions.level && course.level !== filterOptions.level) {
        return false;
      }
      
      // Duration filter
      if (filterOptions.duration) {
        const duration = parseInt(course.duration);
        switch (filterOptions.duration) {
          case 'short':
            if (duration > 30) return false;
            break;
          case 'medium':
            if (duration <= 30 || duration > 120) return false;
            break;
          case 'long':
            if (duration <= 120) return false;
            break;
        }
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery, filterOptions]);

  const filteredCourses = filterCourses(mockCourses);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search color={Colors.dark.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color={Colors.dark.text} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor={Colors.dark.text + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <X color={Colors.dark.text} size={16} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
      
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />

      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Courses</Text>
              <TouchableOpacity 
                onPress={() => setShowFilters(false)}
                style={styles.closeButton}
              >
                <X color={Colors.dark.text} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Level</Text>
              <View style={styles.filterOptions}>
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.filterOption,
                      filterOptions.level === level && styles.filterOptionSelected
                    ]}
                    onPress={() => setFilterOptions(prev => ({
                      ...prev,
                      level: prev.level === level ? undefined : level as any
                    }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filterOptions.level === level && styles.filterOptionTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Duration</Text>
              <View style={styles.filterOptions}>
                {[
                  { id: 'short', label: '< 30 min' },
                  { id: 'medium', label: '30-120 min' },
                  { id: 'long', label: '> 120 min' }
                ].map((duration) => (
                  <TouchableOpacity
                    key={duration.id}
                    style={[
                      styles.filterOption,
                      filterOptions.duration === duration.id && styles.filterOptionSelected
                    ]}
                    onPress={() => setFilterOptions(prev => ({
                      ...prev,
                      duration: prev.duration === duration.id ? undefined : duration.id as any
                    }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filterOptions.duration === duration.id && styles.filterOptionTextSelected
                    ]}>
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setFilterOptions({})}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    paddingHorizontal: Layout.spacing.md,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: Colors.dark.text,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
  },
  clearButton: {
    padding: Layout.spacing.xs,
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
    paddingBottom: 120,
  },
  resultsCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  emptyText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  emptySubtext: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderTopLeftRadius: Layout.borderRadius.large,
    borderTopRightRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  filterSection: {
    marginBottom: Layout.spacing.lg,
  },
  filterTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  filterOption: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.dark.background,
  },
  filterOptionSelected: {
    backgroundColor: Colors.dark.primary,
  },
  filterOptionText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  filterOptionTextSelected: {
    fontFamily: fonts.bodyMedium,
    color: Colors.dark.text,
  },
  resetButton: {
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    backgroundColor: Colors.dark.error + '20',
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.error,
  },
});