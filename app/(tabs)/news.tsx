import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Settings, 
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Share2
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { mockNewsArticles } from '@/data/mockNews';
import NewsCard from '@/components/news/NewsCard';
import TrendingTopics from '@/components/news/TrendingTopics';

export default function NewsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'All News' },
    { id: 'trends', label: 'Trends' },
    { id: 'tips', label: 'Security Tips' },
    { id: 'threats', label: 'Threats' },
  ];
  
  const filteredNews = activeTab === 'all' 
    ? mockNewsArticles 
    : mockNewsArticles.filter(article => article.category === activeTab);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cybersecurity News</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell color={Colors.dark.text} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Settings color={Colors.dark.text} size={22} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.tabButton,
                activeTab === item.id && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(item.id)}
            >
              <Text style={[
                styles.tabLabel,
                activeTab === item.id && styles.activeTabLabel
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
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
        ListHeaderComponent={
          activeTab === 'all' && (
            <>
              <TrendingTopics />
              <Text style={styles.sectionTitle}>Latest News</Text>
            </>
          )
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
    width: 42,
    height: 42,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.sm,
  },
  tabContainer: {
    marginBottom: Layout.spacing.md,
  },
  tabsContent: {
    paddingHorizontal: Layout.spacing.md,
  },
  tabButton: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    marginRight: Layout.spacing.sm,
    backgroundColor: Colors.dark.card,
  },
  activeTabButton: {
    backgroundColor: Colors.dark.primary,
  },
  tabLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  newsList: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 120, // Extra padding for bottom tab bar
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginVertical: Layout.spacing.md,
  },
});