import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { BenchmarkResult } from "../services/benchmarking";
import { Theme } from "../theme";

interface ComplexityGraphProps {
  data: BenchmarkResult[];
  title: string;
}

export const ComplexityGraph: React.FC<ComplexityGraphProps> = ({
  data,
  title,
}) => {
  const width = Dimensions.get("window").width - 60;
  const height = 200;
  const padding = 30;

  if (!data.length) return null;

  const maxTime = Math.max(...data.map((d) => d.time));
  const maxSize = Math.max(...data.map((d) => d.size));

  const getX = (size: number) =>
    padding + (size / maxSize) * (width - 2 * padding);
  const getY = (time: number) =>
    height - padding - (time / maxTime) * (height - 2 * padding);

  const points = data.map((d) => `${getX(d.size)},${getY(d.time)}`).join(" ");
  const pathData = `M ${points}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.graphWrapper}>
        <Svg width={width} height={height}>
          {/* Grid Lines */}
          <Line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Data Line */}
          <Path
            d={pathData}
            fill="none"
            stroke={Theme.colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {data.map((d, i) => (
            <Circle
              key={i}
              cx={getX(d.size)}
              cy={getY(d.time)}
              r="4"
              fill={Theme.colors.primary}
            />
          ))}

          {/* Labels */}
          <SvgText
            x={padding}
            y={height - 5}
            fill={Theme.colors.textMuted}
            fontSize="10"
          >
            Size 0
          </SvgText>
          <SvgText
            x={width - 40}
            y={height - 5}
            fill={Theme.colors.textMuted}
            fontSize="10"
          >
            {maxSize}
          </SvgText>
          <SvgText
            x={0}
            y={padding}
            fill={Theme.colors.textMuted}
            fontSize="10"
          >
            {maxTime.toFixed(2)}ms
          </SvgText>
        </Svg>
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>X-Axis: Input Size (n)</Text>
        <Text style={styles.legendText}>Y-Axis: Execution Time (ms)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  graphWrapper: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  legendText: {
    color: Theme.colors.textMuted,
    fontSize: 10,
    fontStyle: "italic",
  },
});
