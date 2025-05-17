import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import { 
  X, 
  Eye, 
  Share2,
  AlertTriangle, 
  Shield, 
  TrendingUp,
  BookOpen,
  Target,
  Settings,
  Calendar,
  Clock
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import BottomSheet from '../common/BottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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

interface NewsDetailModalProps {
  visible: boolean;
  onClose: () => void;
  article: NewsArticle;
}

const getCategoryInfo = (category: string) => {
  switch (category.toLowerCase()) {
    case 'security alert':
      return {
        icon: <AlertTriangle size={16} color="#FF4B4B" />,
        color: '#FF4B4B'
      };
    case 'protection':
      return {
        icon: <Shield size={16} color="#00C48C" />,
        color: '#00C48C'
      };
    case 'trends':
      return {
        icon: <TrendingUp size={16} color="#7F5AF0" />,
        color: '#7F5AF0'
      };
    case 'education':
      return {
        icon: <BookOpen size={16} color="#00B4D8" />,
        color: '#00B4D8'
      };
    case 'updates':
      return {
        icon: <Target size={16} color="#FF8500" />,
        color: '#FF8500'
      };
    default:
      return {
        icon: <Settings size={16} color="#94A1B2" />,
        color: '#94A1B2'
      };
  }
};

export default function NewsDetailModal({ 
  visible, 
  onClose, 
  article 
}: NewsDetailModalProps) {
  const scale = useSharedValue(1);
  const categoryInfo = getCategoryInfo(article.category);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary}\n\nRead more on Defenzo App`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  }, [article]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <BottomSheet 
      visible={visible} 
      onClose={onClose}
      height={SCREEN_HEIGHT * 0.9}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
          </View>

          <View style={styles.headerRight}>
            <AnimatedTouchableOpacity 
              style={[styles.iconButton, buttonStyle]}
              onPress={handleShare}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Share2 size={24} color={Colors.dark.text} />
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity 
              style={[styles.iconButton, buttonStyle]}
              onPress={onClose}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <X size={24} color={Colors.dark.text} />
            </AnimatedTouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaInfo}>
            {article.author && (
              <Text style={styles.metaText}>By {article.author}</Text>
            )}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Calendar size={16} color={Colors.dark.text} style={styles.metaIcon} />
                <Text style={styles.metaText}>{article.date}</Text>
              </View>
              {article.readTime && (
                <View style={styles.metaItem}>
                  <Clock size={16} color={Colors.dark.text} style={styles.metaIcon} />
                  <Text style={styles.metaText}>{article.readTime} read</Text>
                </View>
              )}
              {article.views !== undefined && (
                <View style={styles.metaItem}>
                  <Eye size={16} color={Colors.dark.text} style={styles.metaIcon} />
                  <Text style={styles.metaText}>
                    {article.views.toLocaleString()} views
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.summary}>{article.summary}</Text>
          <Text style={styles.articleContent}>{article.content}</Text>

          {article.source && (
            <Text style={styles.source}>Source: {article.source}</Text>
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Layout.spacing.lg,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
  },
  categoryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    marginLeft: Layout.spacing.xs,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.lg,
    lineHeight: fontSizes.xl * 1.4,
  },
  metaInfo: {
    marginBottom: Layout.spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: Layout.spacing.xs,
  },
  metaText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  summary: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.lg,
    lineHeight: fontSizes.md * 1.6,
  },
  articleContent: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.9,
    lineHeight: fontSizes.md * 1.6,
    marginBottom: Layout.spacing.xl,
  },
  source: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
}); 