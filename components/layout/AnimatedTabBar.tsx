// components/layout/AnimatedTabBar.tsx

import { Heart, Timer, BookOpen, Grid3X3, X, Sun, SunMoon, Menu,} from 'lucide-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, Platform, Dimensions,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Svg, {
  Path, Defs, LinearGradient as SvgLinearGradient, Stop, Ellipse,
} from 'react-native-svg';

// ─── Constants ────────────────────────────────────────────────────────────────
const { width: SW } = Dimensions.get('window');
const TAB_COUNT     = 5;
const TAB_BAR_H     = Platform.OS === 'ios' ? 86 : 70;
const ICON_SIZE     = 40;

/** Pixel X du centre du tab logique i (0–4) */
const TAB_PX = (i: number) => (i + 0.5) * (SW / TAB_COUNT);

const TABS_DISPLAY = [
  { routeName: 'index',         label: 'Home',          logIdx: 0, isBurger: false, isWird: false },
  { routeName: 'wird',          label: 'Wird & Wazifa', logIdx: 1, isBurger: false, isWird: true  },
  { routeName: '__menu',        label: 'Menu',          logIdx: 2, isBurger: true,  isWird: false },
  { routeName: 'dhikr-counter', label: 'Dhikr Counter', logIdx: 3, isBurger: false, isWird: false },
  { routeName: 'azkars',        label: 'Azkaars',       logIdx: 4, isBurger: false, isWird: false },
];

