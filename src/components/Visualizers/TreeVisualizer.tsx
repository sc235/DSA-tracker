import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  Line,
  LinearGradient,
  Stop
} from "react-native-svg";
import { Theme } from "../../theme";

interface TreeNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
  x: number;
  y: number;
}

interface TreeVisualizerProps {
  nodes: TreeNode[];
  highlightedNodeIds: string[];
  highlightedEdgeIds?: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CENTER_X = SCREEN_WIDTH / 2 - 20;

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  nodes,
  highlightedNodeIds,
  highlightedEdgeIds = [],
}) => {
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="activeEdge" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={Theme.colors.primary} />
            <Stop offset="100%" stopColor={Theme.colors.secondary} />
          </LinearGradient>
        </Defs>
        {nodes.map((node) => {
          const leftChild = nodes.find((n) => n.id === node.leftId);
          const rightChild = nodes.find((n) => n.id === node.rightId);

          const renderEdge = (child: TreeNode, id: string) => {
            const isEdgeHighlighted = highlightedEdgeIds.includes(
              `${node.id}-${child.id}`,
            );
            return (
              <Line
                key={`line-${node.id}-${child.id}`}
                x1={CENTER_X + node.x + 20}
                y1={node.y + 20}
                x2={CENTER_X + child.x + 20}
                y2={child.y + 20}
                stroke={
                  isEdgeHighlighted
                    ? "url(#activeEdge)"
                    : "rgba(255,255,255,0.1)"
                }
                strokeWidth={isEdgeHighlighted ? 4 : 2}
                strokeDasharray={isEdgeHighlighted ? "0" : "4, 4"}
                opacity={isEdgeHighlighted ? 1 : 0.5}
              />
            );
          };

          return (
            <React.Fragment key={`edges-${node.id}`}>
              {leftChild && renderEdge(leftChild, `${node.id}-${leftChild.id}`)}
              {rightChild &&
                renderEdge(rightChild, `${node.id}-${rightChild.id}`)}
            </React.Fragment>
          );
        })}
      </Svg>

      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          isHighlighted={highlightedNodeIds.includes(node.id)}
        />
      ))}
    </View>
  );
};

const TreeNodeComponent = ({
  node,
  isHighlighted,
}: {
  node: TreeNode;
  isHighlighted: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: CENTER_X + node.x,
      top: node.y,
      backgroundColor: withSpring(
        isHighlighted ? Theme.colors.primary : Theme.colors.surface,
        { damping: 12 },
      ),
      transform: [
        { scale: withSpring(isHighlighted ? 1.25 : 1) },
        {
          translateY: isHighlighted
            ? withSequence(withTiming(-5), withSpring(0))
            : 0,
        },
      ],
      borderColor: withSpring(
        isHighlighted ? Theme.colors.secondary : "rgba(255, 255, 255, 0.1)",
      ),
      shadowOpacity: withSpring(isHighlighted ? 0.5 : 0.1),
    };
  });

  return (
    <Animated.View style={[styles.node, animatedStyle]}>
      <Text style={[styles.nodeValue, isHighlighted && styles.highlightedText]}>
        {node.value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: "100%",
    position: "relative",
  },
  node: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    zIndex: 10,
    ...Theme.shadows.md,
  },
  nodeValue: {
    color: Theme.colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  highlightedText: {
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
