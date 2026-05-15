import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { bubbleSortGenerator, selectionSortGenerator, insertionSortGenerator, mergeSortGenerator, quickSortGenerator } from '../../src/engine/SortingEngine';
import { ArrayVisualizer } from '../../src/components/Visualizers/ArrayVisualizer';
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Clock } from 'lucide-react-native';
import { Step } from '../../src/engine/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BattleVisualizerScreen() {
  const { algo1, algo2, size } = useLocalSearchParams();
  const router = useRouter();
  const dataSize = parseInt(size as string) || 10;

  const [initialData] = useState(() => 
    Array.from({ length: dataSize }, () => Math.floor(Math.random() * 90) + 10)
  );

  // States for Algo 1
  const [steps1, setSteps1] = useState<Step[]>([]);
  const [currentStep1, setCurrentStep1] = useState(0);
  
  // States for Algo 2
  const [steps2, setSteps2] = useState<Step[]>([]);
  const [currentStep2, setCurrentStep2] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed] = useState(500);

  useEffect(() => {
    const gen1 = getGenerator(algo1 as string);
    const gen2 = getGenerator(algo2 as string);
    
    setSteps1(gen1([...initialData]));
    setSteps2(gen2([...initialData]));
  }, [algo1, algo2, initialData]);

  const getGenerator = (id: string) => {
    switch (id) {
      case 'bubble-sort': return bubbleSortGenerator;
      case 'selection-sort': return selectionSortGenerator;
      case 'insertion-sort': return insertionSortGenerator;
      case 'merge-sort': return mergeSortGenerator;
      case 'quick-sort': return quickSortGenerator;
      default: return bubbleSortGenerator;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        let bothFinished = true;
        
        setCurrentStep1(prev => {
          if (prev < steps1.length - 1) {
            bothFinished = false;
            return prev + 1;
          }
          return prev;
        });

        setCurrentStep2(prev => {
          if (prev < steps2.length - 1) {
            bothFinished = false;
            return prev + 1;
          }
          return prev;
        });

        if (bothFinished) setIsPlaying(false);
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps1.length, steps2.length, playbackSpeed]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep1(0);
    setCurrentStep2(0);
  };

  const getAlgoName = (id: string) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const isFinished1 = currentStep1 === steps1.length - 1;
  const isFinished2 = currentStep2 === steps2.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Battle Arena',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft color={Theme.colors.text} size={28} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
        }} 
      />

      <View style={styles.battleField}>
          <View style={styles.contenderArea}>
              <View style={styles.contenderHeader}>
                  <Text style={styles.contenderName}>{getAlgoName(algo1 as string)}</Text>
                  {isFinished1 && <View style={styles.winnerBadge}><Zap size={12} color="white" /><Text style={styles.winnerBadgeText}>Done</Text></View>}
              </View>
              <View style={styles.visualizerContainer}>
                  <ArrayVisualizer 
                    data={steps1[currentStep1]?.data || initialData}
                    activeIndices={steps1[currentStep1]?.activeIndices || []}
                    comparingIndices={steps1[currentStep1]?.comparingIndices || []}
                    swappingIndices={steps1[currentStep1]?.swappingIndices || []}
                  />
              </View>
              <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                      <Clock size={14} color={Theme.colors.textMuted} />
                      <Text style={styles.statValue}>{currentStep1} / {steps1.length - 1} steps</Text>
                  </View>
              </View>
          </View>

          <View style={styles.vsDivider}>
              <View style={styles.vsLine} />
              <View style={styles.vsHex}>
                  <Text style={styles.vsText}>VS</Text>
              </View>
              <View style={styles.vsLine} />
          </View>

          <View style={styles.contenderArea}>
              <View style={styles.contenderHeader}>
                  <Text style={styles.contenderName}>{getAlgoName(algo2 as string)}</Text>
                  {isFinished2 && <View style={styles.winnerBadge}><Zap size={12} color="white" /><Text style={styles.winnerBadgeText}>Done</Text></View>}
              </View>
              <View style={styles.visualizerContainer}>
                  <ArrayVisualizer 
                    data={steps2[currentStep2]?.data || initialData}
                    activeIndices={steps2[currentStep2]?.activeIndices || []}
                    comparingIndices={steps2[currentStep2]?.comparingIndices || []}
                    swappingIndices={steps2[currentStep2]?.swappingIndices || []}
                  />
              </View>
              <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                      <Clock size={14} color={Theme.colors.textMuted} />
                      <Text style={styles.statValue}>{currentStep2} / {steps2.length - 1} steps</Text>
                  </View>
              </View>
          </View>
      </View>

      <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.resetButton]} 
            onPress={reset}
          >
            <RotateCcw color={Theme.colors.text} size={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.playButton]} 
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause color="white" size={32} fill="white" />
            ) : (
              <Play color="white" size={32} fill="white" />
            )}
          </TouchableOpacity>

          <View style={styles.spacer} />
      </View>
      
      {isFinished1 && isFinished2 && (
          <View style={styles.resultOverlay}>
              <Text style={styles.resultTitle}>Battle Results</Text>
              <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{getAlgoName(algo1 as string)}</Text>
                  <Text style={styles.resultValue}>{steps1.length - 1} Steps</Text>
              </View>
              <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{getAlgoName(algo2 as string)}</Text>
                  <Text style={styles.resultValue}>{steps2.length - 1} Steps</Text>
              </View>
              <Text style={styles.winnerAnnounce}>
                  {steps1.length < steps2.length ? `${getAlgoName(algo1 as string)} was more efficient!` : `${getAlgoName(algo2 as string)} was more efficient!`}
              </Text>
          </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  battleField: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  contenderArea: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  contenderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contenderName: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  winnerBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginLeft: 6,
  },
  vsDivider: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  vsHex: {
    width: 40,
    height: 40,
    backgroundColor: Theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  vsText: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 12,
    transform: [{ rotate: '-45deg' }],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    paddingBottom: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  resetButton: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginRight: 20,
  },
  playButton: {
    backgroundColor: Theme.colors.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  spacer: {
    flex: 1,
  },
  resultOverlay: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: Theme.borderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.lg,
    zIndex: 1000,
  },
  resultTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultLabel: {
    color: Theme.colors.textMuted,
    fontSize: 16,
  },
  resultValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  winnerAnnounce: {
    color: Theme.colors.success,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  }
});
