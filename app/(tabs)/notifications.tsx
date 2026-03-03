// NotificationsScreen.tsx — redesigned elegant cards
import React, { useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform, StatusBar, Alert,
  Animated,
} from 'react-native';
import {
  Bell, Trash2, CheckCircle2, Flame,
  Star, Info, BellRing, CheckCheck, Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  useNotifications, formatTimestamp,
  getNotificationColor, NotificationType, NotificationData,
} from '@/contexts/NotificationContext';
import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

// ============================================================================
// ICON
// ============================================================================

const NotificationIcon = ({ type, color }: { type: NotificationType; color: string }) => {
  const size = 20;
  switch (type) {
    case 'completion':      return <CheckCircle2 size={size} color={color} strokeWidth={2.2} />;
    case 'streak':          return <Flame        size={size} color={color} strokeWidth={2.2} />;
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':  return <BellRing     size={size} color={color} strokeWidth={2.2} />;
    case 'encouragement':   return <Sparkles     size={size} color={color} strokeWidth={2.2} />;
    default:                return <Info         size={size} color={color} strokeWidth={2.2} />;
  }
};

// ============================================================================
// LABEL
// ============================================================================

const TYPE_LABELS: Record<NotificationType, string> = {
  wird_reminder:    'Wird',
  wazifa_reminder:  'Wazīfa',
  hadra_reminder:   'Hadra',
  completion:       'Done',
  streak:           'Streak',
  encouragement:    'Tip',
  info:             'Info',
};

// ============================================================================
// GROUP HELPERS
// ============================================================================

type Group = { label: string; items: NotificationData[] };

