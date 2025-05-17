import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { 
  Eye, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  BookOpen,
  Target,
  Settings
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  views?: number; // Optional view count
}

interface NewsCardProps {
  article: NewsArticle;
  compact?: boolean; // For home page smaller version
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function NewsCard({ article, compact = false, onPress }: NewsCardProps) {
  const scale = useSharedValue(1);
  
  const getCategoryInfo = useMemo(() => (category: string) => {
    switch (category.toLowerCase()) {
      case 'active threats':
        return {
          icon: <AlertTriangle size={16} color="#FF6B6B" />,
          color: '#FF6B6B'
        };
      case 'security tips':
        return {
          icon: <Shield size={16} color="#4ECB71" />,
          color: '#4ECB71'
        };
      case 'education':
        return {
          icon: <BookOpen size={16} color="#4DABF7" />,
          color: '#4DABF7'
        };
      case 'industry news':
        return {
          icon: <Target size={16} color="#9775FA" />,
          color: '#9775FA'
        };
      case 'tech updates':
        return {
          icon: <Settings size={16} color="#FFB057" />,
          color: '#FFB057'
        };
      default:
        return {
          icon: <TrendingUp size={16} color={Colors.dark.primary} />,
          color: Colors.dark.primary
        };
    }
  }, []);

  const categoryInfo = useMemo(() => getCategoryInfo(article.category), [article.category, getCategoryInfo]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable 
      style={[
        styles.container,
        compact && styles.compactContainer,
        animatedStyle
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.header}>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: categoryInfo.color + '20' }
        ]}>
          {categoryInfo.icon}
          <Text style={[
            styles.categoryText,
            { color: categoryInfo.color }
          ]}>
            {article.category}
          </Text>
        </View>
        <Text style={styles.date}>{article.date}</Text>
      </View>
      
      <Text 
        style={[
          styles.title,
          compact && styles.compactTitle
        ]}
        numberOfLines={compact ? 2 : 3}
      >
        {article.title}
      </Text>

      {!compact && (
        <Text style={styles.summary} numberOfLines={2}>
          {article.summary}
        </Text>
      )}
        
      <View style={styles.footer}>
        {article.views !== undefined && (
          <View style={styles.viewsContainer}>
            <Eye size={16} color={Colors.dark.text} style={styles.viewIcon} />
            <Text style={styles.viewsText}>
              {article.views.toLocaleString()} views
            </Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  compactContainer: {
    padding: Layout.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
  },
  categoryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    marginLeft: Layout.spacing.xs,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
    lineHeight: fontSizes.md * 1.4,
  },
  compactTitle: {
    fontSize: fontSizes.sm,
    marginBottom: Layout.spacing.xs,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.md,
    lineHeight: fontSizes.sm * 1.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: {
    marginRight: Layout.spacing.xs,
    opacity: 0.6,
  },
  viewsText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
});

export default React.memo(NewsCard);