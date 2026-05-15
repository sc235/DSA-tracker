import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { DSA_TOPICS } from '../../src/constants/Topics';
import { QUIZZES } from '../../src/constants/Quizzes';
import { Play, BookOpen, HelpCircle, ChevronLeft, Clock, Zap, Info } from 'lucide-react-native';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const topic = DSA_TOPICS.find(t => t.id === id);

  if (!topic) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color={Theme.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{topic.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerCard}>
          <Text style={styles.topicDescription}>{topic.description}</Text>
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Clock size={16} color={Theme.colors.primary} />
              <Text style={styles.quickStatText}>{topic.complexity}</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Zap size={16} color={Theme.colors.warning} />
              <Text style={styles.quickStatText}>{topic.algorithms.length} Core Algos</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <BookOpen size={20} color={Theme.colors.primary} />
          <Text style={styles.sectionTitle}>Curriculum</Text>
        </View>

        {topic.algorithms.map((algo) => (
          <TouchableOpacity 
            key={algo.id} 
            style={styles.algoCard}
            onPress={() => router.push({
              pathname: "/visualizer/[id]",
              params: { id: algo.id, topicId: topic.id }
            })}
            activeOpacity={0.8}
          >
            <View style={styles.algoContent}>
              <Text style={styles.algoName}>{algo.name}</Text>
              <Text style={styles.algoDesc} numberOfLines={2}>{algo.description}</Text>
              <View style={styles.complexityRow}>
                <View style={styles.complexityLabel}>
                  <Text style={styles.complexityLabelText}>Time: {algo.timeComplexity}</Text>
                </View>
                <View style={[styles.complexityLabel, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Text style={[styles.complexityLabelText, { color: Theme.colors.success }]}>Space: {algo.spaceComplexity}</Text>
                </View>
              </View>
            </View>
            <View style={styles.playButton}>
              <Play size={20} color="white" fill="white" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeader}>
          <HelpCircle size={20} color={Theme.colors.secondary} />
          <Text style={styles.sectionTitle}>Knowledge Check</Text>
        </View>

        <TouchableOpacity 
          style={styles.practiceCard}
          onPress={() => router.push({
            pathname: "/quiz/[id]",
            params: { id: topic.id }
          })}
          activeOpacity={0.8}
        >
          <View style={styles.practiceIconContainer}>
            <Zap size={24} color={Theme.colors.warning} fill={Theme.colors.warning} />
          </View>
          <View style={styles.practiceContent}>
            <Text style={styles.practiceTitle}>Topic Master Quiz</Text>
            <Text style={styles.practiceDesc}>Complete 10 challenges to earn your {topic.title} badge.</Text>
          </View>
          <View style={styles.practiceGo}>
             <Text style={styles.practiceGoText}>GO</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoAlert}>
          <Info size={16} color={Theme.colors.primary} />
          <Text style={styles.infoAlertText}>Completing all algorithms unlocks the master quiz!</Text>
        </View>
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
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  headerCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.md,
  },
  topicDescription: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    lineHeight: 24,
    marginBottom: Theme.spacing.xl,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Theme.borderRadius.lg,
    padding: 12,
  },
  quickStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatText: {
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: Theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    marginLeft: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  algoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  algoContent: {
    flex: 1,
  },
  algoName: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  algoDesc: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  complexityRow: {
    flexDirection: 'row',
  },
  complexityLabel: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  complexityLabelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  practiceCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: Theme.spacing.xl,
  },
  practiceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  practiceDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    lineHeight: 16,
  },
  practiceGo: {
    backgroundColor: Theme.colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  practiceGoText: {
    color: 'black',
    fontWeight: '900',
    fontSize: 12,
  },
  infoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: 12,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
  },
  infoAlertText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  }
});
