import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Theme } from '../../theme';
import { ArrowRight } from 'lucide-react-native';

interface Node {
  id: string;
  value: number;
  nextId: string | null;
}

interface NodeVisualizerProps {
  nodes: Node[];
  highlightedNodeIds: string[];
  highlightedPointerIds: string[];
}

export const NodeVisualizer: React.FC<NodeVisualizerProps> = ({ 
  nodes, 
  highlightedNodeIds, 
  highlightedPointerIds 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <View style={styles.nodeWrapper}>
              <AnimatedNode 
                value={node.value} 
                isHighlighted={highlightedNodeIds.includes(node.id)} 
              />
              <Text style={styles.indexText}>{index}</Text>
            </View>
            
            {node.nextId && (
              <AnimatedPointer 
                isHighlighted={highlightedPointerIds.includes(node.id)} 
              />
            )}
          </React.Fragment>
        ))}
        <View style={styles.nullContainer}>
          <Text style={styles.nullText}>NULL</Text>
        </View>
      </View>
    </View>
  );
};

const AnimatedNode = ({ value, isHighlighted }: { value: number; isHighlighted: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isHighlighted ? Theme.colors.secondary : Theme.colors.surface),
      transform: [{ scale: withSpring(isHighlighted ? 1.1 : 1) }],
      borderColor: withSpring(isHighlighted ? Theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'),
    };
  });

  return (
    <Animated.View style={[styles.node, animatedStyle]}>
      <Text style={styles.nodeValue}>{value}</Text>
    </Animated.View>
  );
};

const AnimatedPointer = ({ isHighlighted }: { isHighlighted: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isHighlighted ? 1 : 0.4),
      transform: [{ scaleX: withSpring(isHighlighted ? 1.2 : 1) }],
    };
  });

  return (
    <Animated.View style={[styles.pointer, animatedStyle]}>
      <ArrowRight size={20} color={isHighlighted ? Theme.colors.primary : Theme.colors.textMuted} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  nodeWrapper: {
    alignItems: 'center',
  },
  node: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nodeValue: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  indexText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  pointer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullContainer: {
    paddingHorizontal: Theme.spacing.md,
  },
  nullText: {
    color: Theme.colors.error,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
