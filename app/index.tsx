import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Theme } from '../src/theme';
import { DSA_TOPICS } from '../src/constants/Topics';
import { RoadmapNode } from '../src/components/RoadmapNode';
import { User, Swords, Trophy, Zap } from 'lucide-react-native';
import Svg, { Line } from 'react-native-svg';
import { ProgressService } from '../src/services/progress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    try {
      const stats = await ProgressService.getUserStats();
      if (!stats) return;
      
      setTotalPoints(stats.total_points || 0);
      setCompletedTopics(stats.completedTopics || {});
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const isUnlocked = (topicId: string) => {
    const topic = DSA_TOPICS.find(t => t.id === topicId);
    if (!topic || !topic.prerequisites) return true;
    return topic.prerequisites.every(p => completedTopics[p]);
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
                    <Zap size={14} color={Theme.colors.warning} fill={Theme.colors.warning} />
                    <Text style={styles.statText}>{totalPoints} XP</Text>
                </View>
                <View style={[styles.stat, { marginLeft: 12 }]}>
                    <Trophy size={14} color={Theme.colors.primary} />
                    <Text style={styles.statText}>{Object.values(completedTopics).filter(Boolean).length} Mastered</Text>
                </View>
            </View>
        </View>
        <View style={styles.headerActions}>
            <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/profile')}
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
            {DSA_TOPICS.map(topic => {
                if (!topic.prerequisites) return null;
                return topic.prerequisites.map(pId => {
                    const parent = DSA_TOPICS.find(t => t.id === pId);
                    if (!parent) return null;
                    
                    const startX = parent.roadmapPosition.x + 150 + 50;
                    const startY = parent.roadmapPosition.y + 35;
                    const endX = topic.roadmapPosition.x + 150 + 50;
                    const endY = topic.roadmapPosition.y + 35;

                    return (
                        <Line
                            key={`${pId}-${topic.id}`}
                            x1={startX}
                            y1={startY}
                            x2={endX}
                            y2={endY}
                            stroke={completedTopics[pId] ? Theme.colors.primary : "rgba(255,255,255,0.15)"}
                            strokeWidth="4"
                            strokeDasharray={isUnlocked(topic.id) ? "0" : "8, 8"}
                            opacity={isUnlocked(topic.id) ? 1 : 0.4}
                        />
                    );
                });
            })}
        </Svg>

        {DSA_TOPICS.map((topic) => (
          <RoadmapNode 
            key={topic.id}
            topic={topic}
            isUnlocked={isUnlocked(topic.id)}
            isCompleted={!!completedTopics[topic.id]}
            onPress={() => router.push({
              pathname: "/topic/[id]",
              params: { id: topic.id }
            })}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    zIndex: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  statText: {
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  battleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Theme.shadows.md,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  roadmapScroll: {
    flex: 1,
  },
  roadmapContent: {
    height: 900, 
    paddingTop: 40,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 900,
    zIndex: -1,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
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
    fontWeight: '600',
  }
});