// ─── Notch SVG ────────────────────────────────────────────────────────────────
function NotchBarSVG({ cx }: { cx: number }) {
  const W    = SW;
  const H    = TAB_BAR_H;
  const NR   = 26;  // notch radius
  const ND   = 20;  // notch depth
  const CR   = 20;  // corner radius
  const WING = 12;  // smooth transition wing

  const mainPath = [
    `M 0 ${CR}`,
    `Q 0 0 ${CR} 0`,
    `L ${cx - NR - WING} 0`,
    `C ${cx - NR - 4} 0 ${cx - NR} ${ND * 0.3} ${cx - NR} ${ND * 0.7}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${ND * 0.7}`,
    `C ${cx + NR} ${ND * 0.3} ${cx + NR + 4} 0 ${cx + NR + WING} 0`,
    `L ${W - CR} 0`,
    `Q ${W} 0 ${W} ${CR}`,
    `L ${W} ${H}`,
    `L 0 ${H}`,
    `Z`,
  ].join(' ');

  const borderPath = [
    `M 0 0.5`,
    `L ${cx - NR - WING} 0.5`,
    `C ${cx - NR - 4} 0.5 ${cx - NR} ${ND * 0.3} ${cx - NR} ${ND * 0.7}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${ND * 0.7}`,
    `C ${cx + NR} ${ND * 0.3} ${cx + NR + 4} 0.5 ${cx + NR + WING} 0.5`,
    `L ${W} 0.5`,
  ].join(' ');

  const arcPath = [
    `M ${cx - NR} ${ND * 0.7}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${ND * 0.7}`,
  ].join(' ');

  return (
    <Svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <SvgLinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#064E3B" />
          <Stop offset="100%" stopColor="#043D2E" />
        </SvgLinearGradient>
      </Defs>
      <Path d={mainPath}   fill="url(#barGrad)" />
      <Path d={borderPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <Path d={arcPath}    fill="none" stroke="rgba(245,158,11,0.70)"  strokeWidth="1.5" />
      <Ellipse cx={cx} cy={ND * 0.4} rx={NR * 1.1} ry={8} fill="rgba(245,158,11,0.07)" />
    </Svg>
  );
}

// ─── Tab icon ─────────────────────────────────────────────────────────────────
function TabIcon({ routeName, isActive }: { routeName: string; isActive: boolean }) {
  const color = isActive ? '#FFFFFF' : '#A7C4B5';
  const size  = 20;
  const sw    = isActive ? 2.2 : 1.8;

  if (routeName === 'index')         return <Ionicons name="home" color={color} size={size} />;
  if (routeName === 'wird')          return <Heart  color={color} size={size} strokeWidth={sw} />;
  if (routeName === 'dhikr-counter') return <Timer  color={color} size={size} strokeWidth={sw} />;
  if (routeName === 'azkars')        return <SunMoon   color={color} size={size} strokeWidth={sw} />;
  return null;
}

// ─── Animated tab bar ─────────────────────────────────────────────────────────
interface Props {
  state:         any;
  navigation:    any;
  onBurgerPress: () => void;
  onWirdPress:   () => void;
  burgerActive:  boolean;
  unreadCount:   number;
}

export function AnimatedTabBar({ state, navigation, onBurgerPress, onWirdPress, burgerActive, unreadCount }: Props) {
  const focusedRoute = state.routes[state.index]?.name ?? 'index';

  const logicalIndex = (() => {
    if (focusedRoute === 'index')         return 0;
    if (focusedRoute === 'wird')          return 1;
    if (focusedRoute === 'dhikr-counter') return 3;
    if (focusedRoute === 'azkars')        return 4;
    return 0;
  })();

  // Smooth notch animation in absolute pixels
  const targetPx  = TAB_PX(logicalIndex);
  const notchAnim = useRef(new Animated.Value(targetPx)).current;
  const notchVal  = useRef(targetPx);
  const animFrame = useRef(0);

  useEffect(() => {
    const animate = () => {
      notchVal.current += (targetPx - notchVal.current) * 0.14;
      notchAnim.setValue(notchVal.current);
      if (Math.abs(targetPx - notchVal.current) > 0.3)
        animFrame.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animFrame.current); };
  }, [targetPx]);

  const [notchPx, setNotchPx] = useState(targetPx);
  useEffect(() => {
    const id = notchAnim.addListener(({ value }) => setNotchPx(value));
    return () => notchAnim.removeListener(id);
  }, []);

  const navigateTo = (routeName: string) => {
    const event = navigation.emit({
      type:               'tabPress',
      target:             state.routes.find((r: any) => r.name === routeName)?.key,
      canPreventDefault:  true,
    });
    if (!event.defaultPrevented) navigation.navigate(routeName);
  };

  return (
    <View style={{ width: SW, height: TAB_BAR_H }}>
      <NotchBarSVG cx={notchPx} />

      <View style={s.tabRow}>
        {TABS_DISPLAY.map((tab) => {
          if (tab.isBurger) {
            return (
              <TouchableOpacity
                key="menu"
                style={s.tabBtn}
                onPress={onBurgerPress}
                activeOpacity={0.75}
              >
                <View style={[s.burgerCircle, burgerActive && s.burgerCircleActive]}>
                  {burgerActive
                    ? <X       color="#FFFFFF" size={19} strokeWidth={2.5} />
                    // : <Grid3X3 color="#F59E0B" size={18} strokeWidth={2}   />
                    : <Menu color="#F59E0B" size={18} strokeWidth={2}   />
                  }
                  {unreadCount > 0 && (
                    <View style={s.badge}>
                      <Text style={s.badgeTxt}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                    </View>
                  )}
                </View>
                <Text style={[s.label, { color: burgerActive ? '#FCD34D' : '#A7C4B5' }]}>
                  Menu
                </Text>
              </TouchableOpacity>
            );
          }

          const isActive = tab.logIdx === logicalIndex;

          return (
            <TouchableOpacity
              key={tab.routeName}
              style={[s.tabBtn, isActive && s.tabBtnActive]}
              onPress={() => tab.isWird ? onWirdPress() : navigateTo(tab.routeName)}
              activeOpacity={0.8}
            >
              <View style={[s.iconCircle, isActive && s.iconCircleActive]}>
                <TabIcon routeName={tab.routeName} isActive={isActive} />
              </View>
              <Text style={[s.label, isActive && s.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  tabRow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  tabBtn:       { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  tabBtnActive: { transform: [{ translateY: -8 }] },

  iconCircle: {
    width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(167,196,181,0.20)',
  },
  iconCircleActive: {
    backgroundColor: '#065F46',
    borderWidth: 2, borderColor: 'rgba(252,211,77,0.18)',
    shadowColor: '#064E3B', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45, shadowRadius: 8, elevation: 8,
  },

  label:       { fontSize: 10, fontWeight: '600', color: '#A7C4B5', letterSpacing: 0.2 },
  labelActive: { color: '#FCD34D', fontWeight: '700', letterSpacing: 0.3 },

  burgerCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(252,211,77,0.08)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(252,211,77,0.28)',
    position: 'relative', marginBottom: 4,
  },
  burgerCircleActive: {
    backgroundColor: '#065F46',
    borderColor: 'rgba(252,211,77,0.40)',
    shadowColor: '#064E3B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 10, elevation: 10,
  },

  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#EF4444', borderRadius: 7,
    minWidth: 15, height: 15, paddingHorizontal: 2,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#043D2E',
  },
  badgeTxt: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
});