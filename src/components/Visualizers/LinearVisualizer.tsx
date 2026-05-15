import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Theme } from '../../theme';
import { ArrowLeft, ArrowUp } from 'lucide-react-native';

interface LinearVisualizerProps {
  type: 'stack' | 'queue';
  data: number[];
  activeIndex?: number;
}

export const LinearVisualizer: React.FC<LinearVisualizerProps> = ({ type, data, activeIndex }) => {
  if (type === 'stack') {
    return (
      <View style={styles.stackContainer}>
        <View style={styles.stackBody}>
          {[...data].reverse().map((value, index) => {
            const actualIndex = data.length - 1 - index;
            return (
              <AnimatedItem 
                key={`${actualIndex}-${value}`}
                value={value}
                isHighlighted={activeIndex === actualIndex}
                label={actualIndex === data.length - 1 ? 'TOP' : undefined}
                type="stack"
              />
            );
          })}
          {data.length === 0 && <Text style={styles.emptyText}>Stack is Empty</Text>}
        </View>
        <View style={styles.stackBase} />
      </View>
    );
  }

  return (
    <View style={styles.queueContainer}>
      <View style={styles.queueBody}>
        {data.map((value, index) => (
          <AnimatedItem 
            key={`${index}-${value}`}
            value={value}
            isHighlighted={activeIndex === index}
            label={index === 0 ? 'FRONT' : index === data.length - 1 ? 'REAR' : undefined}
            type="queue"
          />
        ))}
        {data.length === 0 && <Text style={styles.emptyText}>Queue is Empty</Text>}
      </View>
    </View>
  );
};

const AnimatedItem = ({ value, isHighlighted, label, type }: { value: number, isHighlighted: boolean, label?: string, type: 'stack' | 'queue' }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isHighlighted ? Theme.colors.secondary : Theme.colors.surface),
      transform: [{ scale: withSpring(isHighlighted ? 1.05 : 1) }],
      borderColor: withSpring(isHighlighted ? Theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'),
    };
  });

  return (
    <Animated.View 
        entering={FadeInDown} 
        exiting={FadeOutUp}
        style={[styles.itemWrapper, type === 'queue' && { flexDirection: 'column-reverse' }]}
    >
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.itemValue}>{value}</Text>
      </Animated.View>
      {label && (
        <View style={[styles.labelContainer, type === 'stack' ? styles.stackLabel : styles.queueLabel]}>
          <Text style={styles.labelText}>{label}</Text>
          {type === 'stack' ? <ArrowLeft size={14} color={Theme.colors.warning} /> : <ArrowUp size={14} color={Theme.colors.warning} />}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stackContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 300,
    width: '100%',
  },
  stackBody: {
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    minWidth: 150,
  },
  stackBase: {
    width: 180,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  queueContainer: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
  },
  queueBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    flexDirection: 'row',
  },
  item: {
    width: 60,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  itemValue: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stackLabel: {
    position: 'absolute',
    left: 80,
    width: 80,
  },
  queueLabel: {
      position: 'absolute',
      top: -30,
      flexDirection: 'column',
  },
  labelText: {
    color: Theme.colors.warning,
    fontSize: 10,
    fontWeight: '900',
  },
  emptyText: {
    color: Theme.colors.textMuted,
    fontStyle: 'italic',
    marginVertical: 40,
  }
});
