import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.15;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const TIMING_CONFIG = {
  duration: 250,
};

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: number;
  children: React.ReactNode;
}

export default function BottomSheet({
  visible,
  onClose,
  height = SCREEN_HEIGHT * 0.5,
  children,
}: BottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);
  const isActive = useSharedValue(false);

  React.useEffect(() => {
    if (visible) {
      isActive.value = true;
      opacity.value = withTiming(1, TIMING_CONFIG);
      translateY.value = withSpring(0, {
        ...SPRING_CONFIG,
        velocity: -1000,
      });
    } else {
      opacity.value = withTiming(0, TIMING_CONFIG);
      translateY.value = withSpring(SCREEN_HEIGHT, {
        ...SPRING_CONFIG,
        velocity: 100,
      }, () => {
        runOnJS(setIsInactive)();
      });
    }
  }, [visible]);

  const setIsInactive = () => {
    isActive.value = false;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = Math.max(0, newTranslateY);
      opacity.value = interpolate(
        newTranslateY,
        [0, SCREEN_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP
      );
    },
    onEnd: (event) => {
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > 500) {
        opacity.value = withTiming(0, TIMING_CONFIG);
        translateY.value = withSpring(
          SCREEN_HEIGHT,
          {
            ...SPRING_CONFIG,
            velocity: event.velocityY,
          },
          () => {
            runOnJS(onClose)();
          }
        );
      } else {
        opacity.value = withTiming(1, TIMING_CONFIG);
        translateY.value = withSpring(0, {
          ...SPRING_CONFIG,
          velocity: event.velocityY,
        });
      }
    },
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: `rgba(0, 0, 0, ${interpolate(
      opacity.value,
      [0, 1],
      [0, 0.5],
      Extrapolate.CLAMP
    )})`,
  }));

  if (!visible && !isActive.value) return null;

  return (
    <Modal
      visible={true}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouch} />
        </TouchableWithoutFeedback>
        
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.container,
              { height },
              containerStyle
            ]}
          >
            <View style={styles.dragIndicator} />
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    paddingTop: Layout.spacing.md,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Layout.spacing.sm,
  },
}); 