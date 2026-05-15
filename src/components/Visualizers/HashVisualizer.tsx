import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { Theme } from '../../theme';
import { Key } from 'lucide-react-native';

interface HashVisualizerProps {
  buckets: (number | null)[];
  activeIndices: number[];
  currentKey?: number;
}

export const HashVisualizer: React.FC<HashVisualizerProps> = ({ buckets, activeIndices, currentKey }) => {
  return (
    <View style={styles.container}>
      {currentKey !== undefined && (
          <View style={styles.inputArea}>
              <View style={styles.inputBox}>
                  <Key size={16} color={Theme.colors.warning} />
                  <Text style={styles.inputText}>Key: {currentKey}</Text>
              </View>
              <View style={styles.arrowContainer}>
                  <Text style={styles.hashLabel}>h(k) = k % 7</Text>
              </View>
          </View>
      )}
      <View style={styles.tableContainer}>
        {buckets.map((val, index) => (
          <Bucket 
            key={index} 
            index={index} 
            value={val} 
            isActive={activeIndices.includes(index)} 
          />
        ))}
      </View>
    </View>
  );
};

const Bucket = ({ index, value, isActive }: { index: number, value: number | null, isActive: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isActive ? 'rgba(99, 102, 241, 0.2)' : Theme.colors.surface),
      borderColor: withSpring(isActive ? Theme.colors.primary : 'rgba(255, 255, 255, 0.1)'),
      transform: [{ scale: withSpring(isActive ? 1.05 : 1) }]
    };
  });

  return (
    <Animated.View style={[styles.bucket, animatedStyle]}>
      <View style={styles.indexTab}>
        <Text style={styles.indexText}>{index}</Text>
      </View>
      <View style={styles.valueArea}>
        {value !== null ? (
            <Animated.View entering={FadeIn} style={styles.valueNode}>
                <Text style={styles.valueText}>{value}</Text>
            </Animated.View>
        ) : (
            <Text style={styles.emptyText}>Empty</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  inputArea: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      gap: 15,
  },
  inputBox: {
      backgroundColor: Theme.colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: Theme.colors.warning,
  },
  inputText: {
      color: Theme.colors.text,
      fontWeight: 'bold',
  },
  arrowContainer: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 8,
  },
  hashLabel: {
      color: Theme.colors.textMuted,
      fontSize: 12,
      fontWeight: 'bold',
  },
  tableContainer: {
    width: '100%',
    gap: 8,
  },
  bucket: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: Theme.spacing.lg,
  },
  indexTab: {
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  indexText: {
    color: Theme.colors.textMuted,
    fontWeight: 'bold',
    fontSize: 12,
  },
  valueArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  valueNode: {
      backgroundColor: Theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
  },
  valueText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    fontStyle: 'italic',
  }
});
