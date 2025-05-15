import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ViewStyle
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Question } from '@/types/course';

interface CardsLessonProps {
  questions: Question[];
  onComplete: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

export default function CardsLesson({ questions, onComplete }: CardsLessonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-120deg', '0deg', '120deg']
  });

  const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue(gesture.dx);
      },
    onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: x,
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = questions[currentIndex];
    const isCorrect = direction === 'right';

    if (isCorrect && currentIndex === questions.length - 1) {
      onComplete();
    } else {
      position.setValue(0);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true
    }).start();
  };

  const getCardStyle = (): Animated.WithAnimatedObject<ViewStyle> => {
    return {
      transform: [
        {
          translateX: position
        },
        {
          rotate: rotation
        }
      ],
      position: 'absolute',
      width: SCREEN_WIDTH - 40,
      height: '100%',
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.large,
      backgroundColor: Colors.dark.card,
      justifyContent: 'center',
      alignItems: 'center',
      backfaceVisibility: 'hidden'
    };
  };

  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.completedText}>No more cards!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={getCardStyle()}
          {...panResponder.panHandlers}
        >
          <Text style={styles.questionText}>
            {questions[currentIndex].text}
            </Text>
          <View style={styles.swipeHints}>
            <View style={styles.swipeHint}>
              <X size={24} color={Colors.dark.error} />
              <Text style={[styles.hintText, styles.falseText]}>False</Text>
            </View>
            <View style={styles.swipeHint}>
              <Check size={24} color={Colors.dark.success} />
              <Text style={[styles.hintText, styles.trueText]}>True</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.lg,
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
  },
  questionText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Layout.spacing.xl,
  },
  swipeHint: {
    alignItems: 'center',
  },
  hintText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginTop: Layout.spacing.xs,
  },
  falseText: {
    color: Colors.dark.error,
  },
  trueText: {
    color: Colors.dark.success,
  },
  completedText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
  },
}); 