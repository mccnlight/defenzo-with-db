import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { TrendingUp } from 'lucide-react-native';

const trendingTopics = [
  { id: 't1', name: 'Phishing', count: 32 },
  { id: 't2', name: 'Ransomware', count: 28 },
  { id: 't3', name: 'Data Breach', count: 24 },
  { id: 't4', name: 'Zero-Day', count: 18 },
  { id: 't5', name: 'IoT Security', count: 15 },
  { id: 't6', name: 'Social Engineering', count: 12 },
];

export default function TrendingTopics() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color={Colors.dark.primary} />
        <Text style={styles.title}>Trending Topics</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicsContainer}
      >
        {trendingTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicCard}>
            <Text style={styles.topicName}>{topic.name}</Text>
            <Text style={styles.topicCount}>{topic.count} articles</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.sm,
  },
  topicsContainer: {
    paddingVertical: Layout.spacing.xs,
  },
  topicCard: {
    minWidth: 140,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  topicName: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  topicCount: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
});