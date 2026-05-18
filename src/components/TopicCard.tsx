import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ChevronRight, Layers, Radar, Workflow, GitGraph, Network, LucideIcon } from 'lucide-react-native';
import { Theme } from '../theme';
import { Topic } from '../constants/Topics';

interface TopicCardProps {
  topic: Topic;
  onPress: () => void;
}

const getIcon = (id: string): LucideIcon => {
  switch (id) {
    case 'sorting': return Layers;
    case 'searching': return Radar;
    case 'linked-lists': return Workflow;
    case 'trees': return GitGraph;
    case 'graphs': return Network;
    default: return Layers;
  }
};

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onPress }) => {
  const Icon = getIcon(topic.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon color={Theme.colors.primary} size={24} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{topic.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {topic.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.trainingBadge}>
             <Text style={styles.trainingText}>TRAINING</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
            <Text style={styles.badgeText}>{topic.complexity}</Text>
          </View>
          <Text style={styles.algoCount}>{topic.algorithms.length} Algorithms</Text>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <ChevronRight color={Theme.colors.textMuted} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  content: {
    flex: 1,
  },
  title: {
    color: Theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainingBadge: {
    backgroundColor: '#FF8A3D', 
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  trainingText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
    marginRight: 12,
  },
  badgeText: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  algoCount: {
    color: Theme.colors.textMuted,
    fontSize: 12,
  },
  arrowContainer: {
    marginLeft: Theme.spacing.md,
  }
});
