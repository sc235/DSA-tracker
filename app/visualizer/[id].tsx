import { Stack, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  CheckCircle2,
  Gamepad2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ComplexityGraph } from "../../src/components/ComplexityGraph";
import { ArrayVisualizer } from "../../src/components/Visualizers/ArrayVisualizer";
import { GraphVisualizer } from "../../src/components/Visualizers/GraphVisualizer";
import { HashVisualizer } from "../../src/components/Visualizers/HashVisualizer";
import { LinearVisualizer } from "../../src/components/Visualizers/LinearVisualizer";
import { NodeVisualizer } from "../../src/components/Visualizers/NodeVisualizer";
import { TreeVisualizer } from "../../src/components/Visualizers/TreeVisualizer";
import {
  dpFibonacciGenerator,
  hashInsertGenerator,
  heapGenerator,
  trieInsertGenerator,
} from "../../src/engine/AdvancedEngine";
import { bfsGenerator, dfsGenerator } from "../../src/engine/GraphEngine";
import { queueGenerator, stackGenerator } from "../../src/engine/LinearEngine";
import {
  linkedListInsertGenerator,
  linkedListSearchGenerator,
} from "../../src/engine/LinkedListEngine";
import { binarySearchGenerator } from "../../src/engine/SearchingEngine";
import {
  bubbleSortGenerator,
  insertionSortGenerator,
  mergeSortGenerator,
  quickSortGenerator,
  selectionSortGenerator,
} from "../../src/engine/SortingEngine";
import {
  bstInsertGenerator,
  bstSearchGenerator,
  treeTraversalGenerator,
} from "../../src/engine/TreeEngine";
import { useAlgorithmPlayer } from "../../src/hooks/useAlgorithmPlayer";
import { AIExplanation, getAIExplanation } from "../../src/services/aiTutor";
import {
  BenchmarkingService,
  BenchmarkResult,
} from "../../src/services/benchmarking";
import { ProgressService } from "../../src/services/progress";
import { VoiceService } from "../../src/services/voiceService";
import { useAlgorithmStore } from "../../src/store/useAlgorithmStore";
import { Theme } from "../../src/theme";

