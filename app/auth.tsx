import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../src/theme';
import { useAuthStore } from '../src/store/useAuthStore';
import { supabase } from '../src/services/supabase';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, GitBranch, Cpu, Braces } from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Rect, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Animated Floating Orb ──────────────────────────────────────────────
const FloatingOrb = ({ delay, x, y, size, color }: { delay: number; x: number; y: number; size: number; color: string }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -20, duration: 3000, delay, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 3000, useNativeDriver: true }),
      ])
    );
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 2000, delay: delay + 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 2000, useNativeDriver: true }),
      ])
    );
    floatAnim.start();
    pulseAnim.start();
    return () => { floatAnim.stop(); pulseAnim.stop(); };
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
};

// ── Animated Input with Focus Glow ─────────────────────────────────────
const AnimatedInput = ({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none' as const,
  keyboardType = 'default' as const,
}: {
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric';
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(borderAnim, { toValue: focused ? 1 : 0, duration: 250, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: focused ? 1.02 : 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [focused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(148, 163, 184, 0.08)', Theme.colors.primary],
  });

  const glowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 16 }}>
      {/* Glow effect behind the input */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: 20,
          backgroundColor: Theme.colors.primary,
          opacity: glowOpacity,
        }}
      />
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <Icon size={20} color={focused ? Theme.colors.primary : Theme.colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(148, 163, 184, 0.5)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            {showPassword ? (
              <EyeOff size={20} color={Theme.colors.textMuted} />
            ) : (
              <Eye size={20} color={Theme.colors.textMuted} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

// ── Grid Background Pattern ────────────────────────────────────────────
const GridBackground = () => (
  <Svg style={StyleSheet.absoluteFill} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
    <Defs>
      <LinearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={Theme.colors.background} stopOpacity="0" />
        <Stop offset="0.5" stopColor={Theme.colors.background} stopOpacity="0" />
        <Stop offset="1" stopColor={Theme.colors.background} stopOpacity="1" />
      </LinearGradient>
    </Defs>
    {/* Vertical grid lines */}
    {Array.from({ length: Math.ceil(SCREEN_WIDTH / 50) }).map((_, i) => (
      <Line
        key={`v-${i}`}
        x1={i * 50}
        y1={0}
        x2={i * 50}
        y2={SCREEN_HEIGHT}
        stroke="rgba(99, 102, 241, 0.04)"
        strokeWidth="1"
      />
    ))}
    {/* Horizontal grid lines */}
    {Array.from({ length: Math.ceil(SCREEN_HEIGHT / 50) }).map((_, i) => (
      <Line
        key={`h-${i}`}
        x1={0}
        y1={i * 50}
        x2={SCREEN_WIDTH}
        y2={i * 50}
        stroke="rgba(99, 102, 241, 0.04)"
        strokeWidth="1"
      />
    ))}
    {/* Fade overlay at bottom */}
    <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#gridFade)" />
  </Svg>
);

// ── Feature Pill ───────────────────────────────────────────────────────
const FeaturePill = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <View style={styles.featurePill}>
    <Icon size={14} color={Theme.colors.primary} />
    <Text style={styles.featurePillText}>{label}</Text>
  </View>
);

// ══════════════════════════════════════════════════════════════════════
// ██  AUTH SCREEN  ██
// ══════════════════════════════════════════════════════════════════════
export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardSlide = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();

    // Continuous slow rotation for the logo icon
    Animated.loop(
      Animated.timing(logoRotate, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);

  // Animate toggle between login/signup
  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(cardSlide, { toValue: -20, duration: 150, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
    setIsLogin(!isLogin);
    setName('');
  };

  const handleAuth = async () => {
    if (!email || !password) return;
    if (!isLogin && !name) return;
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        Alert.alert('Success', 'Check your email for the confirmation link!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const spinInterpolation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Background Layers ─── */}
      <GridBackground />

      {/* Floating gradient orbs */}
      <FloatingOrb delay={0} x={-40} y={SCREEN_HEIGHT * 0.1} size={200} color="rgba(99, 102, 241, 0.08)" />
      <FloatingOrb delay={800} x={SCREEN_WIDTH * 0.6} y={SCREEN_HEIGHT * 0.05} size={160} color="rgba(139, 92, 246, 0.06)" />
      <FloatingOrb delay={400} x={SCREEN_WIDTH * 0.3} y={SCREEN_HEIGHT * 0.7} size={220} color="rgba(16, 185, 129, 0.05)" />
      <FloatingOrb delay={1200} x={SCREEN_WIDTH * 0.7} y={SCREEN_HEIGHT * 0.6} size={140} color="rgba(245, 158, 11, 0.04)" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero Section ─── */}
          <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
            {/* Animated Logo */}
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              <View style={styles.logoOuter}>
                <Animated.View style={[styles.logoSpinner, { transform: [{ rotate: spinInterpolation }] }]}>
                  <View style={[styles.logoOrbit, { top: -6, left: '50%', marginLeft: -6 }]} />
                  <View style={[styles.logoOrbit, { bottom: -6, left: '50%', marginLeft: -6 }]} />
                  <View style={[styles.logoOrbit, { left: -6, top: '50%', marginTop: -6 }]} />
                </Animated.View>
                <View style={styles.logoInner}>
                  <Braces size={32} color={Theme.colors.primary} strokeWidth={2.5} />
                </View>
              </View>
            </Animated.View>

            {/* Title */}
            <Text style={styles.brandName}>Algorithm Scientist</Text>
            <Text style={styles.brandTagline}>
              {isLogin ? 'Welcome back, researcher.' : 'Begin your research journey.'}
            </Text>

            {/* Feature pills */}
            <View style={styles.featurePills}>
              <FeaturePill icon={GitBranch} label="Visual Algos" />
              <FeaturePill icon={Cpu} label="AI Tutor" />
              <FeaturePill icon={Braces} label="Battle Arena" />
            </View>
          </Animated.View>

          {/* ── Auth Card ─── */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.add(slideAnim, cardSlide) }],
              },
            ]}
          >
            {/* Toggle Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => !isLogin && toggleMode()}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => isLogin && toggleMode()}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {!isLogin && (
                <AnimatedInput
                  icon={User}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              )}

              <AnimatedInput
                icon={Mail}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <AnimatedInput
                icon={Lock}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {isLogin && (
                <TouchableOpacity style={styles.forgotButton}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.85}
            >
              <View style={styles.authButtonGlow} />
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowRight size={16} color="white" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Placeholder (for future OAuth) */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialEmoji}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialEmoji}>🍎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialEmoji}>🐙</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ── Footer ─── */}
          <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.footerLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ██  STYLES  ██
// ══════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // ── Hero ───
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  logoSpinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoOrbit: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.4)',
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    marginBottom: 16,
  },
  featurePills: {
    flexDirection: 'row',
    gap: 8,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.12)',
    gap: 5,
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },

  // ── Card ───
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
    // Glass effect shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },

  // ── Tabs ───
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  tabTextActive: {
    color: 'white',
  },

  // ── Form ───
  form: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
  },

  // ── Auth Button ───
  authButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    overflow: 'hidden',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  authButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginRight: 10,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Divider ───
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(148, 163, 184, 0.4)',
    marginHorizontal: 12,
    fontWeight: '600',
  },

  // ── Social ───
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  socialEmoji: {
    fontSize: 22,
    color: Theme.colors.text,
    fontWeight: '700',
  },

  // ── Footer ───
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: Theme.colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
