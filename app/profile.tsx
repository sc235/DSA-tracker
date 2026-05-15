import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../src/theme';
import { useAuthStore } from '../src/store/useAuthStore';
import { supabase } from '../src/services/supabase';
import { ProgressService } from '../src/services/progress';
import { LogOut, Trophy, Book, Zap, ChevronRight, Settings, Bell, Shield, CreditCard } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [statsData, setStatsData] = useState({ completedTopics: 0, quizzesTaken: 0, averageAccuracy: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await ProgressService.getUserStats();
        if (stats) setStatsData(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (!user) return null;

  const stats = [
    { label: 'Mastered', value: statsData.completedTopics.toString(), icon: Book, color: Theme.colors.primary },
    { label: 'Accuracy', value: `${Math.round(statsData.averageAccuracy)}%`, icon: Trophy, color: Theme.colors.secondary },
    { label: 'Quizzes', value: statsData.quizzesTaken.toString(), icon: Zap, color: Theme.colors.warning },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{ 
          title: 'Student Profile',
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user.email?.charAt(0).toUpperCase() || 'S'}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Theme.colors.primary} style={{ margin: 40 }} />
        ) : (
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Learning Settings</Text>
          <MenuItem icon={Bell} label="Notifications" />
          <MenuItem icon={Shield} label="Privacy & Security" />
          <MenuItem icon={Settings} label="App Preferences" />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <MenuItem 
            icon={LogOut} 
            label="Sign Out" 
            isLast 
            destructive 
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace('/auth');
            }} 
          />
        </View>

        <Text style={styles.versionText}>v1.2.0 • Pro Edition</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuItem = ({ icon: Icon, label, isLast, destructive, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.menuItem, isLast && styles.menuItemLast]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconContainer, destructive && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
      <Icon size={20} color={destructive ? Theme.colors.error : Theme.colors.text} />
    </View>
    <Text style={[styles.menuItemText, destructive && { color: Theme.colors.error }]}>{label}</Text>
    {!destructive && <ChevronRight size={20} color={Theme.colors.textMuted} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    marginBottom: Theme.spacing.xl,
  },
  avatarGlow: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    marginTop: 4,
    marginBottom: Theme.spacing.lg,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  editButtonText: {
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  menuItemLast: {
    marginBottom: 0,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  versionText: {
    textAlign: 'center',
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginTop: Theme.spacing.lg,
  }
});
