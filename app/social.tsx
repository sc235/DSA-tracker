import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Theme } from '../src/theme';
import { ProgressService } from '../src/services/progress';
import { Trophy, Award, Target, Swords, Zap, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SocialScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (tab === 'leaderboard') {
        const data = await ProgressService.getLeaderboard();
        setLeaderboard(data);
      } else {
        const data = await ProgressService.getUserAchievements();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, index < 3 && styles.topRankText]}>
          #{index + 1}
        </Text>
      </View>
      <View style={styles.avatarContainer}>
          {item.avatar_url ? (
              <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          ) : (
              <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{item.full_name?.[0] || '?'}</Text>
              </View>
          )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.full_name || 'Anonymous User'}</Text>
        <Text style={styles.userHandle}>@{item.username || 'user'}</Text>
      </View>
      <View style={styles.xpContainer}>
        <Zap size={14} color={Theme.colors.warning} fill={Theme.colors.warning} />
        <Text style={styles.xpText}>{item.total_xp} XP</Text>
      </View>
    </View>
  );

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'target': return <Target color={Theme.colors.primary} size={32} />;
      case 'award': return <Award color={Theme.colors.warning} size={32} />;
      case 'swords': return <Swords color={Theme.colors.secondary} size={32} />;
      default: return <Trophy color={Theme.colors.primary} size={32} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: tab === 'leaderboard' ? 'Global Ranking' : 'My Achievements',
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

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'leaderboard' && styles.activeTab]}
          onPress={() => setTab('leaderboard')}
        >
          <Trophy size={20} color={tab === 'leaderboard' ? 'white' : Theme.colors.textMuted} />
          <Text style={[styles.tabText, tab === 'leaderboard' && styles.activeTabText]}>Ranking</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'achievements' && styles.activeTab]}
          onPress={() => setTab('achievements')}
        >
          <Award size={20} color={tab === 'achievements' ? 'white' : Theme.colors.textMuted} />
          <Text style={[styles.tabText, tab === 'achievements' && styles.activeTabText]}>Badges</Text>
        </TouchableOpacity>
      </View>

      {tab === 'leaderboard' ? (
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={loadData}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No data available yet.</Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.badgesGrid}>
          {achievements.length > 0 ? achievements.map((item, index) => (
            <View key={index} style={styles.badgeCard}>
              <View style={styles.badgeIconCircle}>
                {getAchievementIcon(item.achievements.icon)}
              </View>
              <Text style={styles.badgeTitle}>{item.achievements.title}</Text>
              <Text style={styles.badgeDesc}>{item.achievements.description}</Text>
              <View style={styles.earnedBadge}>
                  <Text style={styles.earnedText}>Earned on {new Date(item.earned_at).toLocaleDateString()}</Text>
              </View>
            </View>
          )) : (
            <View style={styles.emptyContainer}>
                <Award size={64} color={Theme.colors.surfaceLight} style={{ marginBottom: 16 }} />
                <Text style={styles.emptyText}>Keep practicing to earn your first badge!</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    color: Theme.colors.textMuted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    color: Theme.colors.textMuted,
    fontWeight: '900',
    fontSize: 14,
  },
  topRankText: {
    color: Theme.colors.warning,
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  avatarInitial: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  userHandle: {
    color: Theme.colors.textMuted,
    fontSize: 12,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: Theme.colors.warning,
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  badgesGrid: {
    padding: Theme.spacing.md,
    gap: 16,
  },
  badgeCard: {
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderRadius: Theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.md,
  },
  badgeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeDesc: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  earnedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
  },
  earnedText: {
    color: Theme.colors.success,
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: Theme.colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  }
});
