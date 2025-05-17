import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Platform
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
import NewsDetailModal from '@/app/components/news/NewsDetailModal';
import Animated, { 
  FadeIn,
  FadeOut,
  Layout as LayoutAnimation
} from 'react-native-reanimated';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  views?: number;
  readTime?: string;
  author?: string;
  source?: string;
}

interface Category {
  id: string;
  label: string;
  icon: any; // LucideIcon type
  color: string;
  description: string;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const categories: Category[] = [
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

const CategoryButton = React.memo(({ 
  item, 
  isActive, 
  onPress 
}: { 
  item: Category;
  isActive: boolean;
  onPress: () => void;
}) => {
  const Icon = item.icon;
  
  return (
    <TouchableOpacity 
      style={[
        styles.categoryButton,
        isActive && [
          styles.activeCategoryButton,
          { borderColor: item.color }
        ]
      ]}
      onPress={onPress}
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
});

export default function NewsScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  const categoryMap: Record<string, string> = {
    'threats': 'active threats',
    'tips': 'security tips',
    'education': 'education',
    'industry': 'industry news',
    'updates': 'tech updates'
  };
  
  const filteredNews = useMemo(() => 
    mockNewsArticles.filter(article => {
      if (activeCategory === 'all') return true;
      return article.category.toLowerCase() === categoryMap[activeCategory];
    }),
    [activeCategory]
  );

  const handleArticlePress = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const renderNewsCard = useCallback(({ item }: { item: NewsArticle }) => (
    <Animated.View
      entering={FadeIn.duration(300)}
      layout={LayoutAnimation}
    >
      <NewsCard 
        article={item} 
        onPress={() => handleArticlePress(item)}
      />
    </Animated.View>
  ), [handleArticlePress]);

  const renderCategoryButton = useCallback(({ item }: { item: Category }) => (
    <CategoryButton
      item={item}
      isActive={activeCategory === item.id}
      onPress={() => setActiveCategory(item.id)}
    />
  ), [activeCategory]);

  const keyExtractor = useCallback((item: NewsArticle) => item.id, []);
  const categoryKeyExtractor = useCallback((item: Category) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cybersecurity News</Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        <AnimatedFlatList<Category>
          horizontal
          data={categories}
          keyExtractor={categoryKeyExtractor}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          renderItem={renderCategoryButton}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
        />
      </View>
      
      <AnimatedFlatList<NewsArticle>
        data={filteredNews}
        keyExtractor={keyExtractor}
        renderItem={renderNewsCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.newsList}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />

      {selectedArticle && (
        <NewsDetailModal
          visible={true}
          onClose={() => setSelectedArticle(null)}
          article={selectedArticle}
        />
      )}
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