function groupByDate(notifications: NotificationData[]): Group[] {
  const groups: Map<string, NotificationData[]> = new Map();

  notifications.forEach(n => {
    const d   = new Date(n.timestamp);
    const now = new Date();

    let label: string;
    if (isSameDay(d, now)) {
      label = 'Today';
    } else if (isSameDay(d, new Date(now.getTime() - 86_400_000))) {
      label = 'Yesterday';
    } else {
      label = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    }

    const existing = groups.get(label) ?? [];
    groups.set(label, [...existing, n]);
  });

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

// ============================================================================
// CARD
// ============================================================================

interface CardProps {
  notif:  NotificationData;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard = React.memo(({ notif, onRead, onDelete }: CardProps) => {
  const color    = getNotificationColor(notif.type);
  const isUnread = !notif.read;
  const label    = TYPE_LABELS[notif.type] ?? 'Info';

  return (
    <TouchableOpacity
      style={[styles.card, isUnread && styles.cardUnread]}
      onPress={() => onRead(notif.id)}
      activeOpacity={0.75}
    >
      {/* Left accent bar for unread */}
      {isUnread && <View style={[styles.accentBar, { backgroundColor: color }]} />}

      {/* Icon pill */}
      <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
        <NotificationIcon type={notif.type} color={color} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Top row: type label + time */}
        <View style={styles.metaRow}>
          <View style={[styles.typePill, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.typeLabel, { color }]}>{label}</Text>
          </View>
          <Text style={styles.time}>{formatTimestamp(notif.timestamp)}</Text>
        </View>

        {/* Title */}
        <Text
          numberOfLines={1}
          style={[styles.title, isUnread && styles.titleUnread]}
        >
          {notif.title}
        </Text>

        {/* Message */}
        <Text numberOfLines={2} style={styles.message}>
          {notif.message}
        </Text>

        {/* Optional practice badge */}
        {notif.metadata?.practice && (
          <View style={styles.practiceBadge}>
            <Text style={styles.practiceBadgeText}>{notif.metadata.practice.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Delete */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(notif.id)}
        hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      >
        <Trash2 size={15} color="#CBD5E1" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Unread dot */}
      {isUnread && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
    </TouchableOpacity>
  );
});

// ============================================================================
// SCREEN
// ============================================================================

export default function NotificationsScreen() {
  const {
    notifications, markAsRead, markAllAsRead,
    deleteNotification, unreadCount, clearAll,
  } = useNotifications();

  const { handleBack } = useContext(LayoutActionsContext);

  const handleDelete = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    deleteNotification(id);
  }, [deleteNotification]);

  const handleRead = useCallback((id: string) => {
    markAsRead(id);
  }, [markAsRead]);

  const handleMarkAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markAllAsRead();
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear all notifications',
      'This will permanently delete all your notifications.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete all',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearAll();
          },
        },
      ]
    );
  };

  const menuActions = useMemo(() => [
    ...(unreadCount > 0 ? [{
      key:         'markAll',
      label:       'Mark all as read',
      icon:        <CheckCheck color="#059669" size={16} strokeWidth={2} />,
      onPress:     handleMarkAll,
    }] : []),
    ...(notifications.length > 0 ? [{
      key:         'clearAll',
      label:       'Clear all notifications',
      icon:        <Trash2 color="#EF4444" size={16} strokeWidth={2.5} />,
      onPress:     handleClearAll,
      destructive: true,
    }] : []),
  ], [unreadCount, notifications.length]);

  useRegisterHeaderActions('/notifications', menuActions);

  const groups = useMemo(() => groupByDate(notifications), [notifications]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MinimalHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        onBackPress={handleBack}
        showMore={menuActions.length > 0}
        menuActions={menuActions}
        theme="default"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          groups.map(group => (
            <View key={group.label} style={styles.group}>
              {/* Date separator */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorLabel}>{group.label}</Text>
                <View style={styles.separatorLine} />
              </View>

              {group.items.map(notif => (
                <NotificationCard
                  key={notif.id}
                  notif={notif}
                  onRead={handleRead}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyState = () => (
  <View style={styles.empty}>
    <View style={styles.emptyRing}>
      <View style={styles.emptyIconWrap}>
        <Bell color="#94A3B8" size={32} strokeWidth={1.5} />
      </View>
    </View>
    <Text style={styles.emptyTitle}>You're all caught up</Text>
    <Text style={styles.emptySubtitle}>
      Reminders and updates will appear here.
    </Text>
  </View>
);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  scroll: {
    paddingTop: 12,
    paddingHorizontal: 16,
  },

  // ── Groups ────────────────────────────────────────────────────────────────

  group: {
    marginBottom: 8,
  },

  separator: {
    flexDirection:  'row',
    alignItems:     'center',
    marginVertical: 14,
    gap:            10,
  },
  separatorLine: {
    flex:            1,
    height:          1,
    backgroundColor: '#E2E8F0',
  },
  separatorLabel: {
    fontSize:   11,
    fontWeight: '600',
    color:      '#94A3B8',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // ── Card ─────────────────────────────────────────────────────────────────

  card: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius:    18,
    padding:         14,
    marginBottom:    10,
    overflow:        'hidden',
    ...Platform.select({
      ios: {
        shadowColor:   '#64748B',
        shadowOffset:  { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius:  10,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  cardUnread: {
    backgroundColor: '#FFFFFF',
    // subtle tinted border handled by the accent bar instead
  },

  // Left accent stripe for unread
  accentBar: {
    position:     'absolute',
    left:         0,
    top:          0,
    bottom:       0,
    width:        3,
    borderRadius: 18,
  },

  // ── Icon ──────────────────────────────────────────────────────────────────

  iconWrap: {
    width:         44,
    height:        44,
    borderRadius:  14,
    justifyContent: 'center',
    alignItems:    'center',
    marginRight:   12,
    marginLeft:    4,    // compensate for accent bar
    flexShrink:    0,
  },

  // ── Body ──────────────────────────────────────────────────────────────────

  body: {
    flex:           1,
    justifyContent: 'flex-start',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    marginBottom:  5,
  },

  typePill: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      6,
  },
  typeLabel: {
    fontSize:   10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  time: {
    fontSize:   11,
    color:      '#94A3B8',
    fontWeight: '500',
    marginLeft: 'auto',
  },

  title: {
    fontSize:   14,
    fontWeight: '600',
    color:      '#475569',
    marginBottom: 3,
    lineHeight:  19,
  },
  titleUnread: {
    fontWeight: '700',
    color:      '#0F172A',
  },

  message: {
    fontSize:   13,
    color:      '#94A3B8',
    lineHeight: 18,
  },

  practiceBadge: {
    alignSelf:        'flex-start',
    marginTop:        8,
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      6,
    backgroundColor:  '#F1F5F9',
  },
  practiceBadgeText: {
    fontSize:      10,
    fontWeight:    '700',
    color:         '#64748B',
    letterSpacing: 0.5,
  },

  // ── Unread dot ─────────────────────────────────────────────────────────────

  unreadDot: {
    position:     'absolute',
    top:          14,
    right:        40,
    width:        7,
    height:       7,
    borderRadius: 4,
  },

  // ── Delete button ──────────────────────────────────────────────────────────

  deleteBtn: {
    paddingLeft:    10,
    paddingTop:     2,
    justifyContent: 'flex-start',
  },

  // ── Empty state ────────────────────────────────────────────────────────────

  empty: {
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      80,
    paddingHorizontal: 40,
  },
  emptyRing: {
    width:           96,
    height:          96,
    borderRadius:    48,
    backgroundColor: '#F1F5F9',
    justifyContent:  'center',
    alignItems:      'center',
    marginBottom:    24,
    borderWidth:     1,
    borderColor:     '#E2E8F0',
  },
  emptyIconWrap: {
    width:           64,
    height:          64,
    borderRadius:    32,
    backgroundColor: '#E8EEF5',
    justifyContent:  'center',
    alignItems:      'center',
  },
  emptyTitle: {
    fontSize:    18,
    fontWeight:  '700',
    color:       '#1E293B',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize:   14,
    color:      '#94A3B8',
    textAlign:  'center',
    lineHeight: 21,
  },

  bottomSpacer: {
    height: 40,
  },
});