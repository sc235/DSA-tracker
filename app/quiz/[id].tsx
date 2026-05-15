import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { ProgressService } from '../../src/services/progress';
import { Check, X, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react-native';
import { AIQuizService } from '../../src/services/aiQuiz';
import { Question } from '../../src/constants/Quizzes';
import { useEffect } from 'react';

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
    // Generate AI Quiz on load
    const generated = AIQuizService.generateQuiz(id as string, 10);
    setQuestions(generated);
    setIsLoading(false);
  }, [id]);

  if (isLoading) return <View style={styles.container}><Text style={styles.questionText}>Generating AI Quiz...</Text></View>;
  if (questions.length === 0) return <Text>Quiz not found</Text>;

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
      // Save results to Supabase
      ProgressService.saveQuizResult(id as string, score, questions.length)
        .catch(err => console.error('Error saving quiz result:', err));
    }
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishedContainer}>
          <Sparkles color={Theme.colors.warning} size={48} style={{ marginBottom: 16 }} />
          <Text style={styles.finishedTitle}>AI Quiz Completed!</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score}/{questions.length}</Text>
          </View>
          <Text style={styles.finishedSubtitle}>
            {score === questions.length ? 'Perfect Score! 🏆' : 'Keep practicing! 💪'}
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => {
              const freshQuestions = AIQuizService.generateQuiz(id as string, 10);
              setQuestions(freshQuestions);
              setCurrentQuestionIndex(0);
              setScore(0);
              setIsFinished(false);
              setSelectedOption(null);
              setShowResult(false);
            }}
          >
            <RotateCcw size={20} color="white" />
            <Text style={styles.buttonText}>Generate New AI Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => router.replace('/')}
          >
            <Home size={20} color={Theme.colors.text} />
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Quiz',
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
        }} 
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sparkles size={12} color={Theme.colors.warning} style={{ marginRight: 4 }} />
                <Text style={[styles.progressText, { color: Theme.colors.warning }]}>AI Generated</Text>
            </View>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isCorrect = option === currentQuestion.correctAnswer;
          const isSelected = option === selectedOption;
          
          let optionStyle = styles.option;
          let textStyle = styles.optionText;
          
          if (showResult) {
            if (isCorrect) {
              optionStyle = [styles.option, styles.correctOption];
              textStyle = [styles.optionText, styles.correctOptionText];
            } else if (isSelected && !isCorrect) {
              optionStyle = [styles.option, styles.wrongOption];
              textStyle = [styles.optionText, styles.wrongOptionText];
            } else {
              optionStyle = [styles.option, styles.disabledOption];
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
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>Explanation</Text>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },
  progressContainer: {
    marginBottom: Theme.spacing.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: Theme.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  progressText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
  },
  questionCard: {
    marginBottom: Theme.spacing.xl,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionText: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  correctOption: {
    borderColor: Theme.colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  correctOptionText: {
    color: Theme.colors.success,
    fontWeight: 'bold',
  },
  wrongOption: {
    borderColor: Theme.colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  wrongOptionText: {
    color: Theme.colors.error,
    fontWeight: 'bold',
  },
  disabledOption: {
    opacity: 0.5,
  },
  explanationCard: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    marginTop: Theme.spacing.md,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  explanationText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: Theme.spacing.lg,
  },
  nextButton: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  finishedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xl,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  finishedSubtitle: {
    fontSize: 18,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.xl,
  },
  button: {
    width: '100%',
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
