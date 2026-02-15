import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Trash2 } from 'lucide-react-native';
import { useNotifications, formatTimestamp, getNotificationColor, NotificationType } from '@/contexts/NotificationContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NotificationsScreen() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount,
    clearAll
  } = useNotifications();

  const getIcon = (type: NotificationType): string => {
    switch (type) {
      case 'completion':
        return 'checkmark-circle';
      case 'streak':
        return 'flame';
      case 'wird_reminder':
      case 'wazifa_reminder':
      case 'hadra_reminder':
        return 'notifications';
      case 'encouragement':
        return 'star';
      default:
        return 'information-circle';
    }
  };

  const getIconBackground = (type: NotificationType): string => {
    const color = getNotificationColor(type);
    // Convertir la couleur en background light
    switch (type) {
      case 'completion':
        return '#F0FDF4';
      case 'streak':
        return '#FFFBEB';
      case 'wird_reminder':
      case 'wazifa_reminder':
      case 'hadra_reminder':
        return '#EFF6FF';
      case 'encouragement':
        return '#F5F3FF';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.subtitle}>{unreadCount} unread</Text>
            )}
          </View>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={markAllAsRead}
                activeOpacity={0.7}
              >
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearAll}
                activeOpacity={0.7}
              >
                <Trash2 color="#EF4444" size={18} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell color="#9CA3AF" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyMessage}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        ) : (
          notifications.map(notif => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notificationCard,
                !notif.read && styles.notificationCardUnread,
              ]}
              onPress={() => markAsRead(notif.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getIconBackground(notif.type) },
                ]}
              >
                <Ionicons
                  name={getIcon(notif.type) as any}
                  size={24}
                  color={getNotificationColor(notif.type)}
                />
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>{notif.message}</Text>
                <Text style={styles.notificationTime}>
                  {formatTimestamp(notif.timestamp)}
                </Text>
                {notif.metadata && (
                  <View style={styles.metadataContainer}>
                    {notif.metadata.practice && (
                      <View style={styles.metadataBadge}>
                        <Text style={styles.metadataBadgeText}>
                          {notif.metadata.practice}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNotification(notif.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 color="#9CA3AF" size={18} strokeWidth={2} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  markAllButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    paddingLeft: 13,
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metadataBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F0FDF4',
  },
  metadataBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});