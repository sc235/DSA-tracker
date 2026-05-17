import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { ProgressService } from '../../src/services/progress';
import { Check, X, ArrowRight, RotateCcw, Home, Sparkles, Brain, Trophy, Zap, ShieldCheck } from 'lucide-react-native';
import { AIQuizService } from '../../src/services/aiQuiz';
import { Question } from '../../src/constants/Quizzes';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generated = AIQuizService.generateQuiz(id as string, 10);
    setQuestions(generated);
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <Stack.Screen options={{ headerShown: false }} />
        <Brain color={Theme.colors.primary} size={48} style={styles.pulseIcon} />
        <Text style={styles.loadingText}>Synthesizing AI Evaluation...</Text>
        <Text style={styles.loadingSubtext}>Generating dynamic adaptive assessment</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Assessment module unavailable</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionPress = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      ProgressService.saveQuizResult(id as string, score, questions.length)
        .catch(err => console.error('Error saving quiz result:', err));
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isMastery = percentage >= 70;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Stack.Screen options={{ headerShown: false }} />
        <Svg style={styles.svgBackground}>
          <Circle cx={SCREEN_WIDTH * 0.85} cy={SCREEN_HEIGHT * 0.15} r="180" fill="rgba(99, 102, 241, 0.08)" />
          <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.65} r="220" fill="rgba(16, 185, 129, 0.05)" />
        </Svg>
        
        <View style={styles.finishedContainer}>
          <View style={styles.finishedBadge}>
            <Trophy color={isMastery ? Theme.colors.warning : Theme.colors.primary} size={36} />
          </View>
          
          <Text style={styles.finishedTitle}>Evaluation Complete</Text>
          <Text style={styles.finishedSubtitle}>Algorithm Scientist Assessment Report</Text>

          <View style={styles.cardContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scorePercentage}>{percentage}%</Text>
              <Text style={styles.scoreFraction}>{score} / {questions.length} correct</Text>
            </View>

            <View style={styles.feedbackBox}>
              <ShieldCheck color={isMastery ? Theme.colors.success : Theme.colors.warning} size={24} />
              <View style={styles.feedbackTextCol}>
                <Text style={styles.feedbackStatus}>{isMastery ? 'Mastery Verified' : 'Review Recommended'}</Text>
                <Text style={styles.feedbackDetail}>
                  {isMastery 
                    ? 'Excellent performance across all conceptual boundaries.' 
                    : 'We recommend revisiting this algorithm module to solidify foundations.'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.finishedActionCol}>
            <TouchableOpacity 
              style={[styles.btn, styles.btnPrimary]} 
              onPress={() => {
                setIsLoading(true);
                setTimeout(() => {
                  const freshQuestions = AIQuizService.generateQuiz(id as string, 10);
                  setQuestions(freshQuestions);
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setIsFinished(false);
                  setSelectedOption(null);
                  setShowResult(false);
                  setIsLoading(false);
                }, 400);
              }}
            >
              <RotateCcw size={20} color="white" />
              <Text style={styles.btnTextPrimary}>Generate New Evaluation</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, styles.btnSecondary]} 
              onPress={() => router.replace('/')}
            >
              <Home size={20} color={Theme.colors.text} />
              <Text style={styles.btnTextSecondary}>Return to Research Portal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{ 
          title: `Assessment Module`,
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
        }} 
      />
      <Svg style={styles.svgBackground}>
        <Circle cx={SCREEN_WIDTH * 0.85} cy={SCREEN_HEIGHT * 0.15} r="180" fill="rgba(99, 102, 241, 0.08)" />
        <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.65} r="220" fill="rgba(16, 185, 129, 0.05)" />
      </Svg>

      <View style={styles.headerArea}>
        <View style={styles.headerHeader}>
          <Text style={styles.questionTrackerText}>
            QUESTION {currentQuestionIndex + 1} OF {questions.length}
          </Text>
          <View style={styles.aiEngineTag}>
            <Sparkles size={12} color={Theme.colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.aiEngineText}>AI ASSESSMENT ENGINE</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionPromptText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsList}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedOption;
            
            let optionStyle: any = [styles.optionCard];
            let textStyle: any = [styles.optionCardText];
            
            if (showResult) {
              if (isCorrect) {
                optionStyle = [styles.optionCard, styles.optionCorrect];
                textStyle = [styles.optionCardText, styles.textCorrect];
              } else if (isSelected && !isCorrect) {
                optionStyle = [styles.optionCard, styles.optionWrong];
                textStyle = [styles.optionCardText, styles.textWrong];
              } else {
                optionStyle = [styles.optionCard, styles.optionDisabled];
              }
            }

            return (
              <TouchableOpacity 
                key={index} 
                style={optionStyle} 
                onPress={() => handleOptionPress(option)}
                disabled={showResult}
              >
                <Text style={textStyle}>{option}</Text>
                {showResult && isCorrect && <Check size={20} color={Theme.colors.success} />}
                {showResult && isSelected && !isCorrect && <X size={20} color={Theme.colors.error} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.explanationBox}>
            <View style={styles.explanationHeader}>
              <Brain size={16} color={Theme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.explanationTitle}>EXPLANATION & ANALYSIS</Text>
            </View>
            <Text style={styles.explanationBody}>{currentQuestion.explanation}</Text>
            
            <TouchableOpacity style={styles.nextActionBtn} onPress={handleNext}>
              <Text style={styles.nextActionText}>
                {currentQuestionIndex === questions.length - 1 ? 'Complete Evaluation' : 'Next Question'}
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
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
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  pulseIcon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
  headerArea: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionTrackerText: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    letterSpacing: 1,
  },
  aiEngineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  aiEngineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
    paddingBottom: 60,
  },
  questionCard: {
    backgroundColor: Theme.colors.surface,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.lg,
  },
  questionPromptText: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
    lineHeight: 30,
    letterSpacing: 0.3,
  },
  optionsList: {
    gap: 14,
  },
  optionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text,
    flex: 1,
    paddingRight: 10,
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: Theme.colors.success,
  },
  textCorrect: {
    color: Theme.colors.success,
    fontWeight: 'bold',
  },
  optionWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: Theme.colors.error,
  },
  textWrong: {
    color: Theme.colors.error,
    fontWeight: 'bold',
  },
  optionDisabled: {
    opacity: 0.4,
  },
  explanationBox: {
    backgroundColor: Theme.colors.surface,
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    marginTop: 24,
    ...Theme.shadows.md,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.primary,
    letterSpacing: 1,
  },
  explanationBody: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    lineHeight: 22,
    marginBottom: 20,
  },
  nextActionBtn: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  nextActionText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  finishedBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  finishedTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  finishedSubtitle: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 32,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    marginBottom: 32,
    ...Theme.shadows.lg,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scorePercentage: {
    fontSize: 54,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  scoreFraction: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    width: '100%',
  },
  feedbackTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  feedbackStatus: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  feedbackDetail: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 18,
  },
  finishedActionCol: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.md,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  btnTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  btnTextSecondary: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
