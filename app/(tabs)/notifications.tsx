import React, { useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Star, 
  Info, 
  BellRing,
  CheckCheck
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { 
  useNotifications, 
  formatTimestamp, 
  getNotificationColor, 
  NotificationType 
} from '@/contexts/NotificationContext';

import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

// --- Composant Icone Dynamique ---
const NotificationIcon = ({ type, color }: { type: NotificationType; color: string }) => {
  const size = 22;
  switch (type) {
    case 'completion': return <CheckCircle2 size={size} color={color} />;
    case 'streak': return <Flame size={size} color={color} />;
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder': return <BellRing size={size} color={color} />;
    case 'encouragement': return <Star size={size} color={color} />;
    default: return <Info size={size} color={color} />;
  }
};

export default function NotificationsScreen() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount,
    clearAll
  } = useNotifications();

  const { handleBack } = useContext(LayoutActionsContext);

  // Helper pour les fonds d'icônes
  const getIconBackground = (type: NotificationType): string => {
    const baseColor = getNotificationColor(type);
    return `${baseColor}15`; // Ajoute 10% d'opacité à la couleur hexadécimale
  };

  const handleMarkAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markAllAsRead();
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    deleteNotification(id);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Effacer tout",
      "Voulez-vous supprimer toutes les notifications ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearAll();
          }
        }
      ]
    );
  };

  const menuActions = useMemo(() => [
    ...(unreadCount > 0 ? [{
      key: 'markAll',
      label: 'Mark all as read',
      icon: <CheckCheck color="#059669" size={16} strokeWidth={2} />,
      onPress: handleMarkAll,
    }] : []),
    ...(notifications.length > 0 ? [{
      key: 'clearAll',
      label: 'Clear all notifications',
      icon: <Trash2 color="#EF4444" size={16} strokeWidth={2.5} />,
      onPress: handleClearAll,
      destructive: true,
    }] : []),
  ], [unreadCount, notifications.length, handleMarkAll, handleClearAll]);

  useRegisterHeaderActions('/notifications', menuActions);


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

      {/* Notifications List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Bell color="#9CA3AF" size={40} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyMessage}>
              Nous vous préviendrons dès qu'il y aura du nouveau !
            </Text>
          </View>
        ) : (
          notifications.map(notif => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notificationCard,
                !notif.read && styles.unreadCard,
              ]}
              onPress={() => markAsRead(notif.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground(notif.type) }]}>
                <NotificationIcon type={notif.type} color={getNotificationColor(notif.type)} />
              </View>

              <View style={styles.cardMainContent}>
                <View style={styles.cardHeader}>
                  <Text numberOfLines={1} style={[styles.notifTitle, !notif.read && styles.unreadText]}>
                    {notif.title}
                  </Text>
                  {!notif.read && <View style={styles.unreadIndicator} />}
                </View>

                <Text numberOfLines={2} style={styles.notifMessage}>
                  {notif.message}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.notifTime}>{formatTimestamp(notif.timestamp)}</Text>
                  {notif.metadata?.practice && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{notif.metadata.practice}</Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.inlineDelete}
                onPress={() => handleDelete(notif.id)}
              >
                <Trash2 color="#D1D5DB" size={18} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate 50
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconActionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardMainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  unreadText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginLeft: 8,
  },
  notifMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
  },
  inlineDelete: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});