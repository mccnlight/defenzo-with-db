import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { ThumbsUp, MessageCircle, Share2, Bookmark } from 'lucide-react-native';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        
        <Text style={styles.summary}>{article.summary}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.date}>{article.date}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.readTime}>{article.readTime} read</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <ThumbsUp size={16} color={Colors.dark.text} />
              <Text style={styles.actionText}>{article.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={16} color={Colors.dark.text} />
              <Text style={styles.actionText}>{article.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={16} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.bookmarkButton}>
            <Bookmark size={16} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
    marginBottom: Layout.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    left: Layout.spacing.md,
    paddingVertical: 4,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  categoryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
  },
  content: {
    padding: Layout.spacing.md,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  dot: {
    marginHorizontal: Layout.spacing.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  readTime: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  actionText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginLeft: Layout.spacing.xs,
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});