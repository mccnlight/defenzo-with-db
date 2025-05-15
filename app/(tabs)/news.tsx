import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  TrendingUp,
  Shield,
  AlertTriangle,
  BookOpen,
  Target,
  Settings
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { mockNewsArticles } from '@/data/mockNews';
import NewsCard from '@/components/news/NewsCard';

const categories = [
  { 
    id: 'all', 
    label: 'All News', 
    icon: TrendingUp, 
    color: Colors.dark.primary,
    description: 'All cybersecurity news and updates'
  },
  { 
    id: 'threats', 
    label: 'Active Threats', 
    icon: AlertTriangle, 
    color: '#FF6B6B', // Soft red
    description: 'Current threats, attacks, and vulnerabilities'
  },
  { 
    id: 'tips', 
    label: 'Security Tips', 
    icon: Shield, 
    color: '#4ECB71', // Soft green
    description: 'Best practices and security recommendations'
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: BookOpen, 
    color: '#4DABF7', // Soft blue
    description: 'Learning materials and tutorials'
  },
  { 
    id: 'industry', 
    label: 'Industry News', 
    icon: Target, 
    color: '#9775FA', // Soft purple
    description: 'Market trends and company updates'
  },
  { 
    id: 'updates', 
    label: 'Tech Updates', 
    icon: Settings, 
    color: '#FFB057', // Soft orange
    description: 'Software updates and patch releases'
  }
];

export default function NewsScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categoryMap: Record<string, string> = {
    'threats': 'active threats',
    'tips': 'security tips',
    'education': 'education',
    'industry': 'industry news',
    'updates': 'tech updates'
  };
  
  const filteredNews = mockNewsArticles.filter(article => {
    if (activeCategory === 'all') return true;
    return article.category.toLowerCase() === categoryMap[activeCategory];
  });
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cybersecurity News</Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
            <TouchableOpacity 
              style={[
                  styles.categoryButton,
                  isActive && [
                    styles.activeCategoryButton,
                    { borderColor: item.color }
                  ]
              ]}
                onPress={() => setActiveCategory(item.id)}
            >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: isActive ? item.color + '20' : 'transparent' }
                ]}>
                  <Icon 
                    size={20} 
                    color={isActive ? item.color : Colors.dark.text} 
                  />
                </View>
              <Text style={[
                  styles.categoryLabel,
                  isActive && { color: item.color }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
            );
          }}
        />
      </View>
      
      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsCard article={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.newsList}
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
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
  },
  categoriesContainer: {
    marginBottom: Layout.spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: Layout.spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    marginRight: Layout.spacing.sm,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCategoryButton: {
    backgroundColor: Colors.dark.card + '80',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.xs,
  },
  categoryLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  newsList: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 120,
  },
});