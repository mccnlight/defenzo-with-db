import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  LayoutChangeEvent
} from 'react-native';
import { AlertCircle, ChevronRight, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { VisualTask, Hotspot } from '@/types/course';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
  ZoomIn,
  SlideInRight
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const POINT_SIZE = 12;
const FOUND_POINT_SIZE = 24;
const DETECTION_RADIUS = 30;

interface VisualTaskProps {
  title: string;
  description: string;
  visualTasks: VisualTask[];
  onComplete: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function VisualLesson({ 
  title, 
  description,
  visualTasks,
  onComplete 
}: VisualTaskProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [foundHotspots, setFoundHotspots] = useState<Hotspot[]>([]);
  const [areaLayout, setAreaLayout] = useState({ width: 0, height: 0 });
  const [showTaskComplete, setShowTaskComplete] = useState(false);
  
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);
  
  const currentTask = visualTasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === visualTasks.length - 1;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setAreaLayout({ width, height });
  }, []);

  const handlePress = useCallback((x: number, y: number) => {
    const isNearHotspot = currentTask.hotspots.some(hotspot => {
      const scaledX = (hotspot.x * areaLayout.width) / 100;
      const scaledY = (hotspot.y * areaLayout.height) / 100;
      return Math.abs(scaledX - x) < DETECTION_RADIUS && 
             Math.abs(scaledY - y) < DETECTION_RADIUS;
    });
    
    if (isNearHotspot) {
      const newHotspot = currentTask.hotspots.find(hotspot => {
        const scaledX = (hotspot.x * areaLayout.width) / 100;
        const scaledY = (hotspot.y * areaLayout.height) / 100;
        return Math.abs(scaledX - x) < DETECTION_RADIUS && 
               Math.abs(scaledY - y) < DETECTION_RADIUS;
      });
      
      if (newHotspot && !isHotspotFound(newHotspot)) {
        const updatedHotspots = [...foundHotspots, newHotspot];
        setFoundHotspots(updatedHotspots);
        
        // Animate progress
        progress.value = withSpring(
          (updatedHotspots.length / currentTask.hotspots.length) * 100,
          { damping: 15 }
        );
        
        if (updatedHotspots.length === currentTask.hotspots.length) {
          setShowTaskComplete(true);
        }
      }
    }
  }, [foundHotspots, currentTask, areaLayout]);
  
  const handleNextTask = useCallback(() => {
    if (isLastTask) {
      onComplete();
    } else {
      setCurrentTaskIndex(prev => prev + 1);
      setFoundHotspots([]);
      setShowTaskComplete(false);
      progress.value = withTiming(0);
    }
  }, [isLastTask, onComplete]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const isHotspotFound = useCallback((hotspot: Hotspot) => {
    return foundHotspots.some(h => h.id === hotspot.id);
  }, [foundHotspots]);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <Text style={styles.title}>{currentTask.title}</Text>
        <Text style={styles.description}>{currentTask.description}</Text>
      </Animated.View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          Found {foundHotspots.length} of {currentTask.hotspots.length} items
        </Text>
      </View>

      <Animated.View 
        entering={SlideInRight.duration(300)}
        style={styles.imageContainer}
      >
        <TouchableOpacity
          style={styles.imageArea}
          onLayout={handleLayout}
          onPress={(event) => {
            const { locationX, locationY } = event.nativeEvent;
            handlePress(locationX, locationY);
          }}
        >
          <Image
            source={{ uri: currentTask.image }}
            style={styles.image}
            resizeMode="contain"
          />
          
          {currentTask.hotspots.map((hotspot) => {
            const found = isHotspotFound(hotspot);
            const scaledX = (hotspot.x * areaLayout.width) / 100;
            const scaledY = (hotspot.y * areaLayout.height) / 100;
            
            return found ? (
              <Animated.View
                key={hotspot.id}
                entering={ZoomIn.duration(300)}
                style={[
                  styles.foundHotspot,
                  {
                    left: scaledX - FOUND_POINT_SIZE / 2,
                    top: scaledY - FOUND_POINT_SIZE / 2,
                  }
                ]}
              >
                <Check size={16} color={Colors.dark.success} />
              </Animated.View>
            ) : (
              <Animated.View
                key={hotspot.id}
                style={[
                  styles.hotspot,
                  {
                    left: scaledX - POINT_SIZE / 2,
                    top: scaledY - POINT_SIZE / 2,
                  }
                ]}
              />
            );
          })}
        </TouchableOpacity>
      </Animated.View>

      {foundHotspots.map((hotspot) => (
        <Animated.View
          key={hotspot.id}
          entering={FadeIn.duration(300)}
          style={styles.foundItemContainer}
        >
          <View style={styles.foundItemIcon}>
            <Check size={16} color={Colors.dark.success} />
          </View>
          <View style={styles.foundItemContent}>
            <Text style={styles.foundItemTitle}>{hotspot.title}</Text>
            <Text style={styles.foundItemDescription}>{hotspot.description}</Text>
          </View>
        </Animated.View>
      ))}

      {showTaskComplete && (
        <AnimatedTouchableOpacity
          style={[styles.nextButton, buttonStyle]}
          onPress={handleNextTask}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          entering={FadeIn.duration(300)}
        >
          <Text style={styles.nextButtonText}>
            {isLastTask ? 'Complete Task' : 'Next Task'}
          </Text>
          <ChevronRight size={20} color={Colors.dark.text} />
        </AnimatedTouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: Layout.spacing.lg,
  },
  header: {
    marginBottom: Layout.spacing.xl,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    lineHeight: fontSizes.md * 1.5,
  },
  progressContainer: {
    marginBottom: Layout.spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
    marginBottom: Layout.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  imageContainer: {
    marginBottom: Layout.spacing.xl,
  },
  imageArea: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hotspot: {
    position: 'absolute',
    width: POINT_SIZE,
    height: POINT_SIZE,
    borderRadius: POINT_SIZE / 2,
    backgroundColor: Colors.dark.primary + '40',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  foundHotspot: {
    position: 'absolute',
    width: FOUND_POINT_SIZE,
    height: FOUND_POINT_SIZE,
    borderRadius: FOUND_POINT_SIZE / 2,
    backgroundColor: Colors.dark.success + '20',
    borderWidth: 2,
    borderColor: Colors.dark.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foundItemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  foundItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  foundItemContent: {
    flex: 1,
  },
  foundItemTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  foundItemDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    lineHeight: fontSizes.sm * 1.5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    marginTop: Layout.spacing.lg,
  },
  nextButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginRight: Layout.spacing.xs,
  },
}); 