import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Filter,
  Grip,
  Info,
  Layers,
  X,
  Zap,
} from 'lucide-react-native';
import { Theme } from '../src/theme';
import {
  ALGORITHM_DETAILS,
  AlgorithmDetail,
  CATEGORIES,
  CategoryId,
} from '../src/constants/AlgorithmData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SortField = 'name' | 'timeWorst' | 'spaceComplexity' | 'category';
type SortOrder = 'asc' | 'desc';

const complexityRank: Record<string, number> = {
  'O(1)': 1,
  'O(log n)': 2,
  'O(n)': 3,
  'O(n log n)': 4,
  'O(n²)': 5,
  'O(V + E)': 3.5,
  'O(h)': 2.5,
  'O(AL)': 3,
};

const getCategoryColor = (category: string): string => {
  const cat = CATEGORIES.find((c) => c.id === category);
  return cat?.color || Theme.colors.primary;
};

const getCategoryLabel = (category: string): string => {
  const cat = CATEGORIES.find((c) => c.id === category);
  return cat?.label || category;
};

const ComplexityBadge = ({
  value,
  variant = 'default',
}: {
  value: string;
  variant?: 'best' | 'average' | 'worst' | 'space' | 'default';
}) => {
  const rank = complexityRank[value] || 3;
  let badgeColor = Theme.colors.success;
  if (rank >= 4) badgeColor = Theme.colors.error;
  else if (rank >= 3) badgeColor = Theme.colors.warning;

  if (variant === 'space') badgeColor = '#06B6D4';

  return (
    <View style={[styles.complexityBadge, { backgroundColor: `${badgeColor}15` }]}>
      <Text style={[styles.complexityText, { color: badgeColor }]}>{value}</Text>
    </View>
  );
};

const BoolBadge = ({ value, label }: { value: boolean; label: string }) => (
  <View
    style={[
      styles.boolBadge,
      {
        backgroundColor: value ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.08)',
        borderColor: value ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.15)',
      },
    ]}
  >
    {value ? (
      <Check size={12} color={Theme.colors.success} />
    ) : (
      <X size={12} color={Theme.colors.error} />
    )}
    <Text
      style={[
        styles.boolText,
        { color: value ? Theme.colors.success : Theme.colors.error },
      ]}
    >
      {label}
    </Text>
  </View>
);

