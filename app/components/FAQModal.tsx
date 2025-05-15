import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { ChevronDown, ChevronUp, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.questionText}>{question}</Text>
        {isExpanded ? (
          <ChevronUp size={20} color={Colors.dark.text} />
        ) : (
          <ChevronDown size={20} color={Colors.dark.text} />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <Text style={styles.answerText}>{answer}</Text>
      )}
    </View>
  );
};

interface FAQModalProps {
  visible: boolean;
  onClose: () => void;
}

const faqData: FAQItemProps[] = [
  {
    question: "What is Defenzo?",
    answer: "Defenzo is an interactive cybersecurity learning platform designed to help you master essential security concepts through hands-on exercises and real-world scenarios."
  },
  {
    question: "How do achievements work?",
    answer: "Achievements are earned by completing courses, participating in challenges, and reaching specific milestones in your learning journey. Each achievement represents mastery of different cybersecurity skills."
  },
  {
    question: "How is my progress tracked?",
    answer: "Your progress is automatically tracked as you complete lessons, quizzes, and practical exercises. The system records your advancement through courses and updates your profile accordingly."
  },
  {
    question: "Can I reset my course progress?",
    answer: "Currently, course progress cannot be reset. This ensures the integrity of your learning journey and achievements. You can always revisit completed courses to refresh your knowledge."
  },
  {
    question: "How do I report a technical issue?",
    answer: "You can report technical issues by contacting our support team through the 'Contact Support' option in the Settings menu. Please provide as much detail as possible about the issue you're experiencing."
  },
  {
    question: "Are the courses regularly updated?",
    answer: "Yes, our courses are regularly updated to reflect the latest cybersecurity trends, threats, and best practices. We continuously add new content and update existing materials."
  },
  {
    question: "What happens if I lose internet connection?",
    answer: "Some course content is available offline once downloaded. However, you'll need an internet connection to sync your progress, earn achievements, and access new content."
  }
];

export default function FAQModal({ visible, onClose }: FAQModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.faqList}
            showsVerticalScrollIndicator={false}
          >
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  faqList: {
    padding: Layout.spacing.md,
  },
  faqItem: {
    marginBottom: Layout.spacing.md,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.medium,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  questionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  answerText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    padding: Layout.spacing.md,
    paddingTop: 0,
  },
}); 