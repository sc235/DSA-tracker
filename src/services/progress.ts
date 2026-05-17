import { supabase } from './supabase';
import { NotificationService } from './notificationService';

export const ProgressService = {
  async saveQuizResult(topicId: string, score: number, total: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const accuracy = (score / total) * 100;

    // Save the quiz attempt
    const { error: quizError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        topic_id: topicId,
        score,
        total_questions: total,
        accuracy,
      });

    if (quizError) throw quizError;

    // Award XP
    await this.addXP(score * 10);

    // Update user mastery if score is high enough
    if (score >= 7) {
        console.log(`Mastery reached for ${topicId} (${score}/10). Unlocking next level...`);
        await ProgressService.markTopicCompleted(topicId);
    }

    // Check for "Perfectionist" achievement
    if (score === 10) {
        await this.awardAchievement('perfect-quiz');
    }
  },

  async addXP(amount: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Increment total_xp in profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('id', user.id)
        .single();
    
    const newXP = (profile?.total_xp || 0) + amount;

    await supabase
        .from('profiles')
        .update({ total_xp: newXP })
        .eq('id', user.id);
  },

  async awardAchievement(achievementId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('user_achievements')
        .insert({
            user_id: user.id,
            achievement_id: achievementId
        });
    
    if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error awarding achievement:', error);
    }
  },

  async markTopicCompleted(topicId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        topic_id: topicId,
        algorithm_id: 'TOPIC_MASTERY',
        is_completed: true,
      }, { onConflict: 'user_id,topic_id,algorithm_id' });

    if (error) {
        console.error('Error marking topic completed:', error);
        throw error;
    }
    console.log(`Topic ${topicId} successfully marked as completed in DB.`);
    
    // Award Mastery XP
    await this.addXP(50);

    // 🔔 Send push notifications for topic completion & unlocked topics
    await NotificationService.onTopicCompleted(topicId);
  },

  async getUserStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('id', user.id)
        .single();

    const { data: progress } = await supabase
      .from('user_progress')
      .select('topic_id, is_completed')
      .eq('user_id', user.id);

    const { data: quizzes } = await supabase
      .from('quiz_results')
      .select('topic_id, score, accuracy')
      .eq('user_id', user.id);

    const completedMap: Record<string, boolean> = {};
    progress?.forEach(p => {
        completedMap[p.topic_id] = p.is_completed;
    });

    const topicScores: Record<string, number> = {};
    quizzes?.forEach(q => {
        topicScores[`${q.topic_id}_score`] = Math.max(topicScores[`${q.topic_id}_score`] || 0, q.score);
    });

    return {
      ...topicScores,
      total_points: profile?.total_xp || 0,
      completedTopics: completedMap,
      quizzesTaken: quizzes?.length || 0,
      averageAccuracy: quizzes?.length 
        ? quizzes.reduce((acc, q) => acc + q.accuracy, 0) / quizzes.length 
        : 0
    };
  },

  async getLeaderboard() {
    const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, total_xp')
        .order('total_xp', { ascending: false })
        .limit(10);
    
    if (error) throw error;
    return data;
  },

  async getUserAchievements() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_achievements')
        .select('earned_at, achievements(*)')
        .eq('user_id', user.id);
    
    if (error) throw error;
    return data;
  }
};