const AlgorithmCard = ({ algo }: { algo: AlgorithmDetail }) => {
  const [expanded, setExpanded] = useState(false);
  const catColor = getCategoryColor(algo.category);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => setExpanded(!expanded)}
    >
      
      <View style={[styles.cardAccent, { backgroundColor: catColor }]} />

      
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.algoName}>{algo.name}</Text>
            <Text style={styles.algoCategory}>{getCategoryLabel(algo.category)}</Text>
          </View>
          <View style={styles.expandIcon}>
            {expanded ? (
              <ChevronUp size={18} color={Theme.colors.textMuted} />
            ) : (
              <ChevronDown size={18} color={Theme.colors.textMuted} />
            )}
          </View>
        </View>
      </View>

      
      <View style={styles.complexityRow}>
        <View style={styles.complexityItem}>
          <View style={styles.complexityLabel}>
            <Zap size={11} color={Theme.colors.success} />
            <Text style={styles.complexityLabelText}>Best</Text>
          </View>
          <ComplexityBadge value={algo.timeBest} variant="best" />
        </View>
        <View style={styles.complexityItem}>
          <View style={styles.complexityLabel}>
            <Clock size={11} color={Theme.colors.warning} />
            <Text style={styles.complexityLabelText}>Avg</Text>
          </View>
          <ComplexityBadge value={algo.timeAverage} variant="average" />
        </View>
        <View style={styles.complexityItem}>
          <View style={styles.complexityLabel}>
            <Zap size={11} color={Theme.colors.error} />
            <Text style={styles.complexityLabelText}>Worst</Text>
          </View>
          <ComplexityBadge value={algo.timeWorst} variant="worst" />
        </View>
        <View style={styles.complexityItem}>
          <View style={styles.complexityLabel}>
            <Database size={11} color="#06B6D4" />
            <Text style={styles.complexityLabelText}>Space</Text>
          </View>
          <ComplexityBadge value={algo.spaceComplexity} variant="space" />
        </View>
      </View>

      
      {expanded && (
        <View style={styles.expandedSection}>
          
          <Text style={styles.descriptionText}>{algo.description}</Text>

          
          <View style={styles.propsRow}>
            <BoolBadge value={algo.stable} label="Stable" />
            <BoolBadge value={algo.inPlace} label="In-place" />
            <BoolBadge value={algo.adaptive} label="Adaptive" />
          </View>

          
          <View style={styles.methodRow}>
            <Grip size={14} color={Theme.colors.textMuted} />
            <Text style={styles.methodLabel}>Method:</Text>
            <View style={styles.methodBadge}>
              <Text style={styles.methodText}>{algo.method}</Text>
            </View>
          </View>

          
          <View style={styles.useCasesSection}>
            <View style={styles.useCasesHeader}>
              <Layers size={14} color={catColor} />
              <Text style={[styles.useCasesTitle, { color: catColor }]}>Use Cases</Text>
            </View>
            <View style={styles.useCasesList}>
              {algo.useCases.map((uc, i) => (
                <View key={i} style={styles.useCaseItem}>
                  <View style={[styles.useCaseDot, { backgroundColor: catColor }]} />
                  <Text style={styles.useCaseText}>{uc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function CompareScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortField, setSortField] = useState<SortField>('category');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result =
      selectedCategory === 'all'
        ? [...ALGORITHM_DETAILS]
        : ALGORITHM_DETAILS.filter((a) => a.category === selectedCategory);

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'timeWorst':
          cmp =
            (complexityRank[a.timeWorst] || 5) - (complexityRank[b.timeWorst] || 5);
          break;
        case 'spaceComplexity':
          cmp =
            (complexityRank[a.spaceComplexity] || 5) -
            (complexityRank[b.spaceComplexity] || 5);
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [selectedCategory, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setShowSortMenu(false);
  };

  const sortOptions: { field: SortField; label: string }[] = [
    { field: 'category', label: 'Category' },
    { field: 'name', label: 'Name (A→Z)' },
    { field: 'timeWorst', label: 'Time Complexity' },
    { field: 'spaceComplexity', label: 'Space Complexity' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Algorithm Reference',
          headerStyle: { backgroundColor: Theme.colors.background },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
        }}
      />

      
      <View style={styles.infoCard}>
        <View style={styles.infoIconCircle}>
          <ArrowDownUp size={24} color={Theme.colors.primary} />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Algorithm Cheat Sheet</Text>
          <Text style={styles.infoSubtitle}>
            Compare {ALGORITHM_DETAILS.length} algorithms across time, space, and properties.
            Tap any card to expand details.
          </Text>
        </View>
      </View>

      
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  isActive && { backgroundColor: cat.color, borderColor: cat.color },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && { color: '#fff', fontWeight: '800' },
                  ]}
                >
                  {cat.label}
                </Text>
                {isActive && cat.id !== 'all' && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>
                      {ALGORITHM_DETAILS.filter((a) => a.category === cat.id).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      
      <View style={styles.sortBar}>
        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>
            {filteredAndSorted.length} algorithm{filteredAndSorted.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <Filter size={14} color={Theme.colors.primary} />
          <Text style={styles.sortButtonText}>
            {sortOptions.find((o) => o.field === sortField)?.label}
          </Text>
          <ChevronDown size={14} color={Theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      
      {showSortMenu && (
        <View style={styles.sortDropdown}>
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.field}
              style={[
                styles.sortOption,
                sortField === opt.field && styles.sortOptionActive,
              ]}
              onPress={() => toggleSort(opt.field)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortField === opt.field && styles.sortOptionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {sortField === opt.field && (
                <Text style={styles.sortDirection}>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      <ScrollView
        style={styles.cardList}
        contentContainerStyle={styles.cardListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAndSorted.map((algo) => (
          <AlgorithmCard key={algo.id} algo={algo} />
        ))}

        
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Theme.colors.success }]} />
              <Text style={styles.legendText}>O(1), O(log n) — Fast</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Theme.colors.warning }]} />
              <Text style={styles.legendText}>O(n), O(n log n) — Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Theme.colors.error }]} />
              <Text style={styles.legendText}>O(n²) — Slow</Text>
            </View>
          </View>
          <View style={styles.legendDivider} />
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <Text style={[styles.legendLabel, { color: Theme.colors.success }]}>Stable</Text>
              <Text style={styles.legendText}>— Preserves equal-element order</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.legendLabel, { color: Theme.colors.success }]}>In-place</Text>
              <Text style={styles.legendText}>— Uses O(1) extra memory</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.legendLabel, { color: Theme.colors.success }]}>Adaptive</Text>
              <Text style={styles.legendText}>— Faster on nearly-sorted data</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.md,
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 18,
  },

  filterSection: {
    marginTop: Theme.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: Theme.spacing.md,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  filterChipText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterCount: {
    marginLeft: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  filterCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  resultCount: {},
  resultCountText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 6,
  },
  sortButtonText: {
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  sortDropdown: {
    position: 'absolute',
    top: 190,
    right: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    zIndex: 100,
    ...Theme.shadows.md,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  sortOptionActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  sortOptionText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  sortOptionTextActive: {
    color: Theme.colors.primary,
  },
  sortDirection: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },

  cardList: {
    flex: 1,
  },
  cardListContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
  },

  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  cardAccent: {
    height: 3,
    width: '100%',
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  algoName: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.3,
  },
  algoCategory: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  expandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  complexityRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  complexityItem: {
    flex: 1,
    alignItems: 'center',
  },
  complexityLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },
  complexityLabelText: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  complexityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  complexityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -0.2,
  },

  expandedSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: 14,
  },
  descriptionText: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  propsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  boolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  boolText: {
    fontSize: 11,
    fontWeight: '700',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  methodLabel: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  methodBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  useCasesSection: {},
  useCasesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  useCasesTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  useCasesList: {
    gap: 6,
  },
  useCaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  useCaseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  useCaseText: {
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '500',
  },

  legendCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  legendRow: {
    gap: 8,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  legendDivider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: 12,
  },
});
