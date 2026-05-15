import { Stack, useLocalSearchParams } from "expo-router";
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
import { ArrayVisualizer } from "../../src/components/Visualizers/ArrayVisualizer";
import { GraphVisualizer } from "../../src/components/Visualizers/GraphVisualizer";
import { HashVisualizer } from "../../src/components/Visualizers/HashVisualizer";
import { LinearVisualizer } from "../../src/components/Visualizers/LinearVisualizer";
import { NodeVisualizer } from "../../src/components/Visualizers/NodeVisualizer";
import { TreeVisualizer } from "../../src/components/Visualizers/TreeVisualizer";
import {
  dpFibonacciGenerator,
  hashInsertGenerator,
  heapSortGenerator,
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
import { ProgressService } from "../../src/services/progress";
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
  } = useAlgorithmStore();

  const [showAI, setShowAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(
    null,
  );

  useAlgorithmPlayer();

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1) {
      ProgressService.markTopicCompleted(id as string).catch(console.error);
    }

    // Update AI explanation when step changes
    if (steps[currentStepIndex]) {
      setAiExplanation(
        getAIExplanation(
          id as string,
          id as string,
          steps[currentStepIndex],
          currentStepIndex,
        ),
      );
    }
  }, [currentStepIndex, steps.length, id]);

  const [initialData] = useState([45, 23, 89, 12, 56, 34, 78, 5]);
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
    } else if (id === "heap-sort") {
      const generatedSteps = heapSortGenerator([50, 30, 20, 15, 10, 8, 5]);
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
      const generatedSteps = bstInsertGenerator(initialData, 45);
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
  }, [id]);

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
          <>
            <TouchableOpacity style={styles.controlButton} onPress={reset}>
              <RotateCcw size={24} color={Theme.colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={prevStep}>
              <SkipBack size={24} color={Theme.colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={togglePlay}
            >
              {isPlaying ? (
                <Pause size={32} color="white" fill="white" />
              ) : (
                <Play size={32} color="white" fill="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={nextStep}>
              <SkipForward size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {!isPracticeMode && (
        <View style={styles.speedSelector}>
          <Text style={styles.speedLabel}>Playback Speed</Text>
          <View style={styles.speedButtons}>
            {[0.5, 1, 2].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.speedButton,
                  playbackSpeed === 500 / s && styles.activeSpeedButton,
                ]}
                onPress={() => setPlaybackSpeed(500 / s)}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    playbackSpeed === 500 / s && styles.activeSpeedButtonText,
                  ]}
                >
                  {s}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showAI && aiExplanation && (
        <View style={styles.aiOverlay}>
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Sparkles size={20} color={Theme.colors.warning} />
              <Text style={styles.aiTitle}>AI Tutor Explanation</Text>
              <TouchableOpacity onPress={() => setShowAI(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.aiScroll}>
              <Text style={styles.aiText}>{aiExplanation.explanation}</Text>
              {aiExplanation.analogy && (
                <View style={styles.analogyBox}>
                  <Text style={styles.analogyTitle}>Analogy</Text>
                  <Text style={styles.analogyText}>
                    {aiExplanation.analogy}
                  </Text>
                </View>
              )}
              {aiExplanation.proTip && (
                <Text style={styles.proTip}>
                  💡 Pro Tip: {aiExplanation.proTip}
                </Text>
              )}
            </ScrollView>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: Theme.spacing.xl,
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
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
  placeholder: {
    width: 50,
  },
  aiOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  aiCard: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    maxHeight: "60%",
    borderTopWidth: 2,
    borderTopColor: Theme.colors.warning,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  aiTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    flex: 1,
  },
  closeText: {
    color: Theme.colors.primary,
    fontWeight: "bold",
  },
  aiScroll: {
    marginBottom: Theme.spacing.xl,
  },
  aiText: {
    color: Theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Theme.spacing.lg,
  },
  analogyBox: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.warning,
  },
  analogyTitle: {
    color: Theme.colors.warning,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  analogyText: {
    color: Theme.colors.text,
    fontSize: 14,
    fontStyle: "italic",
  },
  proTip: {
    color: Theme.colors.success,
    fontSize: 14,
    fontWeight: "500",
    marginTop: Theme.spacing.sm,
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
  speedSelector: {
    backgroundColor: Theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  speedLabel: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  speedButtons: {
    flexDirection: "row",
    gap: 8,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  activeSpeedButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  speedButtonText: {
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  activeSpeedButtonText: {
    color: "white",
  },
});
