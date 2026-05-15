import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Lock, CheckCircle2, LucideIcon, Layers, Radar, Workflow, GitGraph, Network } from 'lucide-react-native';
import { Theme } from '../theme';
import { Topic } from '../constants/Topics';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface RoadmapNodeProps {
  topic: Topic;
  isUnlocked: boolean;
  isCompleted: boolean;
  onPress: () => void;
}

const getIcon = (id: string): LucideIcon => {
  switch (id) {
    case 'sorting': return Layers;
    case 'searching': return Radar;
    case 'linked-lists': return Workflow;
    case 'stacks-queues': return Layers;
    case 'trees': return GitGraph;
    case 'hash-tables': return Layers;
    case 'heaps': return Layers;
    case 'tries': return GitGraph;
    case 'graphs': return Network;
    case 'dp': return Layers;
    default: return Layers;
  }
};

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({ 
  topic, 
  isUnlocked, 
  isCompleted, 
  onPress 
}) => {
  const Icon = getIcon(topic.id);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isUnlocked ? 1 : 0.9) }],
    opacity: withSpring(isUnlocked ? 1 : 0.6),
  }));

  if (!topic.roadmapPosition) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { left: (topic.roadmapPosition?.x ?? 0) + 150, top: (topic.roadmapPosition?.y ?? 0) },
        animatedStyle
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.node,
          isCompleted && styles.completedNode,
          !isUnlocked && styles.lockedNode
        ]}
        onPress={onPress}
        disabled={!isUnlocked}
      >
        {isUnlocked ? (
          isCompleted ? (
            <CheckCircle2 color="white" size={32} />
          ) : (
            <Icon color="white" size={32} />
          )
        ) : (
          <Lock color="rgba(255,255,255,0.4)" size={24} />
        )}
      </TouchableOpacity>
      <Text style={[styles.label, !isUnlocked && styles.lockedLabel]}>
        {topic.title}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  completedNode: {
    backgroundColor: Theme.colors.success,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  lockedNode: {
    backgroundColor: Theme.colors.surfaceLight,
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  label: {
    marginTop: 8,
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lockedLabel: {
    color: Theme.colors.textMuted,
  }
});
