import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Dimensions,
  Animated, Pressable, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;

const GREEN_MID  = '#065F46';
const GOLD       = '#F59E0B';
const GOLD_LIGHT = '#FDE68A';

// ─── Section ──────────────────────────────────────────────────────────────────
export function Section({ label, children, bg }: {
  label: string; children: React.ReactNode; bg?: string;
}) {
  return (
    <View style={[ds.section, bg ? { backgroundColor: bg, borderRadius: 14, padding: 14 } : null]}>
      <View style={ds.sectionLabelRow}>
        <View style={ds.sectionBar} />
        <Text style={ds.sectionLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

// ─── Arabic Block ─────────────────────────────────────────────────────────────
export function ArabicBlock({ text }: { text: string }) {
  return (
    <View style={ds.arabicWrap}>
      <LinearGradient
        colors={['#064E3B', '#065F46', '#047857']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={ds.arabicGrad}
      >
        <View style={ds.arabicDeco} pointerEvents="none">
          <View style={ds.arabicC1} />
          <View style={ds.arabicC2} />
        </View>
        <Text style={ds.arabicText}>{text}</Text>
        <View style={ds.arabicGoldLine}>
          <LinearGradient
            colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

// ─── Bullet List ──────────────────────────────────────────────────────────────
export function BulletList({ items, color = GREEN_MID }: {
  items: string[]; color?: string;
}) {
  return (
    <View style={ds.bulletList}>
      {items.map((item, i) => (
        <View key={i} style={ds.bulletRow}>
          <View style={[ds.bullet, { backgroundColor: color }]} />
          <Text style={ds.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Info Chip ────────────────────────────────────────────────────────────────
export function InfoChip({ icon, label, value }: {
  icon: React.ReactNode; label: string; value: string;
}) {
  return (
    <View style={ds.chip}>
      <View style={ds.chipIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={ds.chipLabel}>{label}</Text>
        <Text style={ds.chipValue} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Detail Shell ─────────────────────────────────────────────────────────────
interface DetailShellProps {
  visible:   boolean;
  onClose:   () => void;
  title:     string;
  subtitle?: string;
  gradient?: [string, string, string];
  children:  React.ReactNode;
}

export default function DetailShell({
  visible, onClose,
  title, subtitle,
  gradient = ['#064E3B', '#065F46', '#047857'],
  children,
}: DetailShellProps) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 24,
            stiffness: 200,
            mass: 0.9,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  if (!mounted && !visible) return null;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* ── Backdrop ── */}
      <Animated.View style={[ds.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* ── Sheet ── */}
      <Animated.View style={[ds.sheet, { transform: [{ translateY }] }]}>

        {/* Gradient header */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={ds.header}
        >
          {/* Deco circles */}
          <View style={ds.headerDeco} pointerEvents="none">
            <View style={ds.hc1} />
            <View style={ds.hc2} />
          </View>

          {/* ── Handle row: spacer | handle | close btn ── */}
          <View style={ds.headerTop}>
            {/* Left spacer — même taille que closeBtn pour centrer le handle */}
            <View style={ds.closeBtnSpacer} />

            <View style={ds.handle} />

            <TouchableOpacity
              onPress={onClose}
              style={ds.closeBtn}
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X color="#FFFFFF" size={15} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={ds.headerTitle}>{title}</Text>

          {/* Subtitle */}
          {subtitle ? (
            <Text style={ds.headerSubtitle}>{subtitle}</Text>
          ) : null}

          {/* Gold line */}
          <View style={ds.headerGold}>
            <LinearGradient
              colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </LinearGradient>

        {/* ── Scrollable content ── */}
        <ScrollView
          style={ds.scroll}
          contentContainerStyle={ds.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
          keyboardShouldPersistTaps="handled"
        >
          {children}
          <View style={{ height: Platform.OS === 'ios' ? 48 : 32 }} />
        </ScrollView>

      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ds = StyleSheet.create({

  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  // Sheet
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 28,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  headerDeco: { ...StyleSheet.absoluteFillObject },
  hc1: {
    position: 'absolute', top: -40, right: -30,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  hc2: {
    position: 'absolute', bottom: -25, left: 20,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  // Handle row — space-between: spacer | handle | closeBtn
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginBottom: 16,
  },
  handle: {
    width: 38, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  // Invisible placeholder — même dimensions que closeBtn
  closeBtnSpacer: {
    width: 30, height: 30,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 27,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  headerGold: {
    height: 2,
    marginTop: 16,
    opacity: 0.65,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    gap: 22,
  },

  // ── Section ──
  section: { gap: 10 },
  sectionLabelRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 7, marginBottom: 4,
  },
  sectionBar: {
    width: 3, height: 13, borderRadius: 2,
    backgroundColor: GREEN_MID,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: 1,
  },

  // ── Arabic block ──
  arabicWrap: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18, shadowRadius: 10, elevation: 6,
  },
  arabicGrad: {
    padding: 24, alignItems: 'center', overflow: 'hidden',
  },
  arabicDeco: { ...StyleSheet.absoluteFillObject },
  arabicC1: {
    position: 'absolute', top: -20, right: -20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  arabicC2: {
    position: 'absolute', bottom: -15, left: 10,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  arabicText: {
    fontSize: 20, textAlign: 'center',
    color: '#FFFFFF', lineHeight: 36, fontWeight: '600',
  },
  arabicGoldLine: {
    height: 2, marginTop: 14,
    alignSelf: 'stretch', opacity: 0.5,
  },

  // ── Bullet list ──
  bulletList: { gap: 9 },
  bulletRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
  },
  bullet: {
    width: 6, height: 6, borderRadius: 3,
    marginTop: 8, flexShrink: 0,
  },
  bulletText: {
    fontSize: 14, color: '#374151',
    lineHeight: 22, flex: 1,
  },

  // ── Info chip ──
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  chipIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  chipLabel: {
    fontSize: 10, fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginBottom: 1,
  },
  chipValue: {
    fontSize: 13, fontWeight: '600',
    color: '#1E293B', lineHeight: 19,
  },
});