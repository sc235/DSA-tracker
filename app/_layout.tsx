import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import { supabase } from '../src/services/supabase';
import { usePresence } from '../src/hooks/usePresence';
import { NotificationService } from '../src/services/notificationService';

export default function RootLayout() {
  const { user, setUser, setSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  usePresence();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      NotificationService.requestPermissions();
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;

    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === 'auth';

      if (!user && !inAuthGroup) {
        router.replace('/auth');
      } else if (user && inAuthGroup) {
        if (segments.length > 0) {
           router.replace('/');
        }
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [user, segments, navigationState?.key]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="topic/[id]" options={{ title: 'Topic' }} />
      <Stack.Screen name="visualizer/[id]" options={{ title: 'Visualizer' }} />
      <Stack.Screen name="quiz/[id]" options={{ title: 'Quiz' }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="battle/index" options={{ title: 'Battle Arena' }} />
      <Stack.Screen name="battle/visualizer" options={{ title: 'Battle' }} />
      <Stack.Screen name="duel/index" options={{ title: 'Duel' }} />
      <Stack.Screen name="interview/index" options={{ title: 'Interview' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="social" options={{ title: 'Social' }} />
      <Stack.Screen name="compare" options={{ title: 'Compare' }} />
    </Stack>
  );
}
