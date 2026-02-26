import React, { useEffect, useRef, ReactNode } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Animated, Easing,
} from 'react-native';
import { X, Star, CheckCircle } from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompletionStatItem {
  icon: ReactNode;
  label: string;
  iconBg: string;
}

export interface CompletionModalProps {
  /** Controls visibility */
  visible: boolean;
  /** Dark mode */
  dark?: boolean;
  /** Main title */
  title?: string;
  /** Arabic text shown below title */
  arabic?: string;
  /** Subtitle / body message */
  subtitle?: string;
  /** Footer text (e.g. duaa) */
  footer?: string;
  /** Icon rendered inside the central orb */
  orbIcon?: ReactNode;
  /** Orb background color (default green) */
  orbColor?: string;
  /** Label for the primary CTA button */
  ctaLabel?: string;
  /** Called when the CTA button is pressed */
  onConfirm?: () => void;
  /** Called when the modal is dismissed (backdrop / ✕ button) */
  onClose: () => void;
  /** Optional stat items rendered in the stats row (max 3) */
  stats?: CompletionStatItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompletionModal({
  visible,
  dark = false,
  title       = 'Practice Complete!',
  arabic      = 'الحمد لله',
  subtitle    = 'May Allah accept your devotion and bless you with His mercy.',
  footer      = 'بارك الله فيك',
  orbIcon,
  orbColor    = '#059669',
  ctaLabel    = 'Record Completion',
  onConfirm,
  onClose,
  stats       = [],
}: CompletionModalProps) {

  // ── Animations ──────────────────────────────────────────────────────────────
  const backdropAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim     = useRef(new Animated.Value(0.78)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim   = useRef(new Animated.Value(0)).current;
  const glowAnim      = useRef(new Animated.Value(0)).current;
  const rotateAnim    = useRef(new Animated.Value(0)).current;
  const shimmerAnim   = useRef(new Animated.Value(0)).current;
  const starAnims     = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const statAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const glowLoop  = useRef<Animated.CompositeAnimation | null>(null);
  const shimLoop  = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      // Reset
      backdropAnim.setValue(0);
      scaleAnim.setValue(0.78);
      translateAnim.setValue(40);
      opacityAnim.setValue(0);
      glowAnim.setValue(0);
      rotateAnim.setValue(0);
      shimmerAnim.setValue(0);
      starAnims.forEach(a => a.setValue(0));
      statAnims.forEach(a => a.setValue(0));

      // 1. Backdrop fade
      Animated.timing(backdropAnim, {
        toValue: 1, duration: 300, useNativeDriver: true,
      }).start();

      // 2. Card entrance
      Animated.parallel([
        Animated.spring(scaleAnim,    { toValue: 1,    useNativeDriver: true, damping: 16, stiffness: 200 }),
        Animated.spring(translateAnim,{ toValue: 0,    useNativeDriver: true, damping: 16, stiffness: 200 }),
        Animated.timing(opacityAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start(() => {
        // 3. Orb spin-in
        Animated.timing(rotateAnim, {
          toValue: 1, duration: 600,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }).start();

        // 4. Stars stagger
        Animated.stagger(100,
          starAnims.map(a =>
            Animated.spring(a, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 240 })
          )
        ).start();

        // 5. Stats slide-up stagger
        Animated.stagger(80,
          statAnims.map(a =>
            Animated.spring(a, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 })
          )
        ).start();

        // 6. Glow pulse loop
        glowLoop.current = Animated.loop(
          Animated.sequence([
            // Ligne glow loop
            Animated.timing(glowAnim, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          ])
        );
        glowLoop.current.start();

        // 7. Shimmer loop on CTA
        shimLoop.current = Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            Animated.timing(shimmerAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
            Animated.delay(2000),
          ])
        );
        shimLoop.current.start();
      });

    } else {
      // Stop loops
      glowLoop.current?.stop();
      shimLoop.current?.stop();

      Animated.parallel([
        Animated.timing(scaleAnim,    { toValue: 0.88, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateAnim,{ toValue: 24,   duration: 200, useNativeDriver: true }),
        Animated.timing(opacityAnim,  { toValue: 0,    duration: 180, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0,    duration: 220, useNativeDriver: true }),
      ]).start();
    }

    return () => {
      glowLoop.current?.stop();
      shimLoop.current?.stop();
    };
  }, [visible]);

  // Derived animated values
  const glowScale   = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1,    1.18] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.55] });
  const ringOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.30] });
  const ringScale   = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1,    1.35] });
const orbRotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] });
  const shimmerX    = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-120, 280] });

  const backdropOpacity = backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <Animated.View style={[cm.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* ── Card centerer ─────────────────────────────────────────────────── */}
      <View style={cm.centerer} pointerEvents="box-none">
        <Animated.View style={[
          cm.card,
          dark && cm.cardDark,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateAnim },
            ],
          },
        ]}>

          {/* Top color bar */}
          <View style={[cm.topBar, { backgroundColor: orbColor }]} />

          {/* Close button */}
          <TouchableOpacity style={[cm.closeBtn, dark && cm.closeBtnDark]} onPress={onClose} activeOpacity={0.7}>
            <X color={dark ? '#64748B' : '#94A3B8'} size={16} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* ── Orb ──────────────────────────────────────────────────────── */}
          <View style={cm.orbArea}>
            {/* Outer ring */}
            <Animated.View style={[
              cm.outerRing,
              { borderColor: orbColor, opacity: ringOpacity, transform: [{ scale: ringScale }] },
            ]} />
            {/* Glow */}
            <Animated.View style={[
              cm.orbGlow,
              { backgroundColor: orbColor, opacity: glowOpacity, transform: [{ scale: glowScale }] },
            ]} />
            {/* Orb itself */}
            <Animated.View style={[
              cm.orb,
              { backgroundColor: orbColor, transform: [{ rotate: orbRotate }] },
            ]}>
              {orbIcon ?? <CheckCircle color="#FFFFFF" size={36} strokeWidth={1.8} />}
            </Animated.View>
          </View>

          {/* ── Stars ────────────────────────────────────────────────────── */}
          <View style={cm.starsRow}>
            {([20, 28, 20] as const).map((size, i) => (
              <Animated.View key={i} style={{
                transform: [
                  { scale: starAnims[i] },
                  { rotate: i === 0 ? '-15deg' : i === 2 ? '15deg' : '0deg' },
                ],
              }}>
                <Star color="#F59E0B" size={size} fill="#F59E0B" strokeWidth={1} />
              </Animated.View>
            ))}
          </View>

          {/* ── Title ────────────────────────────────────────────────────── */}
          <Text style={[cm.title, dark && cm.titleDark]}>{title}</Text>

          {/* ── Arabic ───────────────────────────────────────────────────── */}
          {!!arabic && (
            <View style={[cm.arabicWrap, { borderColor: orbColor + '33' }]}>
              <Text style={[cm.arabic, { color: orbColor }]}>{arabic}</Text>
            </View>
          )}

          {/* ── Subtitle ─────────────────────────────────────────────────── */}
          {!!subtitle && (
            <Text style={[cm.subtitle, dark && cm.subtitleDark]}>{subtitle}</Text>
          )}

          {/* ── Stats row ────────────────────────────────────────────────── */}
          {stats.length > 0 && (
            <>
              <View style={[cm.divider, dark && cm.dividerDark]} />
              <View style={cm.statsRow}>
                {stats.slice(0, 3).map((stat, i) => (
                  <React.Fragment key={i}>
                    <Animated.View style={[
                      cm.statItem,
                      {
                        opacity: statAnims[i],
                        transform: [{ translateY: statAnims[i].interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
                      },
                    ]}>
                      <View style={[cm.statIcon, { backgroundColor: stat.iconBg }]}>
                        {stat.icon}
                      </View>
                      <Text style={[cm.statLabel, dark && cm.statLabelDark]}>{stat.label}</Text>
                    </Animated.View>
                    {i < stats.length - 1 && i < 2 && (
                      <View style={[cm.statDivider, dark && cm.statDividerDark]} />
                    )}
                  </React.Fragment>
                ))}
              </View>
              <View style={[cm.divider, dark && cm.dividerDark, { marginTop: 4 }]} />
            </>
          )}

          {/* ── CTA ──────────────────────────────────────────────────────── */}
          {!!onConfirm && (
            <TouchableOpacity
              style={[cm.ctaBtn, { backgroundColor: orbColor }]}
              onPress={onConfirm}
              activeOpacity={0.82}
            >
              {/* Shimmer overlay */}
              <Animated.View style={[
                cm.shimmer,
                { transform: [{ translateX: shimmerX }] },
              ]} />
              <Text style={cm.ctaBtnText}>{ctaLabel}</Text>
            </TouchableOpacity>
          )}

          {/* ── Footer ───────────────────────────────────────────────────── */}
          {!!footer && (
            <Text style={[cm.footer, dark && cm.footerDark]}>{footer}</Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const cm = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 8, 20, 0.72)',
  },
  centerer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },

  // ── Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    paddingHorizontal: 26,
    paddingTop: 42,
    paddingBottom: 26,
    width: '100%',
    maxWidth: 390,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 28,
  },
  cardDark: {
    backgroundColor: '#071A10',
    shadowColor: '#000',
    shadowOpacity: 0.55,
  },

  // Thin colored strip at the very top
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },

  closeBtn: {
    position: 'absolute',
    top: 18, right: 18,
    width: 30, height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnDark: { backgroundColor: '#1E293B' },

  // ── Orb area
  orbArea: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  outerRing: {
    position: 'absolute',
    width: 110, height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
  },
  orbGlow: {
    position: 'absolute',
    width: 88, height: 88,
    borderRadius: 44,
  },
  orb: {
    width: 76, height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },

  // ── Stars
  starsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 18,
  },

  // ── Title
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A1628',
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: 12,
  },
  titleDark: { color: '#F0FDF4' },

  // ── Arabic badge
  arabicWrap: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 14,
  },
  arabic: {
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  // ── Subtitle
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  subtitleDark: { color: '#94A3B8' },

  // ── Divider
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 18,
  },
  dividerDark: { backgroundColor: '#0E2A18' },

  // ── Stats
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 4,
  },
  statIcon: {
    width: 38, height: 38,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },
  statLabelDark: { color: '#94A3B8' },
  statDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
    alignSelf: 'stretch',
    marginVertical: 6,
  },
  statDividerDark: { backgroundColor: '#0E2A18' },

  // ── CTA
  ctaBtn: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  // Shimmer beam
  shimmer: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{ skewX: '-18deg' }],
  },

  // ── Footer
  footer: {
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '500',
  },
  footerDark: { color: '#334155' },
});