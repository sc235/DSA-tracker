import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  interpolateColor 
} from 'react-native-reanimated';
import { Theme } from '../../theme';

interface ArrayVisualizerProps {
  data: number[];
  activeIndices: number[];
  comparingIndices: number[];
  swappingIndices: number[];
}

const { width } = Dimensions.get('window');
const BAR_WIDTH_RATIO = 0.8;

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ 
  data, 
  activeIndices, 
  comparingIndices, 
  swappingIndices 
}) => {
  const maxValue = Math.max(...data, 1);
  const barWidth = (width * BAR_WIDTH_RATIO) / data.length - 4;

  return (
    <View style={styles.container}>
      {data.map((value, index) => {
        const isComparing = comparingIndices.includes(index);
        const isSwapping = swappingIndices.includes(index);
        const isActive = activeIndices.includes(index);

        return (
          <Bar 
            key={index} 
            value={value} 
            maxValue={maxValue} 
            width={barWidth}
            status={isSwapping ? 'swapping' : isComparing ? 'comparing' : isActive ? 'active' : 'idle'}
          />
        );
      })}
    </View>
  );
};

interface BarProps {
  value: number;
  maxValue: number;
  width: number;
  status: 'idle' | 'comparing' | 'swapping' | 'active';
}

const Bar: React.FC<BarProps> = ({ value, maxValue, width, status }) => {
  const height = (value / maxValue) * 200;

  const animatedStyle = useAnimatedStyle(() => {
    let color = Theme.colors.primary;
    if (status === 'comparing') color = Theme.colors.warning;
    if (status === 'swapping') color = Theme.colors.secondary;
    if (status === 'active') color = Theme.colors.success;

    return {
      height: withSpring(height),
      backgroundColor: withSpring(color),
    };
  });

  return <Animated.View style={[styles.bar, { width }, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 250,
    width: '100%',
    paddingBottom: 20,
  },
  bar: {
    marginHorizontal: 2,
    borderRadius: 4,
  },
});
