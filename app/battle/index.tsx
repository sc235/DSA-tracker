import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { DSA_TOPICS } from '../../src/constants/Topics';
import { Swords, Info, Play, ChevronDown } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BattleSelectionScreen() {
  const router = useRouter();
  const sortingAlgos = DSA_TOPICS.find(t => t.id === 'sorting')?.algorithms || [];
  
  const [algo1, setAlgo1] = useState(sortingAlgos[0]?.id);
  const [algo2, setAlgo2] = useState(sortingAlgos[1]?.id);
  const [dataSize, setDataSize] = useState(10);

  const startBattle = () => {
    router.push({
      pathname: '/battle/visualizer',
      params: { algo1, algo2, size: dataSize }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Algorithm Battle',
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
        }} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introCard}>
            <View style={styles.battleIconCircle}>
                <Swords color={Theme.colors.secondary} size={40} />
            </View>
            <Text style={styles.introTitle}>Pick Your Fighters</Text>
            <Text style={styles.introSubtitle}>
                Compare performance and behavior side-by-side. See which one handles the data more efficiently!
            </Text>
        </View>

        <View style={styles.selectionSection}>
            <Text style={styles.sectionLabel}>CONTENDER #1</Text>
            <View style={styles.pickerContainer}>
                {sortingAlgos.map(algo => (
                    <TouchableOpacity 
                        key={algo.id}
                        style={[styles.pickerItem, algo1 === algo.id && styles.activeItem]}
                        onPress={() => setAlgo1(algo.id)}
                    >
                        <Text style={[styles.itemText, algo1 === algo.id && styles.activeItemText]}>
                            {algo.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.vsDivider}>
                <View style={styles.line} />
                <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>VS</Text>
                </View>
                <View style={styles.line} />
            </View>

            <Text style={styles.sectionLabel}>CONTENDER #2</Text>
            <View style={styles.pickerContainer}>
                {sortingAlgos.map(algo => (
                    <TouchableOpacity 
                        key={algo.id}
                        style={[styles.pickerItem, algo2 === algo.id && styles.activeItem]}
                        onPress={() => setAlgo2(algo.id)}
                    >
                        <Text style={[styles.itemText, algo2 === algo.id && styles.activeItemText]}>
                            {algo.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.configSection}>
            <Text style={styles.sectionLabel}>DATASET SIZE</Text>
            <View style={styles.sizeRow}>
                {[5, 10, 15, 20].map(size => (
                    <TouchableOpacity 
                        key={size}
                        style={[styles.sizeButton, dataSize === size && styles.activeSizeButton]}
                        onPress={() => setDataSize(size)}
                    >
                        <Text style={[styles.sizeText, dataSize === size && styles.activeSizeText]}>
                            {size}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <TouchableOpacity 
            style={[styles.startButton, (algo1 === algo2) && styles.disabledButton]} 
            onPress={startBattle}
            disabled={algo1 === algo2}
        >
            <Play color="white" size={24} fill="white" />
            <Text style={styles.startButtonText}>Engage Battle</Text>
        </TouchableOpacity>
        
        {algo1 === algo2 && (
            <Text style={styles.errorText}>Please select two different algorithms to compare.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  introCard: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  battleIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  selectionSection: {
    marginBottom: Theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerItem: {
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  activeItem: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  itemText: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  activeItemText: {
    color: 'white',
  },
  vsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  vsText: {
    color: Theme.colors.text,
    fontWeight: '900',
    fontSize: 12,
  },
  configSection: {
    marginBottom: Theme.spacing.xxl,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    height: 50,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  activeSizeButton: {
    borderColor: Theme.colors.secondary,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  sizeText: {
    color: Theme.colors.textMuted,
    fontWeight: 'bold',
  },
  activeSizeText: {
    color: Theme.colors.secondary,
  },
  startButton: {
    backgroundColor: Theme.colors.primary,
    height: 60,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  }
});
