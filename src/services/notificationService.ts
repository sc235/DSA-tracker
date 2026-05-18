import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { DSA_TOPICS } from '../constants/Topics';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {

  
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted.');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('topic-complete', {
          name: 'Topic Completion',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('topic-unlock', {
          name: 'Topic Unlocked',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 200, 100, 200],
          lightColor: '#10B981',
          sound: 'default',
        });
      }

      return true;
    } else {
      console.log('Notifications require a physical device.');
      return false;
    }
  },

  
  async notifyTopicCompleted(topicId: string): Promise<void> {
    const topic = DSA_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Topic Mastered!',
          body: `You've mastered "${topic.title}"! +50 XP earned. Keep the momentum going!`,
          data: { type: 'topic_completed', topicId },
          sound: 'default',
          ...(Platform.OS === 'android' && { channelId: 'topic-complete' }),
        },
        trigger: null, 
      });
    } catch (error) {
      console.error('Error sending topic completion notification:', error);
    }
  },

  
  async notifyTopicUnlocked(completedTopicId: string): Promise<void> {
    const newlyUnlocked = DSA_TOPICS.filter(t =>
      t.prerequisites?.includes(completedTopicId)
    );

    if (newlyUnlocked.length === 0) return;

    const topicNames = newlyUnlocked.map(t => t.title);
    const body = newlyUnlocked.length === 1
      ? `"${topicNames[0]}" is now available! Tap to start learning.`
      : `${topicNames.length} new topics unlocked: ${topicNames.join(', ')}. Tap to explore!`;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔓 New Topic Unlocked!',
          body,
          data: {
            type: 'topic_unlocked',
            unlockedTopics: newlyUnlocked.map(t => t.id),
          },
          sound: 'default',
          ...(Platform.OS === 'android' && { channelId: 'topic-unlock' }),
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 },
      });
    } catch (error) {
      console.error('Error sending topic unlocked notification:', error);
    }
  },

  
  async onTopicCompleted(topicId: string): Promise<void> {
    await this.notifyTopicCompleted(topicId);
    await this.notifyTopicUnlocked(topicId);
  },
};
