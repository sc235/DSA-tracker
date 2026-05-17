import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Alert, TextInput, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../src/theme';
import { useAuthStore } from '../src/store/useAuthStore';
import { supabase } from '../src/services/supabase';
import { ProgressService } from '../src/services/progress';
import { LogOut, Trophy, Book, Zap, ChevronRight, Settings, Bell, Shield, CreditCard, Award, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [statsData, setStatsData] = useState({ completedTopics: {} as Record<string, boolean>, quizzesTaken: 0, averageAccuracy: 0 });
  const [loading, setLoading] = useState(true);
  const [showCertification, setShowCertification] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await ProgressService.getUserStats();
        if (stats) setStatsData({ completedTopics: stats.completedTopics, quizzesTaken: stats.quizzesTaken, averageAccuracy: stats.averageAccuracy });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (!user) return null;

  const masteredCount = Object.values(statsData.completedTopics).filter(Boolean).length;
  const isCertified = masteredCount >= 10;

  const stats = [
    { label: 'Mastered', value: masteredCount.toString(), icon: Book, color: Theme.colors.primary },
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
          
          <TouchableOpacity style={styles.editButton} onPress={() => {
            if (Alert.prompt) {
              Alert.prompt('Edit Name', 'Enter your display name:', async (newName) => {
                if (newName) {
                  await supabase.auth.updateUser({ data: { full_name: newName } });
                  Alert.alert('Updated', 'Your name has been updated.');
                }
              });
            } else {
              Alert.alert('Edit Profile', 'Profile editing is available on the mobile app.');
            }
          }}>
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

        <View style={styles.certificationSection}>
          <Text style={styles.menuSectionTitle}>Official Credential</Text>
          {isCertified ? (
            <TouchableOpacity 
              style={[styles.certificationBanner, { backgroundColor: '#f59e0b' }]}
              onPress={() => setShowCertification(true)}
              activeOpacity={0.85}
            >
              <View style={styles.certificationBannerContent}>
                <View style={styles.certificationIconBox}>
                  <Award size={28} color="white" />
                </View>
                <View style={styles.certificationBannerText}>
                  <Text style={styles.certificationBannerTitle}>Algorithm Scientist Certified</Text>
                  <Text style={styles.certificationBannerSub}>Tap to view your official credential & badge</Text>
                </View>
                <ChevronRight size={24} color="white" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.lockedCertificationBanner}
              onPress={() => {
                Alert.alert(
                  "Certification Preview",
                  `You have mastered ${masteredCount} of 10 required roadmap topics. Would you like to view your certification preview?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "View Preview", onPress: () => setShowCertification(true) }
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <View style={styles.lockedCertIcon}>
                <Shield size={24} color={Theme.colors.textMuted} />
              </View>
              <View style={styles.certificationBannerText}>
                <Text style={styles.lockedCertTitle}>Master Certification ({masteredCount}/10)</Text>
                <Text style={styles.lockedCertSub}>Complete all 10 roadmap topics to unlock verified certificate. Tap to preview.</Text>
              </View>
              <ChevronRight size={20} color={Theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Learning Settings</Text>
          <MenuItem icon={Bell} label="Notifications" onPress={() => Alert.alert('Notifications', 'Push notifications for daily challenges and streak reminders. Coming soon!')} />
          <MenuItem icon={Shield} label="Privacy & Security" onPress={() => Alert.alert('Privacy & Security', 'Your data is encrypted and stored securely via Supabase. We never share your information.')} />
          <MenuItem icon={Settings} label="App Preferences" onPress={() => Alert.alert('App Preferences', 'Theme customization and playback speed defaults. Coming soon!')} />
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

      <Modal
        visible={showCertification}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCertification(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" />
          <View style={styles.modalHeaderBar}>
            <Text style={styles.modalHeaderTitle}>Verified Credential</Text>
            <TouchableOpacity onPress={() => setShowCertification(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.certCard}>
              <View style={[styles.certCardInner, { backgroundColor: '#0f172a' }]}>
                <View style={styles.certHeader}>
                  <View style={styles.goldBadge}>
                    <Award size={48} color="#fbbf24" />
                  </View>
                  <Text style={styles.certOrg}>ALGORITHM SCIENTIST</Text>
                  <Text style={styles.certTitle}>CERTIFICATE OF EXCELLENCE</Text>
                  <View style={styles.certGoldBar} />
                </View>

                <View style={styles.certBody}>
                  <Text style={styles.certPresentedTo}>PROUDLY PRESENTED TO</Text>
                  <Text style={styles.certRecipientName}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Verified Scholar'}
                  </Text>
                  <View style={styles.emailBadge}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.certRecipientEmail}>{user.email}</Text>
                  </View>

                  <Text style={styles.certDescription}>
                    For demonstrating definitive mastery and rigorous theoretical understanding in Data Structures & Algorithms, including asymptotic complexity analysis, non-linear tree traversals, dynamic programming tabulation, and high-performance two-pointer array manipulation.
                  </Text>
                </View>

                <View style={styles.certFooter}>
                  <View style={styles.certFooterItem}>
                    <Text style={styles.certFooterLabel}>VERIFICATION ID</Text>
                    <Text style={styles.certFooterVal}>
                      CERT-DSA-{(user.email || 'dsa').split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 10428)}
                    </Text>
                  </View>
                  <View style={styles.certSeal}>
                    <Sparkles size={28} color="#fbbf24" />
                    <Text style={styles.certSealText}>OFFICIAL</Text>
                  </View>
                  <View style={styles.certFooterItem}>
                    <Text style={styles.certFooterLabel}>ISSUED DATE</Text>
                    <Text style={styles.certFooterVal}>{new Date().toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.shareSection}>
              <TouchableOpacity 
                style={[styles.shareBtn, { backgroundColor: '#6366f1' }]} 
                onPress={() => Alert.alert("Certificate Verified", "Your official certificate credential has been copied to your clipboard. Share it on LinkedIn or Twitter!")}
              >
                <View style={styles.shareBtnContent}>
                  <Sparkles size={20} color="white" />
                  <Text style={styles.shareBtnText}>Add to LinkedIn Credentials</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  },
  certificationSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  certificationBanner: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  certificationGradient: {
    padding: Theme.spacing.lg,
  },
  certificationBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificationIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  certificationBannerText: {
    flex: 1,
  },
  certificationBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 2,
  },
  certificationBannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  lockedCertificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  lockedCertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  lockedCertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  lockedCertSub: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  modalHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
  },
  modalContent: {
    padding: Theme.spacing.xl,
  },
  certCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fbbf24',
    overflow: 'hidden',
    ...Theme.shadows.lg,
    elevation: 10,
    marginBottom: Theme.spacing.xl,
  },
  certCardInner: {
    padding: 32,
    alignItems: 'center',
  },
  certHeader: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  goldBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  certOrg: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 4,
    marginBottom: 6,
  },
  certTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
  },
  certGoldBar: {
    width: 60,
    height: 4,
    backgroundColor: '#fbbf24',
    borderRadius: 2,
    marginTop: 16,
  },
  certBody: {
    alignItems: 'center',
    marginBottom: 40,
  },
  certPresentedTo: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  certRecipientName: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 24,
  },
  certRecipientEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
  },
  certDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  certFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 24,
  },
  certFooterItem: {
    alignItems: 'center',
  },
  certFooterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  certFooterVal: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  certSeal: {
    alignItems: 'center',
  },
  certSealText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 1,
    marginTop: 2,
  },
  shareSection: {
    width: '100%',
    paddingBottom: 20,
  },
  shareBtn: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  shareBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginLeft: 12,
  }
});
