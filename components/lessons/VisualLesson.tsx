import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Modal,
  Dimensions,
  LayoutChangeEvent
} from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { VisualTask, Hotspot } from '@/types/course';

const SCREEN_WIDTH = Dimensions.get('window').width;
const POINT_SIZE = 10;
const FOUND_POINT_SIZE = 20;
const DETECTION_RADIUS = 20;

interface VisualTaskProps {
  title: string;
  description: string;
  visualTasks: VisualTask[];
  onComplete: () => void;
}

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
    }
  }, [isLastTask, onComplete]);

  const isHotspotFound = useCallback((hotspot: Hotspot) => {
    return foundHotspots.some(h => h.id === hotspot.id);
  }, [foundHotspots]);

  const scaledHotspots = useMemo(() => 
    currentTask.hotspots.map(hotspot => ({
      ...hotspot,
      scaledX: (hotspot.x * areaLayout.width) / 100,
      scaledY: (hotspot.y * areaLayout.height) / 100
    })),
    [currentTask.hotspots, areaLayout]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentTask.title}</Text>
        <Text style={styles.description}>{currentTask.description}</Text>
      </View>

      <View 
        style={styles.taskArea}
        onLayout={handleLayout}
      >
        <Image
          source={{ uri: currentTask.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.interactiveArea}
          onPress={(event) => {
            const { locationX, locationY } = event.nativeEvent;
            handlePress(locationX, locationY);
          }}
        >
          {scaledHotspots.map((hotspot) => (
            <View
              key={hotspot.id}
              style={[
                styles.targetPoint,
                {
                  left: hotspot.scaledX - POINT_SIZE / 2,
                  top: hotspot.scaledY - POINT_SIZE / 2,
                  backgroundColor: isHotspotFound(hotspot) 
                    ? Colors.dark.success 
                    : Colors.dark.warning
                }
              ]}
            />
          ))}
          
          {foundHotspots.map((hotspot) => (
            <View
              key={`found-${hotspot.id}`}
              style={[
                styles.foundPoint,
                {
                  left: (hotspot.x * areaLayout.width) / 100 - FOUND_POINT_SIZE / 2,
                  top: (hotspot.y * areaLayout.height) / 100 - FOUND_POINT_SIZE / 2,
                }
              ]}
            >
              <Text style={styles.hotspotTitle}>{hotspot.title}</Text>
              <Text style={styles.hotspotDescription}>{hotspot.description}</Text>
            </View>
          ))}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          Found {foundHotspots.length} of {currentTask.hotspots.length} vulnerabilities
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${(foundHotspots.length / currentTask.hotspots.length) * 100}%` 
              }
            ]} 
          />
        </View>

        <Text style={styles.taskProgress}>
          Task {currentTaskIndex + 1} of {visualTasks.length}
        </Text>
      </View>

      {showTaskComplete && (
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextTask}
        >
          <Text style={styles.nextButtonText}>
            {isLastTask ? 'Complete Lesson' : 'Next Task'}
          </Text>
          <ChevronRight color={Colors.dark.text} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.lg,
  },
  header: {
    marginBottom: Layout.spacing.lg,
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
  },
  taskArea: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
    marginBottom: Layout.spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  interactiveArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  targetPoint: {
    position: 'absolute',
    width: POINT_SIZE,
    height: POINT_SIZE,
    borderRadius: POINT_SIZE / 2,
    zIndex: 1,
  },
  foundPoint: {
    position: 'absolute',
    width: FOUND_POINT_SIZE,
    height: FOUND_POINT_SIZE,
    borderRadius: FOUND_POINT_SIZE / 2,
    borderWidth: 2,
    borderColor: Colors.dark.success,
    backgroundColor: Colors.dark.success + '20',
    zIndex: 2,
  },
  hotspotTitle: {
    position: 'absolute',
    top: FOUND_POINT_SIZE + 4,
    left: FOUND_POINT_SIZE / 2,
    backgroundColor: Colors.dark.card,
    padding: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    width: 150,
  },
  hotspotDescription: {
    position: 'absolute',
    top: FOUND_POINT_SIZE + 28,
    left: FOUND_POINT_SIZE / 2,
    backgroundColor: Colors.dark.card,
    padding: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.7,
    width: 150,
  },
  footer: {
    gap: Layout.spacing.sm,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  taskProgress: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
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