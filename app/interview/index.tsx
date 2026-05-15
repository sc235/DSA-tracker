import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { Mic, Send, Bot, User, ChevronLeft, ShieldCheck, MessageSquare } from 'lucide-react-native';
import { AITutorService } from '../../src/services/aiTutor';
import { VoiceService } from '../../src/services/voiceService';

interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  text: string;
}

export default function InterviewScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'interviewer',
      text: "Hello! I'm your AI Interviewer. Today we'll be discussing Data Structures and Algorithms. To start, could you explain the difference between a Hash Map and a Treemap in terms of time complexity and ordering?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'candidate',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate AI thinking and response
      // In a real app, we'd send the conversation history to Gemini
      const response = await AITutorService.getExplanation(
        `Acting as a technical interviewer, evaluate this answer and ask a follow-up: "${input}"`
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'interviewer',
        text: response
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Interview AI error:', error);
    } finally {
      setIsTyping(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Technical Interview',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft color={Theme.colors.text} size={28} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
        }} 
      />

      <View style={styles.interviewerProfile}>
          <View style={styles.botAvatar}>
              <Bot color={Theme.colors.primary} size={32} />
          </View>
          <View>
              <Text style={styles.interviewerName}>Senior Engineer AI</Text>
              <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Conducting Interview</Text>
              </View>
          </View>
          <View style={styles.spacer} />
          <View style={styles.difficultyBadge}>
              <ShieldCheck size={14} color={Theme.colors.warning} />
              <Text style={styles.difficultyText}>Hard</Text>
          </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.chatContainer}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View 
              key={msg.id} 
              style={[
                styles.messageWrapper, 
                msg.role === 'candidate' ? styles.userWrapper : styles.aiWrapper
              ]}
            >
              {msg.role === 'interviewer' && (
                  <View style={styles.smallAvatar}>
                      <Bot color={Theme.colors.primary} size={16} />
                  </View>
              )}
              <View style={[
                styles.messageBubble, 
                msg.role === 'candidate' ? styles.userBubble : styles.aiBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.role === 'candidate' ? styles.userText : styles.aiText
                ]}>
                  {msg.text}
                </Text>
              </View>
              {msg.role === 'candidate' && (
                  <View style={[styles.smallAvatar, { backgroundColor: Theme.colors.surfaceLight }]}>
                      <User color={Theme.colors.text} size={16} />
                  </View>
              )}
            </View>
          ))}
          {isTyping && (
              <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={Theme.colors.primary} />
                  <Text style={styles.typingText}>Interviewer is analyzing...</Text>
              </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.micButton} onPress={() => {
              // Speak the last interviewer message aloud
              const lastAiMsg = [...messages].reverse().find(m => m.role === 'interviewer');
              if (lastAiMsg) {
                VoiceService.speak(lastAiMsg.text);
              } else {
                Alert.alert('Voice', 'No interviewer message to read aloud yet.');
              }
          }}>
              <Mic color={Theme.colors.textMuted} size={24} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Explain your logic..."
            placeholderTextColor={Theme.colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.disabledSend]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Send color="white" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  interviewerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  botAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  interviewerName: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.success,
    marginRight: 6,
  },
  statusText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
  },
  spacer: {
    flex: 1,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  difficultyText: {
    color: Theme.colors.warning,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: Theme.spacing.md,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    ...Theme.shadows.sm,
  },
  aiBubble: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  userBubble: {
    backgroundColor: Theme.colors.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: Theme.colors.text,
  },
  userText: {
    color: 'white',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 44,
    marginBottom: 20,
  },
  typingText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 30 : Theme.spacing.md,
  },
  micButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: 8,
    color: Theme.colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  disabledSend: {
    opacity: 0.5,
    backgroundColor: Theme.colors.surfaceLight,
  }
});
