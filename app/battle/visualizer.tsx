import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { bubbleSortGenerator, selectionSortGenerator, insertionSortGenerator, mergeSortGenerator, quickSortGenerator } from '../../src/engine/SortingEngine';
import { ArrayVisualizer } from '../../src/components/Visualizers/ArrayVisualizer';
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Clock, Sparkles, Gamepad2, Volume2, VolumeX } from 'lucide-react-native';
import { Step } from '../../src/engine/types';
import { ComplexityGraph } from '../../src/components/ComplexityGraph';
import { BenchmarkingService, BenchmarkResult } from '../../src/services/benchmarking';
import { getAIExplanation, AIExplanation } from '../../src/services/aiTutor';
import { VoiceService } from '../../src/services/voiceService';
import Animated, { FadeInDown } from 'react-native-reanimated';

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

  const [isScientistMode, setIsScientistMode] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [benchmarkResults1, setBenchmarkResults1] = useState<BenchmarkResult[]>([]);
  const [benchmarkResults2, setBenchmarkResults2] = useState<BenchmarkResult[]>([]);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useEffect(() => {
    const gen1 = getGenerator(algo1 as string);
    const gen2 = getGenerator(algo2 as string);
    
    setSteps1(gen1([...initialData]));
    setSteps2(gen2([...initialData]));

    // Automatically start the battle after a short delay for a premium feel
    const timer = setTimeout(() => {
        setIsPlaying(true);
    }, 800);

    // Prepare benchmarks
    const runBenchmarks = async () => {
        const impl1 = BenchmarkingService.implementations[algo1 as string];
        const impl2 = BenchmarkingService.implementations[algo2 as string];
        if (impl1) setBenchmarkResults1(await BenchmarkingService.runBenchmark(algo1 as string, impl1));
        if (impl2) setBenchmarkResults2(await BenchmarkingService.runBenchmark(algo2 as string, impl2));
    };
    runBenchmarks();

    return () => clearTimeout(timer);
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
        if (showAI && isVoiceEnabled) {
            const isFinal = currentStep1 === steps1.length - 1 && currentStep2 === steps2.length - 1;
            const explanation = getAIExplanation('sorting', algo1 as string, steps1[currentStep1], currentStep1, isFinal);
            VoiceService.speak(explanation.explanation);
        }

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

      {isScientistMode && benchmarkResults1.length > 0 && (
          <View style={styles.scientistOverlay}>
              <ComplexityGraph 
                data={benchmarkResults1} 
                title={`Battle Analysis: ${getAlgoName(algo1 as string)} vs ${getAlgoName(algo2 as string)}`} 
              />
              <View style={styles.scientistNote}>
                  <Text style={styles.noteText}>
                      Notice the gap between the two algorithms as input size grows. 
                      One might start faster but lose efficiency at scale!
                  </Text>
              </View>
          </View>
      )}

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

          <TouchableOpacity 
            style={[styles.controlButton, isScientistMode && styles.activeControlBtn]} 
            onPress={() => {
                setIsScientistMode(!isScientistMode);
                if (showAI) setShowAI(false);
            }}
          >
            <Sparkles color={isScientistMode ? Theme.colors.primary : "white"} size={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, showAI && styles.activeControlBtn]} 
            onPress={() => {
                setShowAI(!showAI);
                if (isScientistMode) setIsScientistMode(false);
                const isFinal = currentStep1 === steps1.length - 1 && currentStep2 === steps2.length - 1;
                setAiExplanation(getAIExplanation('sorting', algo1 as string, steps1[currentStep1], currentStep1, isFinal));
            }}
          >
            <Gamepad2 color={showAI ? Theme.colors.primary : "white"} size={24} />
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
      {showAI && aiExplanation && (
        <Animated.View entering={FadeInDown.springify()} style={styles.aiOverlay}>
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiTitleRow}>
                <Sparkles size={18} color={Theme.colors.warning} />
                <Text style={styles.aiTitle}>Battle Tutor Insight</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => {
                        const nextState = !isVoiceEnabled;
                        setIsVoiceEnabled(nextState);
                        if (!nextState) VoiceService.stop();
                        else if (aiExplanation) VoiceService.speak(aiExplanation.explanation);
                    }}
                    style={styles.voiceToggle}
                  >
                    {isVoiceEnabled ? (
                        <Volume2 size={20} color={Theme.colors.primary} />
                    ) : (
                        <VolumeX size={20} color={Theme.colors.textMuted} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      setShowAI(false);
                      VoiceService.stop();
                  }} style={styles.aiClose}>
                    <Text style={styles.closeText}>Got it!</Text>
                  </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={styles.aiScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.aiText}>
                While {getAlgoName(algo1 as string)} is performing a {steps1[currentStep1]?.type}, 
                observe how it compares to {getAlgoName(algo2 as string)}.
              </Text>
              <Text style={styles.aiText}>{aiExplanation.explanation}</Text>
              {aiExplanation.proTip && (
                <View style={styles.proTipContainer}>
                   <Text style={styles.proTipTitle}>Battle Strategy</Text>
                   <Text style={styles.proTipText}>{aiExplanation.proTip}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
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
  },
  activeControlBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: Theme.colors.primary,
  },
  scientistOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: 20,
    zIndex: 2000,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Theme.shadows.lg,
  },
  scientistNote: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  noteText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  aiOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Theme.spacing.md,
    zIndex: 3000,
  },
  aiCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Theme.shadows.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiClose: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  closeText: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  voiceToggle: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  aiScroll: {
    maxHeight: 300,
  },
  aiText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  proTipContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  proTipTitle: {
    color: Theme.colors.success,
    fontWeight: 'bold',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  proTipText: {
    color: 'white',
    fontSize: 13,
  }
});
