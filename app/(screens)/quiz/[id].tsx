import { useBadgeStore } from '@/app/store/badgeStore';

export default function QuizScreen() {
  const { checkAndAwardBadges } = useBadgeStore();

  const handleQuizComplete = async (score: number) => {
    try {
      // Existing quiz completion logic
      await submitQuizScore(quizId, score);
      
      // Award badges based on quiz performance
      await checkAndAwardBadges('quiz_completion', {
        score: score
      });
    } catch (error) {
      console.error('Failed to complete quiz:', error);
    }
  };
} 