import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Modal
} from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { VisualTask, Hotspot } from '@/app/data/mockCourses';

interface VisualLessonProps {
  visualTasks: VisualTask[];
  onComplete: () => void;
}

export default function VisualLesson({ visualTasks, onComplete }: VisualLessonProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const { width } = useWindowDimensions();

  const currentTask = visualTasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === visualTasks.length - 1;
  const allHotspotsFound = currentTask.hotspots.every(
    hotspot => foundHotspots.includes(hotspot.id)
  );

  const handleHotspotPress = (hotspot: Hotspot) => {
    if (!foundHotspots.includes(hotspot.id)) {
      setFoundHotspots(prev => [...prev, hotspot.id]);
    }
    setSelectedHotspot(hotspot);
  };

  const handleNext = () => {
    if (isLastTask) {
      onComplete();
      return;
    }

    setCurrentTaskIndex(prev => prev + 1);
    setFoundHotspots([]);
    setSelectedHotspot(null);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.taskContainer}>
        <View style={styles.header}>
          <AlertCircle color={Colors.dark.warning} size={24} />
          <Text style={styles.headerText}>
            Найдите все уязвимости
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentTask.image }}
            style={[styles.image, { width: width - 64 }]}
            resizeMode="contain"
          />
          {currentTask.hotspots.map((hotspot) => {
            const isFound = foundHotspots.includes(hotspot.id);
            return (
              <TouchableOpacity
                key={hotspot.id}
                style={[
                  styles.hotspot,
                  {
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: hotspot.size,
                    height: hotspot.size,
                    backgroundColor: isFound 
                      ? Colors.dark.success + '40'
                      : Colors.dark.warning + '40'
                  }
                ]}
                onPress={() => handleHotspotPress(hotspot)}
              >
                <View style={[
                  styles.hotspotInner,
                  isFound && styles.hotspotFound
                ]} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Найдено {foundHotspots.length} из {currentTask.hotspots.length} уязвимостей
          </Text>
        </View>

        {allHotspotsFound && (
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {isLastTask ? 'Завершить' : 'Следующее изображение'}
            </Text>
            <ChevronRight color={Colors.dark.text} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={!!selectedHotspot}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedHotspot(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedHotspot?.title}</Text>
            <Text style={styles.modalDescription}>
              {selectedHotspot?.description}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setSelectedHotspot(null)}
            >
              <Text style={styles.modalButtonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentTaskIndex + 1) / visualTasks.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.taskProgress}>
          Задание {currentTaskIndex + 1} из {visualTasks.length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  taskContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  headerText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.lg,
  },
  image: {
    height: 300,
    borderRadius: Layout.borderRadius.large,
    backgroundColor: Colors.dark.background,
  },
  hotspot: {
    position: 'absolute',
    borderRadius: Layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotInner: {
    width: '50%',
    height: '50%',
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.warning,
  },
  hotspotFound: {
    backgroundColor: Colors.dark.success,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
  },
  nextButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginRight: Layout.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  modalDescription: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.lg,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.xs,
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
  },
}); 