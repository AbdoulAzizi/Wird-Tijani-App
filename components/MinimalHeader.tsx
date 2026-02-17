import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar,
  Modal, Animated, Pressable, TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { HeaderAction } from '../contexts/HeaderActionsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
interface MinimalHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress: () => void;
  onMorePress?: () => void;
  showMore?: boolean;
  menuActions?: HeaderAction[];
  theme?: 'default' | 'dark' | 'light';
}

const GRADIENTS: Record<string, readonly [string, string]> = {
  default: ['#059669', '#047857'],
  dark:    ['#0F172A', '#1E293B'],
  light:   ['#10B981', '#059669'],
};

// ─── Dropdown Menu ────────────────────────────────────────────────────────────
const MENU_WIDTH   = Math.min(240, SCREEN_WIDTH - 32); // jamais + large que l'écran − 32px
const MENU_MARGIN  = 12; // marge par rapport aux bords de l'écran

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  actions: HeaderAction[];
  anchorPosition: { top: number; right: number };
}

const DropdownMenu = memo(({ visible, onClose, actions, anchorPosition }: DropdownMenuProps) => {
  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 260,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          useNativeDriver: true,
          damping: 20,
          stiffness: 300,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 110,
          useNativeDriver: true,
        }),
      ]).start(() => setRendered(false));
    }
  }, [visible]);

  if (!visible && !rendered) return null;

  // ── Le menu est ancré à droite avec right: MENU_MARGIN.
  // On s'assure qu'il ne sort pas du bord gauche non plus.
  const menuRight = Math.max(MENU_MARGIN, anchorPosition.right);

  return (
    <Modal
      transparent
      visible={visible || rendered}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={dd.overlay}>
          {/* Stop propagation pour que le tap sur le menu ne ferme pas */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                dd.menu,
                {
                  top:     anchorPosition.top,
                  right:   menuRight,
                  width:   MENU_WIDTH,       // ← largeur fixe, pas minWidth
                  opacity: opacityAnim,
                  transform: [
                    // Scale depuis le coin haut-droite :
                    // translateX/Y avant le scale pour déplacer l'origine
                    { translateX: MENU_WIDTH / 2 - 12 },
                    { translateY: -8 },
                    { scale: scaleAnim },
                    { translateX: -(MENU_WIDTH / 2 - 12) },
                    { translateY: 8 },
                  ],
                },
              ]}
            >
              {actions.map((action, index) => (
                <React.Fragment key={action.key}>
                  <TouchableOpacity
                    style={[dd.item, action.destructive && dd.itemDestructive]}
                    onPress={() => {
                      onClose();
                      setTimeout(() => action.onPress(), 160);
                    }}
                    activeOpacity={0.7}
                  >
                    {action.icon && (
                      <View style={[dd.iconWrap, action.destructive && dd.iconWrapDestructive]}>
                        {action.icon}
                      </View>
                    )}
                    <Text
                      style={[dd.label, action.destructive && dd.labelDestructive]}
                      numberOfLines={2}      // ← retour à la ligne si texte long
                    >
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
    // width est défini inline avec MENU_WIDTH
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
    // Pas de overflow: 'hidden' → permet aux ombres de s'afficher
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  itemDestructive: {
    // pas de background pour rester propre
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,          // ← l'icône ne se compresse jamais
  },
  iconWrapDestructive: {
    backgroundColor: '#FFF5F5',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    flexShrink: 1,          // ← le texte cède de la place si nécessaire
    flexWrap: 'wrap',
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

// ─── MinimalHeader ────────────────────────────────────────────────────────────
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
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, right: MENU_MARGIN });
  const moreButtonRef = useRef<View>(null);

  const handleBack = useCallback(() => onBackPress(), [onBackPress]);

  const handleMorePress = useCallback(() => {
    if (menuActions.length > 0) {
      moreButtonRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
        // Calcul de la position right à partir du bord droit de l'écran
        const rightEdge = SCREEN_WIDTH - pageX - width;
        const right = Math.max(MENU_MARGIN, rightEdge);
        const top = pageY + height + 8;
        setAnchorPosition({ top, right });
        setDropdownVisible(true);
      });
    } else {
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
        {/* Deco circles */}
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

          {/* More / spacer */}
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

      {/* Dropdown */}
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