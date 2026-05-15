import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Svg, { Defs, Line, Marker, Polygon } from "react-native-svg";
import { Theme } from "../../theme";

interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightedNodeIds: string[];
  highlightedEdgeIds: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CENTER_X = SCREEN_WIDTH / 2 - 20;
const CENTER_Y = 120;

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  highlightedNodeIds,
  highlightedEdgeIds,
}) => {
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="18"
            refY="3.5"
            orient="auto"
          >
            <Polygon points="0 0, 10 3.5, 0 7" fill={Theme.colors.textMuted} />
          </Marker>
          <Marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="18"
            refY="3.5"
            orient="auto"
          >
            <Polygon points="0 0, 10 3.5, 0 7" fill={Theme.colors.primary} />
          </Marker>
        </Defs>
        {edges.map((edge, index) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const edgeId = `${edge.from}-${edge.to}`;
          const isHighlighted = highlightedEdgeIds.includes(edgeId);

          return (
            <Line
              key={`edge-${index}`}
              x1={CENTER_X + fromNode.x + 20}
              y1={CENTER_Y + fromNode.y + 20}
              x2={CENTER_X + toNode.x + 20}
              y2={CENTER_Y + toNode.y + 20}
              stroke={
                isHighlighted ? Theme.colors.primary : "rgba(255,255,255,0.3)"
              }
              strokeWidth={isHighlighted ? 4 : 2}
              opacity={isHighlighted ? 1 : 0.7}
              markerEnd={`url(#${isHighlighted ? "arrowhead-active" : "arrowhead"})`}
            />
          );
        })}
      </Svg>

      {nodes.map((node) => (
        <GraphNodeComponent
          key={node.id}
          node={node}
          isHighlighted={highlightedNodeIds.includes(node.id)}
        />
      ))}
    </View>
  );
};

const GraphNodeComponent = ({
  node,
  isHighlighted,
}: {
  node: GraphNode;
  isHighlighted: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: CENTER_X + node.x,
      top: CENTER_Y + node.y,
      backgroundColor: withSpring(
        isHighlighted ? Theme.colors.primary : Theme.colors.surface,
      ),
      transform: [{ scale: withSpring(isHighlighted ? 1.2 : 1) }],
      borderColor: withSpring(
        isHighlighted ? Theme.colors.primary : "rgba(255, 255, 255, 0.1)",
      ),
    };
  });

  return (
    <Animated.View style={[styles.node, animatedStyle]}>
      <Text style={styles.nodeValue}>{node.value}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    position: "relative",
  },
  node: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    zIndex: 10,
  },
  nodeValue: {
    color: Theme.colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
});
