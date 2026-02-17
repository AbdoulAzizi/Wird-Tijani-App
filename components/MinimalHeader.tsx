import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar,
  Modal, Animated, Pressable, TouchableWithoutFeedback,
} from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { HeaderAction } from '../contexts/HeaderActionsContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MinimalHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress: () => void;
  onMorePress?: () => void;   // conservé pour usage externe optionnel
  showMore?: boolean;
  menuActions?: HeaderAction[]; // ← NOUVELLE PROP: actions du dropdown
  theme?: 'default' | 'dark' | 'light';
}

const GRADIENTS: Record<string, readonly [string, string]> = {
  default: ['#059669', '#047857'],
  dark:    ['#0F172A', '#1E293B'],
  light:   ['#10B981', '#059669'],
};

// ─── Dropdown Menu ────────────────────────────────────────────────────────────
interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  actions: HeaderAction[];
  anchorPosition: { top: number; right: number };
}

const DropdownMenu = memo(({ visible, onClose, actions, anchorPosition }: DropdownMenuProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(false);

  useEffect(() => {
    if (visible) {
      isMounted.current = true;
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 220,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isMounted.current = false;
      });
    }
  }, [visible]);

  if (!visible && !isMounted.current) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={dd.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                dd.menu,
                {
                  top: anchorPosition.top,
                  right: anchorPosition.right,
                  opacity: opacityAnim,
                  transform: [
                    { scale: scaleAnim },
                    { translateX: 8 },
                    { translateY: -4 },
                  ],
                  transformOrigin: 'top right',
                },
              ]}
            >
              {actions.map((action, index) => (
                <React.Fragment key={action.key}>
                  <TouchableOpacity
                    style={[
                      dd.item,
                      action.destructive && dd.itemDestructive,
                    ]}
                    onPress={() => {
                      onClose();
                      // petit délai pour que l'animation de fermeture soit propre
                      setTimeout(() => action.onPress(), 180);
                    }}
                    activeOpacity={0.7}
                  >
                    {action.icon && (
                      <View style={[
                        dd.iconWrap,
                        action.destructive && dd.iconWrapDestructive,
                      ]}>
                        {action.icon}
                      </View>
                    )}
                    <Text style={[
                      dd.label,
                      action.destructive && dd.labelDestructive,
                    ]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                  {action.dividerAfter && index < actions.length - 1 && (
                    <View style={dd.divider} />
                  )}
                </React.Fragment>
              ))}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});
DropdownMenu.displayName = 'DropdownMenu';

const dd = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  itemDestructive: {
    backgroundColor: 'transparent',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapDestructive: {
    backgroundColor: '#FFF5F5',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  labelDestructive: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 12,
    marginVertical: 4,
  },
});

// ─── MinimalHeader ─────────────────────────────────────────────────────────────
const MinimalHeader = memo(({
  title,
  subtitle,
  onBackPress,
  onMorePress,
  showMore = false,
  menuActions = [],
  theme = 'default',
}: MinimalHeaderProps) => {
  const gradient = (GRADIENTS[theme] ?? GRADIENTS.default) as [string, string];
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, right: 16 });
  const moreButtonRef = useRef<View>(null);

  const handleBack = useCallback(() => onBackPress(), [onBackPress]);

  const handleMorePress = useCallback(() => {
    // Si on a des menuActions, on affiche le dropdown
    if (menuActions.length > 0) {
      moreButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const right = 16;
        const top = pageY + height + 8;
        setAnchorPosition({ top, right });
        setDropdownVisible(true);
      });
    } else {
      // Comportement externe original si pas d'actions
      onMorePress?.();
    }
  }, [menuActions, onMorePress]);

  const closeDropdown = useCallback(() => setDropdownVisible(false), []);

  const hasActions = showMore && (menuActions.length > 0 || onMorePress != null);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={gradient[0]} translucent />
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={ss.container}
      >
        {/* Subtle deco circles */}
        <View style={ss.deco} pointerEvents="none">
          <View style={ss.circle1} />
          <View style={ss.circle2} />
        </View>

        <View style={ss.row}>
          {/* Back */}
          <TouchableOpacity
            style={ss.iconBtn}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft color="#FFFFFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Title */}
          <View style={ss.center}>
            <Text style={ss.title} numberOfLines={1}>{title}</Text>
            {subtitle ? (
              <Text style={ss.subtitle} numberOfLines={1}>{subtitle}</Text>
            ) : null}
          </View>

          {/* More Button / spacer */}
          {hasActions ? (
            <View ref={moreButtonRef} collapsable={false}>
              <TouchableOpacity
                style={[ss.iconBtn, dropdownVisible && ss.iconBtnActive]}
                onPress={handleMorePress}
                activeOpacity={0.7}
                accessibilityLabel="More options"
                accessibilityRole="button"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MoreVertical color="#FFFFFF" size={22} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={ss.spacer} />
          )}
        </View>

        {/* Bottom golden line */}
        <LinearGradient
          colors={['#FCD34D', '#F59E0B', '#FCD34D']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={ss.goldLine}
        />
      </LinearGradient>

      {/* Dropdown portal */}
      <DropdownMenu
        visible={dropdownVisible}
        onClose={closeDropdown}
        actions={menuActions}
        anchorPosition={anchorPosition}
      />
    </>
  );
});
MinimalHeader.displayName = 'MinimalHeader';
export default MinimalHeader;

// ─── Styles ───────────────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight ?? 0) + 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  deco: { ...StyleSheet.absoluteFillObject },
  circle1: {
    position: 'absolute', top: -30, right: -30,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circle2: {
    position: 'absolute', bottom: -20, left: 60,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    zIndex: 1,
    marginBottom: 12,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  iconBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  spacer: { width: 40 },
  center: { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
  title: {
    fontSize: 20, fontWeight: '700',
    color: '#FFFFFF', letterSpacing: 0.3,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 13, fontWeight: '500',
    color: '#D1FAE5', letterSpacing: 0.2,
    textAlign: 'center', marginTop: 3,
  },
  goldLine: { height: 3, borderRadius: 2 },
});