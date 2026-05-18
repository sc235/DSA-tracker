import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate,
  Easing as ReanimatedEasing,
  FadeInDown
} from 'react-native-reanimated';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../src/theme';
import { Swords, Users, Shield, Zap, Search, ChevronLeft, Send } from 'lucide-react-native';
import { supabase } from '../../src/services/supabase';
import { usePresence } from '../../src/hooks/usePresence';

export default function DuelLobbyScreen() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('Finding an opponent...');
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [incomingChallenge, setIncomingChallenge] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  
  const searchProgress = useSharedValue(0);

  usePresence();

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const channelName = `challenges-${currentUser.id}`;
    let channel: any = null;

    const startSubscription = async () => {
        await supabase.removeChannel(supabase.channel(channelName));

        channel = supabase
            .channel(channelName)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'challenges',
                filter: `challenged_id=eq.${currentUser.id}`
            }, async (payload) => {
                const { data: challenger } = await supabase
                    .from('profiles')
                    .select('username, total_xp')
                    .eq('id', payload.new.challenger_id)
                    .single();
                
                setIncomingChallenge({ ...payload.new, challenger });
            });

        channel.subscribe();
    };

    startSubscription();

    return () => {
        if (channel) {
            supabase.removeChannel(channel);
        }
    };
  }, [currentUser]);

  const fetchUsers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user?.id)
      .gt('last_seen', new Date(Date.now() - 5 * 60000).toISOString()) 
      .order('total_xp', { ascending: false });
    
    setOnlineUsers(data || []);
  };

  const sendChallenge = async (opponentId: string) => {
    if (!currentUser) return;
    
    const { error } = await supabase
      .from('challenges')
      .insert({
        challenger_id: currentUser.id,
        challenged_id: opponentId,
        status: 'pending'
      });
    
    if (!error) {
        setSearchStatus('Challenge Sent! Waiting for response...');
        setIsSearching(true);
    }
  };

  const challengeByEmail = async () => {
    if (!inviteEmail || !currentUser) return;
    setIsSendingInvite(true);

    try {
        const { data: targetUser, error: findError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', inviteEmail.toLowerCase())
            .single();

        if (findError || !targetUser) {
            alert('Student not found. Make sure the email is correct!');
            setIsSendingInvite(false);
            return;
        }

        const { error } = await supabase
            .from('challenges')
            .insert({
                challenger_id: currentUser.id,
                challenged_id: targetUser.id,
                status: 'pending'
            });
        
        if (!error) {
            alert('Challenge sent to ' + inviteEmail + '!');
            setInviteEmail('');
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSendingInvite(false);
    }
  };

  const handleChallengeAction = async (action: 'accepted' | 'rejected') => {
    if (!incomingChallenge) return;

    await supabase
      .from('challenges')
      .update({ status: action })
      .eq('id', incomingChallenge.id);
    
    if (action === 'accepted') {
        router.push({
            pathname: '/duel/game' as any,
            params: { opponent: incomingChallenge.challenger.username, challengeId: incomingChallenge.id }
        });
    }
    setIncomingChallenge(null);
  };
  useEffect(() => {
    if (isSearching) {
      searchProgress.value = withRepeat(
        withTiming(1, { duration: 2000, easing: ReanimatedEasing.linear }),
        -1,
        false
      );

      const timer = setTimeout(() => {
          setSearchStatus('Match Found!');
          setTimeout(() => {
            router.push({
                pathname: '/duel/game' as any,
                params: { opponent: 'CodeWarrior_42' }
            });
            setIsSearching(false);
          }, 1500);
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      searchProgress.value = 0;
    }
  }, [isSearching]);

  const spinStyle = useAnimatedStyle(() => {
    const rotate = interpolate(searchProgress.value, [0, 1], [0, 360]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(searchProgress.value, [0, 1], [1, 1.8]);
    const opacity = interpolate(searchProgress.value, [0, 1], [0.6, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Battle Duels',
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

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        {incomingChallenge && (
            <Animated.View entering={FadeInDown} style={styles.challengeNotification}>
                <View style={styles.challengeInfo}>
                    <Swords size={24} color={Theme.colors.secondary} />
                    <View>
                        <Text style={styles.challengeText}>Incoming Duel!</Text>
                        <Text style={styles.challengerName}>
                            {incomingChallenge.challenger?.username} ({incomingChallenge.challenger?.total_xp} XP)
                        </Text>
                    </View>
                </View>
                <View style={styles.challengeActions}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleChallengeAction('rejected')}
                    >
                        <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.acceptBtn]}
                        onPress={() => handleChallengeAction('accepted')}
                    >
                        <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )}

        <View style={styles.heroSection}>
            <View style={styles.duelIconCircle}>
                <Swords color={Theme.colors.secondary} size={60} />
            </View>
            <Text style={styles.heroTitle}>Multiplayer Arena</Text>
            <Text style={styles.heroSubtitle}>
                Compete in real-time speed coding and algorithm quizzes. Prove you're the fastest!
            </Text>
        </View>

        {!isSearching ? (
            <View style={styles.actionContainer}>
                <TouchableOpacity 
                    style={styles.findMatchButton}
                    onPress={() => setIsSearching(true)}
                >
                    <Search color="white" size={24} />
                    <Text style={styles.findMatchText}>Find Match</Text>
                </TouchableOpacity>

                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Users size={20} color={Theme.colors.primary} />
                        <Text style={styles.statVal}>1,240</Text>
                        <Text style={styles.statLab}>Online</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Shield size={20} color={Theme.colors.success} />
                        <Text style={styles.statVal}>Silver III</Text>
                        <Text style={styles.statLab}>Your Rank</Text>
                    </View>
                </View>
            </View>
        ) : null}

        {!isSearching && (
          <View style={styles.onlineSection}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={Theme.colors.primary} />
              <Text style={styles.sectionTitle}>Online Students</Text>
              <View style={styles.pulseDot} />
            </View>

            
            <View style={styles.emailInviteArea}>
                <TextInput
                    style={styles.emailInput}
                    placeholder="Enter friend's email..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TouchableOpacity 
                    style={styles.emailSendBtn}
                    onPress={challengeByEmail}
                    disabled={isSendingInvite}
                >
                    {isSendingInvite ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Send size={18} color="white" />
                    )}
                </TouchableOpacity>
            </View>
            
            <View style={styles.userList}>
              {onlineUsers.length > 0 ? onlineUsers.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarLetter}>{user.username?.[0]?.toUpperCase() || 'U'}</Text>
                    </View>
                    <View>
                      <Text style={styles.username}>{user.username || 'Anonymous'}</Text>
                      <Text style={styles.userXp}>{user.total_xp || 0} XP</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.challengeIconButton}
                    onPress={() => sendChallenge(user.id)}
                  >
                    <Send size={18} color="white" />
                  </TouchableOpacity>
                </View>
              )) : (
                <Text style={styles.emptyText}>No students online right now. Invite some friends!</Text>
              )}
            </View>
          </View>
        )}

        {isSearching && (
          <View style={styles.searchingContainer}>
            <Animated.View style={[styles.pulseCircle, pulseStyle]} />
            <Animated.View style={spinStyle}>
              <Search color={Theme.colors.primary} size={48} />
            </Animated.View>
            <Text style={styles.statusText}>{searchStatus}</Text>
            <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsSearching(false)}
            >
                <Text style={styles.cancelText}>Cancel Search</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>Arena Rules</Text>
            <View style={styles.ruleRow}>
                <View style={styles.ruleDot} />
                <Text style={styles.ruleText}>10 Questions, 15 seconds each.</Text>
            </View>
            <View style={styles.ruleRow}>
                <View style={styles.ruleDot} />
                <Text style={styles.ruleText}>Accuracy &gt; Speed. Wrong answers end the duel.</Text>
            </View>
            <View style={styles.ruleRow}>
                <View style={styles.ruleDot} />
                <Text style={styles.ruleText}>Winner takes 50 XP, Loser gets 10 XP.</Text>
            </View>
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
  scrollContainer: {
    flex: 1,
  },
  pulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    position: 'absolute',
  },
  content: {
    flex: 1,
    padding: Theme.spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  duelIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Theme.colors.text,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actionContainer: {
    gap: 24,
  },
  findMatchButton: {
    backgroundColor: Theme.colors.secondary,
    height: 64,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    ...Theme.shadows.lg,
  },
  findMatchText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statVal: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  challengeNotification: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Theme.shadows.md,
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  challengeText: {
    color: Theme.colors.secondary,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  challengerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  challengeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  acceptBtn: {
    backgroundColor: Theme.colors.secondary,
  },
  btnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  onlineSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailInviteArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emailInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    height: 40,
  },
  emailSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginLeft: 'auto',
  },
  userList: {
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...Theme.shadows.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userXp: {
    color: Theme.colors.textMuted,
    fontSize: 12,
  },
  challengeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  statLab: {
    color: Theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  searchingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loader: {
    marginBottom: 24,
  },
  statusText: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    color: Theme.colors.error,
    fontWeight: 'bold',
  },
  rulesSection: {
    marginTop: 'auto',
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  rulesTitle: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
    marginRight: 10,
  },
  ruleText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
  }
});
