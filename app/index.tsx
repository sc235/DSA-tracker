import { Stack, useFocusEffect, useRouter } from "expo-router";
import { Swords, Trophy, User, Zap } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { RoadmapNode } from "../src/components/RoadmapNode";
import { DSA_TOPICS } from "../src/constants/Topics";
import { ProgressService } from "../src/services/progress";
import { Theme } from "../src/theme";

const NODE_WIDTH = 120;

export default function HomeScreen() {
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const NODE_OFFSET_X = SCREEN_WIDTH / 2 - NODE_WIDTH / 2;
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, []),
  );

  const loadProgress = async () => {
    try {
      const stats = await ProgressService.getUserStats();
      if (!stats) return;

      setTotalPoints(stats.total_points || 0);
      setCompletedTopics(stats.completedTopics || {});
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const isUnlocked = (topicId: string) => {
    const topic = DSA_TOPICS.find((t) => t.id === topicId);
    if (!topic || !topic.prerequisites) return true;
    return topic.prerequisites.every((p) => completedTopics[p]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Learning Path</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Zap
                size={14}
                color={Theme.colors.warning}
                fill={Theme.colors.warning}
              />
              <Text style={styles.statText}>{totalPoints} XP</Text>
            </View>
            <View style={[styles.stat, { marginLeft: 12 }]}>
              <Trophy size={14} color={Theme.colors.primary} />
              <Text style={styles.statText}>
                {Object.values(completedTopics).filter(Boolean).length} Mastered
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.battleButton}
            onPress={() => router.push("/battle")}
          >
            <Swords color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <User color={Theme.colors.primary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.roadmapScroll}
        contentContainerStyle={styles.roadmapContent}
        showsVerticalScrollIndicator={false}
      >
        <Svg style={styles.svgBackground}>
          {/* Glowing Orbital Blobs for visual depth */}
          <Circle
            cx={SCREEN_WIDTH * 0.8}
            cy="200"
            r="150"
            fill="rgba(99, 102, 241, 0.07)"
          />
          <Circle
            cx={SCREEN_WIDTH * 0.2}
            cy="500"
            r="120"
            fill="rgba(16, 185, 129, 0.05)"
          />
          <Circle
            cx={SCREEN_WIDTH * 0.7}
            cy="800"
            r="180"
            fill="rgba(245, 158, 11, 0.05)"
          />

          {/* Connection Lines with Glowing Effect */}
          {DSA_TOPICS.map((topic) => {
            if (!topic.prerequisites) return null;
            return topic.prerequisites.map((pId) => {
              const parent = DSA_TOPICS.find((t) => t.id === pId);
              if (!parent) return null;

              const startX =
                parent.roadmapPosition.x + NODE_OFFSET_X + NODE_WIDTH / 2;
              const startY = parent.roadmapPosition.y + NODE_WIDTH / 2;
              const endX =
                topic.roadmapPosition.x + NODE_OFFSET_X + NODE_WIDTH / 2;
              const endY = topic.roadmapPosition.y + NODE_WIDTH / 2;

              return (
                <React.Fragment key={`${pId}-${topic.id}`}>
                  {/* Outer Glow */}
                  <Line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={
                      completedTopics[pId]
                        ? Theme.colors.primary
                        : "transparent"
                    }
                    strokeWidth="8"
                    opacity="0.1"
                  />
                  <Line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={
                      completedTopics[pId]
                        ? Theme.colors.primary
                        : "rgba(255,255,255,0.2)"
                    }
                    strokeWidth="4"
                    strokeDasharray={isUnlocked(topic.id) ? "0" : "6, 6"}
                    opacity={isUnlocked(topic.id) ? 1 : 0.6}
                  />
                </React.Fragment>
              );
            });
          })}
        </Svg>

        {DSA_TOPICS.map((topic) => (
          <View
            key={topic.id}
            style={{
              position: "absolute",
              left: topic.roadmapPosition.x + NODE_OFFSET_X,
              top: topic.roadmapPosition.y,
            }}
          >
            <RoadmapNode
              topic={topic}
              isUnlocked={isUnlocked(topic.id)}
              isCompleted={!!completedTopics[topic.id]}
              onPress={() =>
                router.push({
                  pathname: "/topic/[id]",
                  params: { id: topic.id },
                })
              }
            />
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Tap a node to continue your journey</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    zIndex: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  statText: {
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  battleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    ...Theme.shadows.md,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  roadmapScroll: {
    flex: 1,
  },
  roadmapContent: {
    paddingTop: 40,
    paddingBottom: 100,
    minHeight: 1000,
  },
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 900,
    zIndex: -1,
  },
  hintContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.md,
  },
  hintText: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
});
