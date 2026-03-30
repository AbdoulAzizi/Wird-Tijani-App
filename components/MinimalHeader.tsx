// components/layout/MinimalHeader.tsx — Wird Tijani
//
// Green brand gradients (default / dark / light).
// Dropdown menu accent: green #059669.
// Identical to the original — duplicated so Rawdat Dhikr can diverge.

import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar,
  Modal, Animated, TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { HeaderAction } from '../contexts/HeaderActionsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MinimalHeaderProps {
  title:        string;
  subtitle?:    string;
  onBackPress:  () => void;
  onMorePress?: () => void;
  showMore?:    boolean;
  menuActions?: HeaderAction[];
  theme?:       'default' | 'dark' | 'light';
}

const GRADIENTS: Record<string, readonly [string, string, string]> = {
  default: ['#064E3B', '#065F46', '#047857'],
  dark:    ['#0A0F1E', '#111827', '#0F172A'],
  light:   ['#047857', '#059669', '#10B981'],
};

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const MENU_WIDTH  = Math.min(240, SCREEN_WIDTH - 32);
const MENU_MARGIN = 12;

interface DropdownMenuProps {
  visible:        boolean;
  onClose:        () => void;
  actions:        HeaderAction[];
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
        Animated.spring(scaleAnim,   { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 260 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 0.88, useNativeDriver: true, damping: 20, stiffness: 300 }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 110, useNativeDriver: true }),
      ]).start(() => setRendered(false));
    }
  }, [visible]);

  if (!visible && !rendered) return null;

  const menuRight = Math.max(MENU_MARGIN, anchorPosition.right);
  return (
    <Modal transparent visible={visible || rendered} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={dd.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[dd.menu, {
              top: anchorPosition.top, right: menuRight, width: MENU_WIDTH,
              opacity: opacityAnim,
              transform: [
                { translateX:  MENU_WIDTH / 2 - 12 },
                { translateY: -8 },
                { scale: scaleAnim },
                { translateX: -(MENU_WIDTH / 2 - 12) },
                { translateY:  8 },
              ],
            }]}>
              {/* Green accent — Wird Tijani brand */}
              <View style={dd.menuAccent} />
              {actions.map((action, index) => (
                <React.Fragment key={action.key}>
                  <TouchableOpacity
                    style={[dd.item, action.destructive && dd.itemDestructive]}
                    onPress={() => { onClose(); setTimeout(() => action.onPress(), 160); }}
                    activeOpacity={0.7}
                  >
                    {action.icon && (
                      <View style={[dd.iconWrap, action.destructive && dd.iconWrapDestructive]}>
                        {action.icon}
                      </View>
                    )}
                    <Text style={[dd.label, action.destructive && dd.labelDestructive]} numberOfLines={2}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                  {action.dividerAfter && index < actions.length - 1 && <View style={dd.divider} />}
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
  overlay:             { flex: 1, backgroundColor: 'transparent' },
  menu:                { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 16, paddingTop: 0, paddingBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 24, elevation: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', overflow: 'hidden' },
  // Green accent bar
  menuAccent:          { height: 3, backgroundColor: '#059669', marginBottom: 4 },
  item:                { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14, gap: 10 },
  itemDestructive:     {},
  iconWrap:            { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  iconWrapDestructive: { backgroundColor: '#FFF5F5' },
  label:               { fontSize: 14, fontWeight: '600', color: '#1E293B', flexShrink: 1, flexWrap: 'wrap' },
  labelDestructive:    { color: '#EF4444' },
  divider:             { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 12, marginVertical: 3 },
});

// ─── MinimalHeader ────────────────────────────────────────────────────────────
const MinimalHeader = memo(({
  title, subtitle, onBackPress, onMorePress,
  showMore = false, menuActions = [], theme = 'default',
}: MinimalHeaderProps) => {
  const grad = (GRADIENTS[theme] ?? GRADIENTS.default) as [string, string, string];
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorPosition,  setAnchorPosition]  = useState({ top: 0, right: MENU_MARGIN });
  const moreButtonRef = useRef<View>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => { Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, []);

  const handleMorePress = useCallback(() => {
    if (menuActions.length > 0) {
      moreButtonRef.current?.measure((_x, _y, w, h, pageX, pageY) => {
        setAnchorPosition({ top: pageY + h + 8, right: Math.max(MENU_MARGIN, SCREEN_WIDTH - pageX - w) });
        setDropdownVisible(true);
      });
    } else { onMorePress?.(); }
  }, [menuActions, onMorePress]);

  const hasActions = showMore && (menuActions.length > 0 || onMorePress != null);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={grad[0]} translucent />
      <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ss.container}>
        <View style={ss.deco} pointerEvents="none">
          <View style={ss.circle1} /><View style={ss.circle2} />
        </View>
        <Animated.View style={[ss.inner, { opacity: fadeIn }]}>
          <View style={ss.row}>
            <TouchableOpacity style={ss.iconBtn} onPress={onBackPress} activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <ArrowLeft color="#FFFFFF" size={20} strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={ss.center}>
              <Text style={ss.title} numberOfLines={1}>{title}</Text>
              {subtitle ? <Text style={ss.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
            </View>
            {hasActions ? (
              <View ref={moreButtonRef} collapsable={false}>
                <TouchableOpacity style={[ss.iconBtn, dropdownVisible && ss.iconBtnActive]}
                  onPress={handleMorePress} activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                  <MoreVertical color="#FFFFFF" size={20} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            ) : <View style={ss.spacer} />}
          </View>
        </Animated.View>
        {/* Gold shimmer line */}
        <LinearGradient
          colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={ss.goldLine}
        />
      </LinearGradient>
      <DropdownMenu visible={dropdownVisible} onClose={() => setDropdownVisible(false)}
        actions={menuActions} anchorPosition={anchorPosition} />
    </>
  );
});
MinimalHeader.displayName = 'MinimalHeader';
export default MinimalHeader;

const ss = StyleSheet.create({
  container: { paddingTop: Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight ?? 0) + 12, overflow: 'hidden' },
  inner:     { paddingHorizontal: 16, paddingBottom: 14 },
  deco:      { ...StyleSheet.absoluteFillObject },
  circle1:   { position: 'absolute', top: -40,  right: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)' },
  circle2:   { position: 'absolute', bottom: -20, left: 50, width: 70,  height: 70,  borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.04)' },
  row:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, zIndex: 1 },
  iconBtn:   { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  iconBtnActive: { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.40)' },
  spacer:    { width: 38 },
  center:    { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
  title:     { fontSize: 19, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  subtitle:  { fontSize: 11, fontWeight: '500', color: 'rgba(209,250,229,0.85)', textAlign: 'center', marginTop: 3, letterSpacing: 0.1 },
  goldLine:  { height: 3, opacity: 0.7 },
});