export default function VisualizerScreen() {
  const { id } = useLocalSearchParams();
  const {
    steps,
    currentStepIndex,
    isPlaying,
    isRemoteSyncEnabled,
    setSteps,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    toggleRemoteSync,
    isPracticeMode,
    practiceScore,
    togglePracticeMode,
    validateAction,
    playbackSpeed,
    setPlaybackSpeed,
    setIsPlaying,
  } = useAlgorithmStore();

  const [showAI, setShowAI] = useState(false);
  const [isScientistMode, setIsScientistMode] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>(
    [],
  );
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(
    null,
  );
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useAlgorithmPlayer();

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1) {
      ProgressService.markTopicCompleted(id as string).catch(console.error);
      setShowAI(true);
    }

    // Update AI explanation when step changes
    if (steps[currentStepIndex]) {
      setAiExplanation(
        getAIExplanation(
          id as string,
          id as string,
          steps[currentStepIndex],
          currentStepIndex,
          currentStepIndex === steps.length - 1
        ),
      );
      
      if (showAI && isVoiceEnabled) {
          const isFinal = currentStepIndex === steps.length - 1;
          const explanation = getAIExplanation(id as string, id as string, steps[currentStepIndex], currentStepIndex, isFinal);
          VoiceService.speak(explanation.explanation);
      }
    }
  }, [currentStepIndex, steps.length, id, showAI, isVoiceEnabled]);

  const [initialData] = useState([45, 23, 89, 12, 56, 34, 78, 5]);
  const runScientistBenchmark = async () => {
    const impl = BenchmarkingService.implementations[id as string];
    if (impl) {
      const results = await BenchmarkingService.runBenchmark(
        id as string,
        impl,
      );
      setBenchmarkResults(results);
    }
  };

  useEffect(() => {
    if (isScientistMode) {
      runScientistBenchmark();
    }
  }, [isScientistMode]);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (id === "bubble-sort") {
      const generatedSteps = bubbleSortGenerator([
        45, 23, 89, 12, 56, 34, 78, 5,
      ]);
      setSteps(generatedSteps);
    } else if (id === "stack-push") {
      const generatedSteps = stackGenerator([10, 20, 30], "push", 40);
      setSteps(generatedSteps);
    } else if (id === "queue-enqueue") {
      const generatedSteps = queueGenerator([10, 20, 30], "enqueue", 40);
      setSteps(generatedSteps);
    } else if (id === "hash-insert") {
      const generatedSteps = hashInsertGenerator([10, 25, 45, 12]);
      setSteps(generatedSteps);
    } else if (id === "max-heap" || id === "heap-sort") {
      const generatedSteps = heapGenerator([15, 30, 10, 50, 20, 8, 5], "max");
      setSteps(generatedSteps);
    } else if (id === "min-heap") {
      const generatedSteps = heapGenerator([50, 30, 20, 15, 10, 8, 5], "min");
      setSteps(generatedSteps);
    } else if (id === "dp-fibonacci") {
      const generatedSteps = dpFibonacciGenerator(6);
      setSteps(generatedSteps);
    } else if (id === "trie-insert") {
      const generatedSteps = trieInsertGenerator(["HI", "HE"]);
      setSteps(generatedSteps);
    } else if (id === "selection-sort") {
      const generatedSteps = selectionSortGenerator(initialData);
      setSteps(generatedSteps);
    } else if (id === "insertion-sort") {
      const generatedSteps = insertionSortGenerator(initialData);
      setSteps(generatedSteps);
    } else if (id === "merge-sort") {
      const generatedSteps = mergeSortGenerator(initialData);
      setSteps(generatedSteps);
    } else if (id === "quick-sort") {
      const generatedSteps = quickSortGenerator(initialData);
      setSteps(generatedSteps);
    } else if (id === "binary-search") {
      const target = 56; // Example target
      const generatedSteps = binarySearchGenerator(initialData, target);
      setSteps(generatedSteps);
    } else if (id === "linked-list-search") {
      const target = 56;
      const generatedSteps = linkedListSearchGenerator(initialData, target);
      setSteps(generatedSteps);
    } else if (id === "linked-list-insert") {
      const generatedSteps = linkedListInsertGenerator(initialData, 99, 2);
      setSteps(generatedSteps);
    } else if (id === "bst-search") {
      const target = 70;
      const generatedSteps = bstSearchGenerator(initialData, target);
      setSteps(generatedSteps);
    } else if (id === "bst-insert") {
      const generatedSteps = bstInsertGenerator(initialData, 65);
      setSteps(generatedSteps);
    } else if (id === "tree-traversal-in") {
      const generatedSteps = treeTraversalGenerator("in");
      setSteps(generatedSteps);
    } else if (id === "tree-traversal-pre") {
      const generatedSteps = treeTraversalGenerator("pre");
      setSteps(generatedSteps);
    } else if (id === "tree-traversal-post") {
      const generatedSteps = treeTraversalGenerator("post");
      setSteps(generatedSteps);
    } else if (id === "bfs") {
      const generatedSteps = bfsGenerator("A");
      setSteps(generatedSteps);
    } else if (id === "dfs") {
      const generatedSteps = dfsGenerator("A");
      setSteps(generatedSteps);
    }

    // Automatically start the animation for a premium experience
    const timer = setTimeout(() => {
      if (!isPracticeMode) setIsPlaying(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, isPracticeMode]);

  if (!currentStep) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Visualizer",
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => setShowAI(!showAI)}
                style={{ marginRight: 16 }}
              >
                <Sparkles
                  color={showAI ? Theme.colors.warning : Theme.colors.textMuted}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={togglePracticeMode}
                style={{ marginRight: 16 }}
              >
                <Gamepad2
                  color={
                    isPracticeMode
                      ? Theme.colors.primary
                      : Theme.colors.textMuted
                  }
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleRemoteSync}
                style={{ marginRight: 16 }}
              >
                <Users
                  color={
                    isRemoteSyncEnabled
                      ? Theme.colors.primary
                      : Theme.colors.textMuted
                  }
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {isScientistMode && benchmarkResults.length > 0 && (
        <View style={styles.scientistDashboard}>
          <ComplexityGraph
            data={benchmarkResults}
            title={`${id} Performance Analysis`}
          />
          <View style={styles.scientistCard}>
            <Text style={styles.scientistCardTitle}>Technical Insights</Text>
            <Text style={styles.scientistCardText}>
              Observe how the execution time grows as input size increases.
              {id?.toString().includes("bubble")
                ? " This is an O(n²) algorithm, which means time increases quadratically."
                : " This efficient algorithm maintains good performance even at scale."}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.visualizerContainer}>
          {currentStep.graphNodes ? (
            <GraphVisualizer
              nodes={currentStep.graphNodes}
              edges={currentStep.graphEdges || []}
              highlightedNodeIds={currentStep.highlightedNodeIds || []}
              highlightedEdgeIds={currentStep.highlightedEdgeIds || []}
            />
          ) : currentStep.treeNodes ? (
            <TreeVisualizer
              nodes={currentStep.treeNodes}
              highlightedNodeIds={currentStep.highlightedNodeIds || []}
              highlightedEdgeIds={currentStep.highlightedEdgeIds || []}
            />
          ) : currentStep.nodes ? (
            <NodeVisualizer
              nodes={currentStep.nodes}
              highlightedNodeIds={currentStep.highlightedNodeIds || []}
              highlightedPointerIds={currentStep.highlightedPointerIds || []}
            />
          ) : id?.toString().includes("stack") ||
            id?.toString().includes("queue") ? (
            <LinearVisualizer
              type={id?.toString().includes("stack") ? "stack" : "queue"}
              data={currentStep.data || []}
              activeIndex={currentStep.activeIndex}
            />
          ) : currentStep.buckets ? (
            <HashVisualizer
              buckets={currentStep.buckets}
              activeIndices={currentStep.activeIndices || []}
              currentKey={currentStep.key}
            />
          ) : currentStep.data ? (
            <ArrayVisualizer
              data={currentStep.data}
              activeIndices={currentStep.activeIndices || []}
              comparingIndices={currentStep.comparingIndices || []}
              swappingIndices={currentStep.swappingIndices || []}
            />
          ) : null}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.stepTitle}>
              {isPracticeMode
                ? `Practice Mode - Score: ${practiceScore}`
                : `Step ${currentStepIndex + 1} of ${steps.length}`}
            </Text>
            {isPracticeMode && currentStepIndex === steps.length - 1 && (
              <CheckCircle2 size={20} color={Theme.colors.success} />
            )}
          </View>
          <Text style={styles.description}>
            {isPracticeMode
              ? "Analyze the visualization and click 'Perform Step' to execute the next logical operation."
              : currentStep.description}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.controls}>
        {isPracticeMode ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.practiceActionButton]}
            onPress={() => validateAction("step")}
            disabled={currentStepIndex === steps.length - 1}
          >
            <Text style={styles.practiceButtonText}>Perform Next Step</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.playbackBarContainer}>
            <View style={styles.sideGroup}>
              <TouchableOpacity style={styles.controlButton} onPress={reset}>
                <RotateCcw size={22} color={Theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={prevStep}>
                <SkipBack size={22} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={togglePlay}
            >
              {isPlaying ? (
                <Pause size={30} color="white" fill="white" />
              ) : (
                <Play size={30} color="white" fill="white" />
              )}
            </TouchableOpacity>

            <View style={[styles.sideGroup, { justifyContent: "flex-end" }]}>
              <TouchableOpacity style={styles.controlButton} onPress={nextStep}>
                <SkipForward size={22} color={Theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => {
                  const nextState = !isVoiceEnabled;
                  setIsVoiceEnabled(nextState);
                  if (!nextState) VoiceService.stop();
                  else if (aiExplanation) VoiceService.speak(aiExplanation.explanation);
                }}
              >
                {isVoiceEnabled ? (
                  <Volume2 size={22} color={Theme.colors.primary} />
                ) : (
                  <VolumeX size={22} color={Theme.colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {!isPracticeMode && (
        <View style={styles.bottomControlDock}>
          <View style={styles.modeButtonsRow}>
            <TouchableOpacity
              style={[
                styles.dockModeBtn,
                isScientistMode && styles.activeDockModeBtn,
              ]}
              onPress={() => {
                setIsScientistMode(!isScientistMode);
                if (showAI) setShowAI(false);
              }}
            >
              <Sparkles
                color={isScientistMode ? Theme.colors.primary : Theme.colors.warning}
                size={18}
              />
              <Text
                style={[
                  styles.dockModeBtnText,
                  isScientistMode && styles.activeDockModeBtnText,
                ]}
              >
                Scientist Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dockModeBtn, showAI && styles.activeDockModeBtn]}
              onPress={() => {
                setShowAI(!showAI);
                if (isScientistMode) setIsScientistMode(false);
                setAiExplanation(
                  getAIExplanation(
                    id as string,
                    id as string,
                    steps[currentStepIndex],
                    currentStepIndex,
                    currentStepIndex === steps.length - 1
                  ),
                );
              }}
            >
              <Gamepad2
                color={showAI ? Theme.colors.primary : Theme.colors.success}
                size={18}
              />
              <Text
                style={[
                  styles.dockModeBtnText,
                  showAI && styles.activeDockModeBtnText,
                ]}
              >
                AI Tutor Mode
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.speedRow}>
            <Text style={styles.dockSpeedLabel}>SPEED</Text>
            <View style={styles.speedButtonsRow}>
              {[0.5, 1, 2].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.dockSpeedBtn,
                    playbackSpeed === 500 / s && styles.activeDockSpeedBtn,
                  ]}
                  onPress={() => setPlaybackSpeed(500 / s)}
                >
                  <Text
                    style={[
                      styles.dockSpeedBtnText,
                      playbackSpeed === 500 / s && styles.activeDockSpeedBtnText,
                    ]}
                  >
                    {s}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {showAI && aiExplanation && (
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.aiOverlay}
        >
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiTitleRow}>
                <Sparkles size={18} color={Theme.colors.warning} />
                <Text style={styles.aiTitle}>AI Tutor Insight</Text>
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
            <ScrollView
              style={styles.aiScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.aiStepBadge}>{aiExplanation.step}</Text>
              <Text style={styles.aiText}>{aiExplanation.explanation}</Text>

              {aiExplanation.analogy && (
                <View style={styles.analogyBox}>
                  <Text style={styles.analogyTitle}>💡 Real-world Analogy</Text>
                  <Text style={styles.analogyText}>
                    {aiExplanation.analogy}
                  </Text>
                </View>
              )}

              {aiExplanation.proTip && (
                <View style={styles.proTipContainer}>
                  <Text style={styles.proTipTitle}>Pro Tip</Text>
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
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl,
  },
  visualizerContainer: {
    minHeight: 400,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
  },
  infoCard: {
    backgroundColor: Theme.colors.surface,
    margin: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  stepTitle: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    color: Theme.colors.text,
    lineHeight: 24,
  },
  controls: {
    paddingVertical: Theme.spacing.xl,
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
  },
  playbackBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    width: "100%",
  },
  sideGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: 100,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  controlBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  practiceActionButton: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    height: 56,
    borderRadius: Theme.borderRadius.lg,
    marginHorizontal: Theme.spacing.lg,
  },
  practiceButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  controlBtnText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
  },
  activeControlBtn: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderColor: Theme.colors.primary,
  },
  scientistDashboard: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  scientistCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  scientistCardTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  scientistCardText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  bottomControlDock: {
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modeButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dockModeBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  activeDockModeBtn: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderColor: Theme.colors.primary,
  },
  dockModeBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  activeDockModeBtnText: {
    color: Theme.colors.primary,
    fontWeight: "bold",
  },
  speedRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dockSpeedLabel: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginRight: 16,
  },
  speedButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  dockSpeedBtn: {
    width: 56,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeDockSpeedBtn: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dockSpeedBtnText: {
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: "bold",
  },
  activeDockSpeedBtnText: {
    color: "white",
  },
  aiOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: Theme.spacing.md,
    zIndex: 2000,
  },
  aiCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    ...Theme.shadows.lg,
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  aiClose: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  closeText: {
    color: Theme.colors.primary,
    fontWeight: "bold",
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
  aiStepBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  aiText: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  analogyBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.warning,
  },
  analogyTitle: {
    color: Theme.colors.warning,
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  analogyText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
  },
  proTipContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  proTipTitle: {
    color: Theme.colors.success,
    fontWeight: "bold",
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  proTipText: {
    color: "white",
    fontSize: 13,
  },
});
