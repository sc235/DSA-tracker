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
    case 'arrays': return Layers;
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
    transform: [
        { scale: withSpring(isUnlocked ? 1 : 0.9) },
        { rotate: '45deg' } 
    ],
    opacity: withSpring(isUnlocked ? 1 : 0.6),
  }));

  if (!topic.roadmapPosition) return null;

  return (
    <View style={styles.container}>
      {isUnlocked && !isCompleted && (
          <Animated.View style={[styles.aura, { transform: [{ rotate: '45deg' }] }]} />
      )}
      <Animated.View style={[styles.nodeWrapper, animatedStyle]}>
        <TouchableOpacity 
          style={[
            styles.node,
            isCompleted && styles.completedNode,
            !isUnlocked && styles.lockedNode
          ]}
          onPress={onPress}
          disabled={!isUnlocked}
        >
          <View style={{ transform: [{ rotate: '-45deg' }] }}>
            {isUnlocked ? (
              isCompleted ? (
                <CheckCircle2 color="white" size={30} />
              ) : (
                <Icon color="white" size={30} />
              )
            ) : (
              <Lock color="rgba(255,255,255,0.3)" size={20} />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.label, !isUnlocked && styles.lockedLabel]}>
        {topic.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    opacity: 0.3,
  },
  nodeWrapper: {
    width: 75,
    height: 75,
    borderRadius: 18,
    overflow: 'hidden',
    ...Theme.shadows.lg,
  },
  node: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  completedNode: {
    backgroundColor: Theme.colors.success,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  lockedNode: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    position: 'absolute',
    bottom: -15,
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  lockedLabel: {
    color: Theme.colors.textMuted,
    opacity: 0.5,
  }
});
