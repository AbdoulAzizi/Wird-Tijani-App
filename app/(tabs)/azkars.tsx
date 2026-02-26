import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
  PanResponder,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sun,
  Moon,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react-native';
import {
  AZKARS,
  MORNING_OPENING,
  EVENING_OPENING,
  type Azkar,
  type AzkarPeriod,
  type CustomAzkar,
  getCategoryLabel,
  CATEGORY_COLORS,
} from '../../data/azkars';

const { width: W, height: H } = Dimensions.get('window');

interface UserPrefs {
  enabledIds: Set<string>;
  customCounts: Record<string, number>;
  customAzkars: CustomAzkar[];
}

const haptic = (type: 'light' | 'success' | 'warning') => {
  if (Platform.OS !== 'ios') return;
  if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

// ─── SESSION SELECTOR ─────────────────────────────────────────────────────────

const SessionSelector = memo(({ onSelect, onBack }: {
  onSelect: (p: AzkarPeriod) => void;
  onBack?: () => void;
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slideM = useRef(new Animated.Value(50)).current;
  const slideE = useRef(new Animated.Value(50)).current;
  const ring1 = useRef(new Animated.Value(0.15)).current;
  const ring2 = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const pulse = (a: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.timing(a, { toValue: 0.55, duration: 2800, delay, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.15, duration: 2800, useNativeDriver: true }),
      ])).start();
    pulse(ring1, 0);
    pulse(ring2, 1400);
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([Animated.spring(slideM, { toValue: 0, friction: 9, useNativeDriver: true })]),
      Animated.spring(slideE, { toValue: 0, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const morningCount = AZKARS.filter(a => a.period.includes('morning')).length;
  const eveningCount = AZKARS.filter(a => a.period.includes('evening')).length;

  return (
    <LinearGradient colors={['#050400', '#0a0900', '#050400']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <StatusBar barStyle="light-content" />
      {/* Bouton retour */}
      {onBack && (
        <TouchableOpacity
          onPress={() => { haptic('light'); onBack(); }}
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 56 : 36,
            left: 20,
            width: 40, height: 40, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            zIndex: 10,
          }}
        >
          <ChevronLeft size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      )}
      {[ring1, ring2].map((a, i) => (
        <Animated.View key={i} pointerEvents="none" style={{
          position: 'absolute',
          width: W * (0.85 + i * 0.45), height: W * (0.85 + i * 0.45),
          borderRadius: W * (0.425 + i * 0.225),
          borderWidth: 1, borderColor: '#C8922A', opacity: a,
        }} />
      ))}
      <Animated.View style={{ opacity: fade, alignItems: 'center', width: '100%' }}>
        <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, letterSpacing: 6, fontWeight: '800', marginBottom: 10, textTransform: 'uppercase' }}>
          Daily Remembrance
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: '200', letterSpacing: 1, marginBottom: 4, textAlign: 'center' }}>Al-Azkaar</Text>
        <Text style={{ color: '#C8922A', fontSize: 22, fontWeight: '300', textAlign: 'center', marginBottom: 6 }}>الأذكار اليومية</Text>
        <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, textAlign: 'center', lineHeight: 22, marginBottom: 44 }}>
          Choose your session to begin
        </Text>

        <Animated.View style={{ width: '100%', transform: [{ translateY: slideM }], marginBottom: 14 }}>
          <TouchableOpacity onPress={() => { haptic('success'); onSelect('morning'); }} activeOpacity={0.85}>
            <LinearGradient colors={['#180d00', '#251500', '#180d00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 22, padding: 24, borderWidth: 1.5, borderColor: '#C8922A35', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#C8922A15', borderWidth: 1.5, borderColor: '#C8922A50', alignItems: 'center', justifyContent: 'center', marginRight: 18 }}>
                <Sun size={28} color="#C8922A" strokeWidth={1.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#C8922A', fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 4 }}>MORNING</Text>
                <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '300', marginBottom: 2 }}>Adhkar Al-Sabah</Text>
                <Text style={{ color: '#C8922A85', fontSize: 15, fontWeight: '300', marginBottom: 6 }}>أذكار الصباح</Text>
                <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>{morningCount} adhkar</Text>
              </View>
              <ChevronRight size={18} color="#C8922A50" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ width: '100%', transform: [{ translateY: slideE }] }}>
          <TouchableOpacity onPress={() => { haptic('success'); onSelect('evening'); }} activeOpacity={0.85}>
            <LinearGradient colors={['#00020e', '#000516', '#00020e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 22, padding: 24, borderWidth: 1.5, borderColor: '#5a7db535', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#5a7db515', borderWidth: 1.5, borderColor: '#5a7db550', alignItems: 'center', justifyContent: 'center', marginRight: 18 }}>
                <Moon size={26} color="#5a7db5" strokeWidth={1.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#5a7db5', fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 4 }}>EVENING</Text>
                <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '300', marginBottom: 2 }}>Adhkar Al-Masa</Text>
                <Text style={{ color: '#5a7db585', fontSize: 15, fontWeight: '300', marginBottom: 6 }}>أذكار المساء</Text>
                <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>{eveningCount} adhkar</Text>
              </View>
              <ChevronRight size={18} color="#5a7db550" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

// ─── OPENING CEREMONY ─────────────────────────────────────────────────────────

const OpeningCeremony = memo(({ period, onEnter, onChangePeriod, onBack }: {
  period: AzkarPeriod; onEnter: () => void; onChangePeriod: () => void; onBack: () => void;
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.85)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0.3)).current;
  const ring2 = useRef(new Animated.Value(0.3)).current;
  const ring3 = useRef(new Animated.Value(0.3)).current;

  const isMorning = period === 'morning';
  const accentColor = isMorning ? '#C8922A' : '#5a7db5';

  useEffect(() => {
    fade.setValue(0); titleScale.setValue(0.85); lineWidth.setValue(0); contentFade.setValue(0); buttonFade.setValue(0);
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 0.8, duration: 2200, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 2200, useNativeDriver: true }),
      ])).start();

    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(titleScale, { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.timing(lineWidth, { toValue: 1, duration: 700, useNativeDriver: false }),
      ]),
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(buttonFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    pulse(ring1, 0); pulse(ring2, 600); pulse(ring3, 1200);
  }, [period]);

  const data = isMorning ? MORNING_OPENING : EVENING_OPENING;

  return (
    <LinearGradient colors={isMorning ? ['#0a0700', '#0f0e00', '#0a0700'] : ['#00000f', '#000a1a', '#00000f']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Bouton retour */}
      <TouchableOpacity
        onPress={() => { haptic('light'); onBack(); }}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 56 : 36,
          left: 20,
          width: 40, height: 40, borderRadius: 20,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
          zIndex: 10,
        }}
      >
        <ChevronLeft size={22} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
      {[ring1, ring2, ring3].map((anim, i) => (
        <Animated.View key={i} pointerEvents="none" style={{ position: 'absolute', width: W * (1.0 + i * 0.3), height: W * (1.0 + i * 0.3), borderRadius: W * (0.5 + i * 0.15), borderWidth: 1, borderColor: accentColor, opacity: anim }} />
      ))}
      <Animated.View style={{ opacity: fade, alignItems: 'center', paddingHorizontal: 32, width: '100%' }}>
        <TouchableOpacity onPress={() => { haptic('light'); onChangePeriod(); }} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 24 }}>
          {isMorning ? <Sun size={13} color="rgba(255,255,255,0.5)" style={{ marginRight: 6 }} /> : <Moon size={13} color="rgba(255,255,255,0.5)" style={{ marginRight: 6 }} />}
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' }}>{isMorning ? 'Morning' : 'Evening'}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginLeft: 6 }}>▸ change</Text>
        </TouchableOpacity>
        <Animated.View style={{ transform: [{ scale: titleScale }], alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: accentColor, alignItems: 'center', justifyContent: 'center', backgroundColor: `${accentColor}15` }}>
            {isMorning ? <Sun size={32} color={accentColor} strokeWidth={1.5} /> : <Moon size={32} color={accentColor} strokeWidth={1.5} />}
          </View>
        </Animated.View>
        <Text style={{ color: accentColor, fontSize: 12, letterSpacing: 6, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' }}>{isMorning ? 'Morning' : 'Evening'}</Text>
        <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: '200', letterSpacing: 1, marginBottom: 4, textAlign: 'center' }}>{isMorning ? 'Azkaar Al-Sabah' : 'Azkaar Al-Masa'}</Text>
        <Text style={{ color: accentColor, fontSize: 22, fontWeight: '300', textAlign: 'center', marginBottom: 20 }}>{isMorning ? 'أذكار الصباح' : 'أذكار المساء'}</Text>
        <Animated.View style={{ width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '60%'] }), height: 1, backgroundColor: accentColor, marginBottom: 28, opacity: 0.6 }} />
        <Animated.View style={{ opacity: contentFade, width: '100%', marginBottom: 32 }}>
          <View style={{ borderWidth: 1, borderColor: `${accentColor}25`, borderRadius: 16, padding: 20, backgroundColor: `${accentColor}08` }}>
            <Text style={{ color: '#ffffff', fontSize: 17, lineHeight: 30, textAlign: 'center', fontWeight: '300', marginBottom: 12 }}>{data.arabic}</Text>
            <Text style={{ color: `${accentColor}cc`, fontSize: 11, lineHeight: 18, textAlign: 'center', fontStyle: 'italic' }}>{data.transliteration}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 8 }}>{data.translation}</Text>
          </View>
        </Animated.View>
        <Animated.View style={{ opacity: buttonFade, width: '100%' }}>
          <TouchableOpacity onPress={() => { haptic('success'); onEnter(); }} activeOpacity={0.8}>
            <LinearGradient colors={isMorning ? ['#8a5a00', '#C8922A', '#8a5a00'] : ['#2a3d6b', '#4a6aab', '#2a3d6b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 16, borderRadius: 50, alignItems: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600', letterSpacing: 2 }}>{isMorning ? 'Begin Morning Adhkar' : 'Begin Evening Adhkar'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────

const ProgressBar = memo(({ current, total, color }: { current: number; total: number; color: string }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const pct = total > 0 ? current / total : 0;
  useEffect(() => { Animated.spring(progress, { toValue: pct, friction: 8, useNativeDriver: false }).start(); }, [pct]);
  return (
    <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginHorizontal: 24, marginBottom: 12 }}>
      <Animated.View style={{ height: 3, borderRadius: 2, backgroundColor: color, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
});

// ─── CIRCULAR COUNTER ─────────────────────────────────────────────────────────

const CircularCounter = memo(({ count, target, color, glow, onTap }: {
  count: number; target: number; color: string; glow: string; onTap: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isDone = count >= target;

  useEffect(() => {
    if (isDone) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.12, friction: 6, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
      haptic('success');
    }
  }, [isDone]);

  const handleTap = useCallback(() => {
    if (isDone) return;
    haptic('light');
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 0.6, duration: 120, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.1, duration: 500, useNativeDriver: true }),
    ]).start();
    onTap();
  }, [isDone, onTap]);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.05, duration: 2200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
    ])).start();
  }, []);

  const size = 156;
  return (
    <TouchableOpacity onPress={handleTap} activeOpacity={0.9} disabled={isDone}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <Animated.View pointerEvents="none" style={{ position: 'absolute', width: size + 40, height: size + 40, borderRadius: (size + 40) / 2, backgroundColor: glow, opacity: glowAnim }} />
        <Animated.View pointerEvents="none" style={{ position: 'absolute', width: size + 16, height: size + 16, borderRadius: (size + 16) / 2, borderWidth: 1.5, borderColor: isDone ? '#4aab4a' : color, transform: [{ scale: pulseAnim }], opacity: 0.35 }} />
        <LinearGradient colors={isDone ? ['#0a2a0a', '#1a4a1a', '#0a2a0a'] : [`${color}22`, `${color}0d`, `${color}22`]} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: isDone ? '#4aab4a' : color }}>
          {isDone ? (
            <View style={{ alignItems: 'center' }}>
              <Check size={40} color="#4aab4a" strokeWidth={2.5} />
              <Text style={{ color: '#4aab4a', fontSize: 12, fontWeight: '700', marginTop: 4, letterSpacing: 1 }}>COMPLETE</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 46, fontWeight: '200', lineHeight: 52 }}>{count}</Text>
              <View style={{ width: 36, height: 1, backgroundColor: `${color}80`, marginVertical: 4 }} />
              <Text style={{ color: `${color}cc`, fontSize: 16, fontWeight: '700' }}>{target}</Text>
            </View>
          )}
        </LinearGradient>
        {!isDone && <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 10, letterSpacing: 1 }}>{target - count} remaining</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
});

// ─── COLLAPSIBLE TEXT ─────────────────────────────────────────────────────────

const CollapsibleText = memo(({ children, maxHeight = 120, color }: { children: React.ReactNode; maxHeight?: number; color: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const needsCollapse = contentHeight > maxHeight + 10;
  return (
    <View>
      <ScrollView scrollEnabled={expanded || !needsCollapse} style={{ maxHeight: (expanded || !needsCollapse) ? undefined : maxHeight }} nestedScrollEnabled showsVerticalScrollIndicator={false} pointerEvents="box-none">
        <View onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>{children}</View>
      </ScrollView>
      {needsCollapse && (
        <TouchableOpacity onPress={() => { setExpanded(e => !e); haptic('light'); }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 7, paddingBottom: 2 }}>
          {expanded ? <ChevronUp size={13} color={`${color}70`} style={{ marginRight: 4 }} /> : <ChevronDown size={13} color={`${color}70`} style={{ marginRight: 4 }} />}
          <Text style={{ color: `${color}70`, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>{expanded ? 'SHOW LESS' : 'SHOW MORE'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

// ─── PRESENCE MODAL CONTENT ───────────────────────────────────────────────────
// Affiche un seul azkar dans le modal. Utilisé par PresenceModal avec clé pour animer les transitions.

const PresenceContent = memo(({ azkar, period, lineWidth }: {
  azkar: Azkar | CustomAzkar;
  period: AzkarPeriod;
  lineWidth: Animated.Value;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const isCustom = 'isCustom' in azkar;
  const color = isCustom ? '#5a7db5' : (azkar as Azkar).color;
  const glow = isCustom ? '#aac4f0' : (azkar as Azkar).glow;
  const accent = period === 'morning' ? '#C8922A' : '#5a7db5';

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -12, duration: 4500, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 4500, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingTop: 100, paddingBottom: 130 }}
      showsVerticalScrollIndicator={false}
      bounces
    >
      {/* Texte arabe flottant */}
      <Animated.Text style={{
        color: '#ffffff', fontSize: 30, fontWeight: '300', lineHeight: 54,
        textAlign: 'center',
        textShadowColor: glow, textShadowRadius: 30, textShadowOffset: { width: 0, height: 0 },
        transform: [{ translateY: floatAnim }],
        marginBottom: 28,
      }}>
        {azkar.arabic}
      </Animated.Text>

      {/* Ligne */}
      <Animated.View style={{
        height: 1, backgroundColor: accent, opacity: 0.6, alignSelf: 'center',
        width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '55%'] }),
        marginBottom: 28,
      }} />

      {/* Translitération */}
      {!!azkar.transliteration && (
        <Text style={{ color: `${color}ee`, fontSize: 15, lineHeight: 24, textAlign: 'center', fontStyle: 'italic', marginBottom: 14 }}>
          {azkar.transliteration}
        </Text>
      )}

      {/* Traduction */}
      <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, lineHeight: 26, textAlign: 'center', marginBottom: 32 }}>
        {azkar.translation}
      </Text>

      {/* Virtue */}
      {!isCustom && (azkar as Azkar).virtue && (
        <View style={{ borderWidth: 1, borderColor: `${accent}30`, borderRadius: 16, padding: 18, backgroundColor: `${accent}12`, width: '100%', marginBottom: 8 }}>
          <Text style={{ color: accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' }}>✧ VIRTUE ✧</Text>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 22, textAlign: 'center' }}>{(azkar as Azkar).virtue}</Text>
        </View>
      )}
    </ScrollView>
  );
});

// ─── PRESENCE MODAL ──────────────────────────────────────────────────────────
// Navigation autonome : prev/next/swipe sans fermer le modal.
// onClose(finalIndex) → synchronise l'index de la carte principale.

const PresenceModal = memo(({
  azkars, startIndex, period, onClose,
}: {
  azkars: (Azkar | CustomAzkar)[];
  startIndex: number;
  period: AzkarPeriod;
  onClose: (finalIndex: number) => void;
}) => {
  const [currentIdx, setCurrentIdx] = useState(startIndex);
  const azkar = azkars[currentIdx];

  // Animations d'entrée (une seule fois)
  const backdropFade = useRef(new Animated.Value(0)).current;
  const uiFade = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  // Animation de transition entre azkars
  const contentFade = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;

  // Décorations
  const glowBreath = useRef(new Animated.Value(0.06)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const ring3Scale = useRef(new Animated.Value(1)).current;
  const ring3Opacity = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    Array.from({ length: 12 }, () => ({
      x: new Animated.Value(Math.random() * W * 0.8 - W * 0.4),
      y: new Animated.Value(Math.random() * H * 0.5 - H * 0.25),
      opacity: new Animated.Value(0),
      size: 2 + Math.random() * 3,
    }))
  ).current;

  const isMorning = period === 'morning';
  const isCustom = 'isCustom' in azkar;
  const color = isCustom ? '#5a7db5' : (azkar as Azkar).color;
  const glow = isCustom ? '#aac4f0' : (azkar as Azkar).glow;
  const accent = isMorning ? '#C8922A' : '#5a7db5';
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === azkars.length - 1;

  // Démarrage des boucles décoratives
  const startRingLoop = (scaleA: Animated.Value, opacityA: Animated.Value, delay: number) => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacityA, { toValue: 0.14, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleA, { toValue: 1, duration: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(scaleA, { toValue: 3.2, duration: 3600, useNativeDriver: true }),
        Animated.timing(opacityA, { toValue: 0, duration: 3600, useNativeDriver: true }),
      ]),
    ])).start();
  };

  const startParticle = (p: typeof particles[0], delay: number) => {
    const dx = (Math.random() - 0.5) * 200;
    const dy = -60 - Math.random() * 100;
    const dur = 5000 + Math.random() * 5000;
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(p.opacity, { toValue: 0.3 + Math.random() * 0.3, duration: dur * 0.3, useNativeDriver: true }),
        Animated.timing(p.x, { toValue: dx, duration: dur, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: dy, duration: dur, useNativeDriver: true }),
      ]),
      Animated.timing(p.opacity, { toValue: 0, duration: dur * 0.3, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(p.x, { toValue: Math.random() * W * 0.8 - W * 0.4, duration: 0, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: Math.random() * H * 0.5 - H * 0.25, duration: 0, useNativeDriver: true }),
      ]),
    ])).start();
  };

  useEffect(() => {
    // Entrée initiale
    Animated.sequence([
      Animated.timing(backdropFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(uiFade, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(lineWidth, { toValue: 1, duration: 600, useNativeDriver: false }),
      ]),
    ]).start();

    // Glow
    Animated.loop(Animated.sequence([
      Animated.timing(glowBreath, { toValue: 0.18, duration: 4500, useNativeDriver: true }),
      Animated.timing(glowBreath, { toValue: 0.06, duration: 4500, useNativeDriver: true }),
    ])).start();

    startRingLoop(ring1Scale, ring1Opacity, 0);
    startRingLoop(ring2Scale, ring2Opacity, 1200);
    startRingLoop(ring3Scale, ring3Opacity, 2400);
    particles.forEach((p, i) => startParticle(p, i * 280));
  }, []);

  // Navigation avec transition fade+slide
  const navigateTo = useCallback((newIdx: number, direction: 'next' | 'prev') => {
    if (newIdx < 0 || newIdx >= azkars.length) return;
    haptic('light');
    const slideOut = direction === 'next' ? -30 : 30;
    const slideIn = direction === 'next' ? 30 : -30;

    Animated.parallel([
      Animated.timing(contentFade, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: slideOut, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      contentSlide.setValue(slideIn);
      setCurrentIdx(newIdx);
      // Reset lineWidth pour l'animation à l'entrée
      lineWidth.setValue(0);
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(lineWidth, { toValue: 1, duration: 500, useNativeDriver: false }),
      ]).start();
    });
  }, [azkars.length]);

  // Swipe gauche/droite
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 40 && Math.abs(g.dy) < 40,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) navigateTo(currentIdx + 1, 'next');
      if (g.dx > 50) navigateTo(currentIdx - 1, 'prev');
    },
  }), [currentIdx, navigateTo]);

  return (
    <Modal visible animationType="none" transparent statusBarTranslucent>
      <Animated.View style={{ flex: 1, opacity: backdropFade }} {...panResponder.panHandlers}>

        {/* Fond noir opaque */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000000' }} />
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: color, opacity: 0.04 }} />

        {/* ── Décorations (non interactives) ── */}
        {particles.map((p, i) => (
          <Animated.View key={i} pointerEvents="none" style={{ position: 'absolute', top: H * 0.5, left: W * 0.5, width: p.size, height: p.size, borderRadius: p.size / 2, backgroundColor: glow, opacity: p.opacity, transform: [{ translateX: p.x }, { translateY: p.y }] }} />
        ))}
        {[{ scale: ring1Scale, opacity: ring1Opacity }, { scale: ring2Scale, opacity: ring2Opacity }, { scale: ring3Scale, opacity: ring3Opacity }].map((r, i) => (
          <Animated.View key={i} pointerEvents="none" style={{ position: 'absolute', top: H * 0.5 - W * 0.5, left: 0, width: W, height: W, borderRadius: W / 2, borderWidth: 1.5, borderColor: color, opacity: r.opacity, transform: [{ scale: r.scale }] }} />
        ))}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: H * 0.5 - W * 0.65, left: -W * 0.15, width: W * 1.3, height: W * 1.3, borderRadius: W * 0.65, backgroundColor: glow, opacity: glowBreath }} />

        {/* ── Header : label + compteur + bouton fermer ── */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: uiFade, zIndex: 10 }}>
          <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Label gauche */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: accent, fontSize: 10, fontWeight: '800', letterSpacing: 4, textTransform: 'uppercase' }}>
                ✦ Station of Presence
              </Text>
            </View>

            {/* Compteur central */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Text style={{ color: accent, fontSize: 13, fontWeight: '800' }}>{currentIdx + 1}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginHorizontal: 4 }}>/</Text>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{azkars.length}</Text>
            </View>

            {/* Bouton fermer */}
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => { haptic('light'); onClose(currentIdx); }}
                style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Contenu animé de l'azkar courant ── */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: contentFade, transform: [{ translateX: contentSlide }] }}>
          <PresenceContent azkar={azkar} period={period} lineWidth={lineWidth} />
        </Animated.View>

        {/* ── Barre de navigation bas ── */}
        <Animated.View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          paddingBottom: Platform.OS === 'ios' ? 44 : 28,
          paddingTop: 14, paddingHorizontal: 20,
          backgroundColor: 'rgba(0,0,0,0.75)',
          borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
          flexDirection: 'row', alignItems: 'center', gap: 10,
          opacity: uiFade, zIndex: 10,
        }}>
          {/* Précédent */}
          <TouchableOpacity
            onPress={() => navigateTo(currentIdx - 1, 'prev')}
            disabled={isFirst}
            style={{
              width: 48, height: 48, borderRadius: 24,
              borderWidth: 1, borderColor: isFirst ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.18)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              alignItems: 'center', justifyContent: 'center',
              opacity: isFirst ? 0.25 : 1,
            }}
          >
            <ChevronLeft size={22} color="#ffffff" />
          </TouchableOpacity>

          {/* Indicateur de progression (points) */}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {azkars.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => navigateTo(i, i > currentIdx ? 'next' : 'prev')} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
                <View style={{
                  width: i === currentIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentIdx ? accent : (i < currentIdx ? `${accent}50` : 'rgba(255,255,255,0.15)'),
                }} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Suivant / Terminer */}
          {isLast ? (
            <TouchableOpacity
              onPress={() => { haptic('success'); onClose(currentIdx); }}
              style={{
                paddingHorizontal: 20, height: 48, borderRadius: 24,
                borderWidth: 1, borderColor: '#3ab53a50',
                backgroundColor: '#3ab53a18',
                alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
              }}
            >
              <Check size={16} color="#3ab53a" style={{ marginRight: 6 }} />
              <Text style={{ color: '#3ab53a', fontSize: 13, fontWeight: '700' }}>Terminer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigateTo(currentIdx + 1, 'next')}
              style={{
                width: 48, height: 48, borderRadius: 24,
                borderWidth: 1, borderColor: `${accent}40`,
                backgroundColor: `${accent}18`,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronRight size={22} color={accent} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Breath hint */}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', bottom: Platform.OS === 'ios' ? 120 : 104, left: 0, right: 0, alignItems: 'center', opacity: glowBreath }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 3 }}>breathe</Text>
        </Animated.View>

      </Animated.View>
    </Modal>
  );
});

// ─── AZKAR CARD ───────────────────────────────────────────────────────────────

const AzkarCard = memo(({
  azkar, userCount, completedCount, onCount, onNext, onPrev, index, total, period, allAzkars,
}: {
  azkar: Azkar | CustomAzkar; userCount: number; completedCount: number;
  onCount: () => void; onNext: () => void; onPrev: () => void;
  index: number; total: number; period: AzkarPeriod;
  allAzkars: (Azkar | CustomAzkar)[];
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  // presenceStartIndex : l'index depuis lequel on ouvre le modal
  const [presenceStartIndex, setPresenceStartIndex] = useState<number | null>(null);

  const isMorning = period === 'morning';
  const isCustom = 'isCustom' in azkar;
  const color = isCustom ? '#5a7db5' : (azkar as Azkar).color;
  const glow = isCustom ? '#aac4f0' : (azkar as Azkar).glow;
  const accentColor = isMorning ? '#C8922A' : '#5a7db5';
  const isDone = completedCount >= userCount;

  useEffect(() => {
    fadeAnim.setValue(0); slideAnim.setValue(24);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 10, useNativeDriver: true }),
    ]).start();
    const floatLoop = Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -7, duration: 3200, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3200, useNativeDriver: true }),
    ]));
    floatLoop.start();
    return () => floatLoop.stop();
  }, [azkar.id]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 40 && Math.abs(g.dy) < 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) { haptic('light'); onNext(); }
      if (g.dx > 50) { haptic('light'); onPrev(); }
    },
  }), [onNext, onPrev]);

  return (
    <>
      {presenceStartIndex !== null && (
        <PresenceModal
          azkars={allAzkars}
          startIndex={presenceStartIndex}
          period={period}
          onClose={(finalIndex) => {
            setPresenceStartIndex(null);
            // Synchronise la carte principale si l'index a changé
            const diff = finalIndex - index;
            if (diff > 0) {
              for (let i = 0; i < diff; i++) onNext();
            } else if (diff < 0) {
              for (let i = 0; i < -diff; i++) onPrev();
            }
          }}
        />
      )}

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} {...panResponder.panHandlers}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>

          {/* Badge index/total + catégorie */}
          <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: `${accentColor}30`, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, backgroundColor: `${accentColor}0c`, marginBottom: 10 }}>
              <Text style={{ color: accentColor, fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginHorizontal: 6 }}>/</Text>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{total}</Text>
            </View>
            {!isCustom && (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: `${CATEGORY_COLORS[(azkar as Azkar).category]}18` }}>
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: CATEGORY_COLORS[(azkar as Azkar).category], marginRight: 5 }} />
                <Text style={{ color: CATEGORY_COLORS[(azkar as Azkar).category], fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>{getCategoryLabel((azkar as Azkar).category).toUpperCase()}</Text>
              </View>
            )}
          </View>

          {/* Bloc texte scrollable */}
          <View style={{ maxHeight: 240, marginHorizontal: 16, marginBottom: 14, borderRadius: 18, borderWidth: 1, borderColor: `${color}22`, backgroundColor: `${color}07`, overflow: 'hidden' }}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator indicatorStyle="white" contentContainerStyle={{ padding: 18, paddingBottom: 20 }}>
              <Animated.View style={{ transform: [{ translateY: floatAnim }], marginBottom: 16 }}>
                <Text style={{ color: '#ffffff', fontSize: 24, lineHeight: 46, textAlign: 'center', fontWeight: '300', textShadowColor: glow, textShadowRadius: 18, textShadowOffset: { width: 0, height: 0 } }}>{azkar.arabic}</Text>
              </Animated.View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: `${accentColor}35` }} />
                <Text style={{ color: accentColor, fontSize: 10, marginHorizontal: 10 }}>✦</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: `${accentColor}35` }} />
              </View>
              {!!azkar.transliteration && <Text style={{ color: `${color}cc`, fontSize: 13, lineHeight: 22, textAlign: 'center', fontStyle: 'italic', marginBottom: 10 }}>{azkar.transliteration}</Text>}
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 24, textAlign: 'center', marginBottom: 10 }}>{azkar.translation}</Text>
              {!isCustom && <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center' }}>{(azkar as Azkar).source}</Text>}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, pointerEvents: 'none' }}>
              <LinearGradient colors={['transparent', `${color}20`]} style={{ flex: 1, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }} />
            </View>
          </View>

          {/* Virtue */}
          {!isCustom && (azkar as Azkar).virtue && (
            <View style={{ marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: `${accentColor}20`, borderRadius: 14, padding: 14, backgroundColor: `${accentColor}08` }}>
              <Text style={{ color: accentColor, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6 }}>✧ VIRTUE</Text>
              <CollapsibleText maxHeight={64} color={accentColor}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 20 }}>{(azkar as Azkar).virtue}</Text>
              </CollapsibleText>
            </View>
          )}

          {/* Bouton Enter Presence */}
          <TouchableOpacity
            onPress={() => { haptic('light'); setPresenceStartIndex(index); }}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 40, marginBottom: 20, paddingVertical: 10, borderWidth: 1, borderColor: `${color}30`, borderRadius: 30, backgroundColor: `${color}0c` }}
          >
            <Eye size={15} color={`${color}80`} style={{ marginRight: 8 }} />
            <Text style={{ color: `${color}90`, fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ENTER PRESENCE</Text>
          </TouchableOpacity>

          {/* Compteur */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <CircularCounter count={completedCount} target={userCount} color={color} glow={glow} onTap={onCount} />
            {!isDone ? (
              <TouchableOpacity onPress={() => { haptic('light'); onCount(); }} style={{ marginTop: 18, paddingVertical: 13, paddingHorizontal: 44, borderRadius: 30, borderWidth: 1, borderColor: `${color}40`, backgroundColor: `${color}12` }}>
                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600', letterSpacing: 2 }}>TAP TO COUNT</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => { haptic('light'); onNext(); }} style={{ marginTop: 18, paddingVertical: 14, paddingHorizontal: 44, borderRadius: 30, backgroundColor: '#0d2a0d', borderWidth: 1, borderColor: '#3ab53a' }}>
                <Text style={{ color: '#3ab53a', fontSize: 14, fontWeight: '700', letterSpacing: 1 }}>NEXT DHIKR  →</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Flèches bas */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 24, paddingTop: 8 }}>
          <TouchableOpacity onPress={() => { haptic('light'); onPrev(); }} disabled={index === 0} style={{ opacity: index === 0 ? 0.15 : 0.65, padding: 11, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <ChevronLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { haptic('light'); onNext(); }} style={{ opacity: 0.65, padding: 11, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <ChevronRight size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
});

// ─── CUSTOMIZATION PAGE ───────────────────────────────────────────────────────

const CustomizationPage = memo(({ prefs, onUpdate, onClose, period }: {
  prefs: UserPrefs; onUpdate: (p: UserPrefs) => void; onClose: () => void; period: AzkarPeriod;
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPrefs>({
    enabledIds: new Set(prefs.enabledIds),
    customCounts: { ...prefs.customCounts },
    customAzkars: [...prefs.customAzkars],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newAzkar, setNewAzkar] = useState({ arabic: '', transliteration: '', translation: '', count: '3' });

  const isMorning = period === 'morning';
  const accentColor = isMorning ? '#C8922A' : '#5a7db5';
  const filteredAzkars = AZKARS.filter(a => a.period.includes(period));

  const toggleEnabled = (id: string) => {
    const next = new Set(localPrefs.enabledIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setLocalPrefs({ ...localPrefs, enabledIds: next });
    haptic('light');
  };

  const startEdit = (id: string, current: number) => { setEditingId(id); setEditingValue(String(current)); };
  const commitEdit = (id: string) => {
    const n = parseInt(editingValue, 10);
    if (!isNaN(n) && n >= 1) setLocalPrefs(p => ({ ...p, customCounts: { ...p.customCounts, [id]: n } }));
    setEditingId(null);
  };

  const addCustomAzkar = () => {
    if (!newAzkar.arabic.trim() || !newAzkar.translation.trim()) { Alert.alert('Required Fields', 'Arabic text and translation are required.'); return; }
    const id = `custom_${Date.now()}`;
    const custom: CustomAzkar = { id, arabic: newAzkar.arabic.trim(), transliteration: newAzkar.transliteration.trim(), translation: newAzkar.translation.trim(), count: parseInt(newAzkar.count, 10) || 3, period: [period], isCustom: true };
    setLocalPrefs(p => ({ ...p, customAzkars: [...p.customAzkars, custom], enabledIds: new Set([...p.enabledIds, id]) }));
    setNewAzkar({ arabic: '', transliteration: '', translation: '', count: '3' });
    setShowAddCustom(false);
    haptic('success');
  };

  const deleteCustom = (id: string) => {
    const nextEnabled = new Set(localPrefs.enabledIds);
    nextEnabled.delete(id);
    setLocalPrefs(p => ({ ...p, customAzkars: p.customAzkars.filter(c => c.id !== id), enabledIds: nextEnabled }));
    haptic('warning');
  };

  const save = () => { onUpdate(localPrefs); haptic('success'); onClose(); };

  return (
    <View style={{ flex: 1, backgroundColor: '#050508' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0a14', '#050508']} style={{ paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}><X size={22} color="rgba(255,255,255,0.5)" /></TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '600' }}>Personalize Adhkar</Text>
            <Text style={{ color: accentColor, fontSize: 12, marginTop: 2 }}>{isMorning ? 'Morning Session' : 'Evening Session'}</Text>
          </View>
          <TouchableOpacity onPress={save} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: `${accentColor}20`, borderWidth: 1, borderColor: `${accentColor}40` }}>
            <Text style={{ color: accentColor, fontSize: 14, fontWeight: '700' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}>
            <TouchableOpacity onPress={() => setLocalPrefs(p => ({ ...p, enabledIds: new Set([...filteredAzkars.map(a => a.id), ...p.customAzkars.filter(c => c.period.includes(period)).map(c => c.id)]) }))} style={{ flex: 1, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: `${accentColor}40`, alignItems: 'center', backgroundColor: `${accentColor}10` }}>
              <Text style={{ color: accentColor, fontSize: 13, fontWeight: '700' }}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLocalPrefs(p => ({ ...p, enabledIds: new Set() }))} style={{ flex: 1, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: '700' }}>Select None</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 14 }}>STANDARD ADHKAR  ({filteredAzkars.length})</Text>

          {filteredAzkars.map((azkar) => {
            const isEnabled = localPrefs.enabledIds.has(azkar.id);
            const currentCount = localPrefs.customCounts[azkar.id] ?? azkar.defaultCount;
            const isEditing = editingId === azkar.id;
            return (
              <View key={azkar.id} style={{ marginBottom: 10, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: isEnabled ? `${azkar.color}35` : 'rgba(255,255,255,0.06)', backgroundColor: isEnabled ? `${azkar.color}0a` : 'rgba(255,255,255,0.02)' }}>
                <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: isEnabled ? azkar.color : 'transparent' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, paddingLeft: 18 }}>
                  <TouchableOpacity onPress={() => toggleEnabled(azkar.id)} style={{ marginRight: 12 }}>
                    {isEnabled ? <CheckSquare size={21} color={azkar.color} strokeWidth={2} /> : <Square size={21} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />}
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '300', lineHeight: 26, marginBottom: 2 }} numberOfLines={2}>{azkar.arabic}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }} numberOfLines={1}>{azkar.transliteration}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: CATEGORY_COLORS[azkar.category], marginRight: 5 }} />
                      <Text style={{ color: CATEGORY_COLORS[azkar.category], fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>{getCategoryLabel(azkar.category)}</Text>
                    </View>
                  </View>
                  {isEditing ? (
                    <TextInput value={editingValue} onChangeText={setEditingValue} keyboardType="number-pad" style={{ color: '#ffffff', fontSize: 20, fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 8, width: 64, textAlign: 'center', borderWidth: 1.5, borderColor: `${azkar.color}60` }} autoFocus onBlur={() => commitEdit(azkar.id)} onSubmitEditing={() => commitEdit(azkar.id)} />
                  ) : (
                    <TouchableOpacity onPress={() => startEdit(azkar.id, currentCount)} style={{ alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: `${azkar.color}45`, backgroundColor: `${azkar.color}14` }}>
                      <Text style={{ color: azkar.color, fontSize: 20, fontWeight: '700' }}>{currentCount}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 8 }}>times</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {localPrefs.customAzkars.filter(c => c.period.includes(period)).length > 0 && (
            <>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginTop: 24, marginBottom: 14 }}>MY CUSTOM ADHKAR  ({localPrefs.customAzkars.filter(c => c.period.includes(period)).length})</Text>
              {localPrefs.customAzkars.filter(c => c.period.includes(period)).map((custom) => {
                const isEnabled = localPrefs.enabledIds.has(custom.id);
                return (
                  <View key={custom.id} style={{ marginBottom: 10, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: isEnabled ? '#5a7db550' : 'rgba(255,255,255,0.06)', backgroundColor: isEnabled ? '#5a7db514' : 'rgba(255,255,255,0.02)' }}>
                    <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: isEnabled ? '#5a7db5' : 'transparent' }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, paddingLeft: 18 }}>
                      <TouchableOpacity onPress={() => toggleEnabled(custom.id)} style={{ marginRight: 12 }}>
                        {isEnabled ? <CheckSquare size={21} color="#5a7db5" strokeWidth={2} /> : <Square size={21} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />}
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '300', lineHeight: 26 }} numberOfLines={2}>{custom.arabic}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }} numberOfLines={1}>{custom.translation}</Text>
                      </View>
                      <View style={{ alignItems: 'center', marginHorizontal: 8 }}>
                        <Text style={{ color: '#5a7db5', fontSize: 18, fontWeight: '700' }}>{custom.count}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>times</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteCustom(custom.id)} style={{ padding: 8 }}><Trash2 size={17} color="#b54a4a" /></TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          <View style={{ marginTop: 26 }}>
            {!showAddCustom ? (
              <TouchableOpacity onPress={() => setShowAddCustom(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 20, borderWidth: 1.5, borderColor: `${accentColor}35`, borderStyle: 'dashed', backgroundColor: `${accentColor}08` }}>
                <Plus size={18} color={accentColor} style={{ marginRight: 8 }} />
                <Text style={{ color: accentColor, fontSize: 15, fontWeight: '700' }}>Add Custom Dhikr</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ borderRadius: 20, borderWidth: 1, borderColor: `${accentColor}28`, backgroundColor: `${accentColor}07`, padding: 20 }}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 18 }}>New Custom Dhikr</Text>
                {[
                  { label: 'Arabic Text *', key: 'arabic', placeholder: 'أدخل النص العربي...', multiline: true, rtl: true },
                  { label: 'Transliteration', key: 'transliteration', placeholder: 'transliteration...', multiline: false, italic: true },
                  { label: 'Translation *', key: 'translation', placeholder: 'English meaning...', multiline: true },
                ].map(f => (
                  <View key={f.key}>
                    <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 6 }}>{f.label}</Text>
                    <TextInput value={(newAzkar as any)[f.key]} onChangeText={v => setNewAzkar(p => ({ ...p, [f.key]: v }))} multiline={f.multiline} placeholder={f.placeholder} placeholderTextColor="rgba(255,255,255,0.18)" style={[{ color: '#ffffff', fontSize: 14, lineHeight: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.04)' }, (f as any).rtl && { textAlign: 'right', fontSize: 18, lineHeight: 30, fontWeight: '300' }, (f as any).italic && { fontStyle: 'italic' }]} />
                  </View>
                ))}
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 6 }}>Count</Text>
                <TextInput value={newAzkar.count} onChangeText={v => setNewAzkar(p => ({ ...p, count: v }))} keyboardType="number-pad" placeholder="3" placeholderTextColor="rgba(255,255,255,0.18)" style={{ color: '#ffffff', fontSize: 22, fontWeight: '700', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.04)', width: 110, textAlign: 'center' }} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => setShowAddCustom(false)} style={{ flex: 1, paddingVertical: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={addCustomAzkar} style={{ flex: 2, paddingVertical: 14, borderRadius: 20, backgroundColor: `${accentColor}28`, borderWidth: 1, borderColor: `${accentColor}45`, alignItems: 'center' }}>
                    <Text style={{ color: accentColor, fontSize: 14, fontWeight: '700' }}>Add Dhikr</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});

// ─── COMPLETION SCREEN ────────────────────────────────────────────────────────

const CompletionScreen = memo(({ period, count, onRestart, onChangeSession }: { period: AzkarPeriod; count: number; onRestart: () => void; onChangeSession: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isMorning = period === 'morning';
  const accentColor = isMorning ? '#C8922A' : '#5a7db5';

  useEffect(() => {
    haptic('success');
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={isMorning ? ['#0a0700', '#0f0e00', '#0a0700'] : ['#00000f', '#000a1a', '#00000f']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#0a2a0a', borderWidth: 2, borderColor: '#3ab53a', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <Check size={44} color="#3ab53a" strokeWidth={2} />
        </View>
        <Text style={{ color: accentColor, fontSize: 12, fontWeight: '800', letterSpacing: 5, textTransform: 'uppercase', marginBottom: 10 }}>Alhamdulillah</Text>
        <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '200', marginBottom: 10, textAlign: 'center' }}>{isMorning ? 'Morning Adhkar\nComplete' : 'Evening Adhkar\nComplete'}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', lineHeight: 24, marginBottom: 40 }}>You completed {count} adhkar.{'\n'}May Allah accept your remembrance.</Text>
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
        <TouchableOpacity onPress={onRestart} style={{ paddingVertical: 16, borderRadius: 50, borderWidth: 1, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}14`, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
          <RotateCcw size={16} color={accentColor} style={{ marginRight: 8 }} />
          <Text style={{ color: accentColor, fontSize: 15, fontWeight: '700' }}>Repeat Adhkar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onChangeSession} style={{ paddingVertical: 16, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          {isMorning ? <Moon size={16} color="#5a7db5" style={{ marginRight: 8 }} /> : <Sun size={16} color="#C8922A" style={{ marginRight: 8 }} />}
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, fontWeight: '600' }}>Switch to {isMorning ? 'Evening' : 'Morning'} Adhkar</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
});

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

export default function AzkarsScreen() {
  const router = useRouter();
  const { period: periodParam } = useLocalSearchParams<{ period?: AzkarPeriod }>();
  const routePeriod: AzkarPeriod | undefined = periodParam === 'morning' || periodParam === 'evening' ? periodParam : undefined;
  const [selectedPeriod, setSelectedPeriod] = useState<AzkarPeriod>(routePeriod ?? 'morning');
  const period = selectedPeriod;
  const isMorning = period === 'morning';
  const accentColor = isMorning ? '#C8922A' : '#5a7db5';

  const allStandardIds = useMemo(() => new Set(AZKARS.filter(a => a.period.includes(period)).map(a => a.id)), [period]);

  const [prefs, setPrefs] = useState<UserPrefs>({ enabledIds: new Set(allStandardIds), customCounts: {}, customAzkars: [] });
  const [phase, setPhase] = useState<'selector' | 'opening' | 'session' | 'complete'>(routePeriod ? 'opening' : 'selector');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showCustomize, setShowCustomize] = useState(false);

  const activeAzkars = useMemo(() => {
    const standard = AZKARS.filter(a => a.period.includes(period) && prefs.enabledIds.has(a.id));
    const custom = prefs.customAzkars.filter(c => c.period.includes(period) && prefs.enabledIds.has(c.id));
    return [...standard, ...custom];
  }, [period, prefs]);

  const resetCounts = useCallback(() => {
    const init: Record<string, number> = {};
    activeAzkars.forEach(a => { init[a.id] = 0; });
    setCounts(init);
  }, [activeAzkars]);

  useEffect(() => { resetCounts(); }, [activeAzkars]);

  const currentAzkar = activeAzkars[currentIndex] ?? null;
  const userCount = currentAzkar
    ? (prefs.customCounts[currentAzkar.id] ?? ('isCustom' in currentAzkar ? (currentAzkar as CustomAzkar).count : (currentAzkar as Azkar).defaultCount))
    : 1;
  const completedCount = currentAzkar ? (counts[currentAzkar.id] ?? 0) : 0;

  const handleCount = useCallback(() => {
    if (!currentAzkar) return;
    setCounts(p => ({ ...p, [currentAzkar.id]: (p[currentAzkar.id] ?? 0) + 1 }));
  }, [currentAzkar]);

  const handleNext = useCallback(() => {
    if (currentIndex < activeAzkars.length - 1) setCurrentIndex(i => i + 1);
    else setPhase('complete');
  }, [currentIndex, activeAzkars.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  const handleRestart = useCallback(() => { resetCounts(); setCurrentIndex(0); setPhase('opening'); }, [resetCounts]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Réinitialiser la session',
      'Remettre tous les compteurs à zéro et revenir au premier dhikr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            haptic('warning');
            resetCounts();
            setCurrentIndex(0);
          },
        },
      ]
    );
  }, [resetCounts]);

  const completedInSession = activeAzkars.filter((azkar) => {
    const target = prefs.customCounts[azkar.id] ?? ('isCustom' in azkar ? (azkar as CustomAzkar).count : (azkar as Azkar).defaultCount);
    return (counts[azkar.id] ?? 0) >= target;
  }).length;

  if (phase === 'selector') return <SessionSelector onSelect={(p) => { setSelectedPeriod(p); setPhase('opening'); }} onBack={() => router.back()} />;

  if (showCustomize) return (
    <Modal visible animationType="slide" presentationStyle="fullScreen">
      <CustomizationPage prefs={prefs} period={period} onUpdate={(p) => { setPrefs(p); resetCounts(); setCurrentIndex(0); }} onClose={() => setShowCustomize(false)} />
    </Modal>
  );

  if (phase === 'opening') return <OpeningCeremony period={period} onEnter={() => setPhase('session')} onChangePeriod={() => setPhase('selector')} onBack={() => setPhase('selector')} />;
  if (phase === 'complete') return <CompletionScreen period={period} count={completedInSession} onRestart={handleRestart} onChangeSession={() => setPhase('selector')} />;

  return (
    <LinearGradient colors={isMorning ? ['#050400', '#0b0900', '#050400'] : ['#020209', '#05050f', '#020209']} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
        <TouchableOpacity onPress={() => setPhase('opening')} style={{ padding: 8 }}>
          <ChevronLeft size={22} color="rgba(255,255,255,0.55)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { haptic('light'); setPhase('selector'); }} style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
          {isMorning ? <Sun size={13} color={accentColor} /> : <Moon size={13} color={accentColor} />}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: accentColor, fontSize: 11, fontWeight: '800', letterSpacing: 3, textTransform: 'uppercase' }}>{isMorning ? 'Al-Sabah' : 'Al-Masa'}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 1 }}>{currentIndex + 1} / {activeAzkars.length}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <TouchableOpacity
            onPress={handleReset}
            style={{ padding: 8 }}
          >
            <RotateCcw size={18} color="rgba(255,255,255,0.38)" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCustomize(true)} style={{ padding: 8 }}>
            <Settings size={20} color="rgba(255,255,255,0.45)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress */}
      <View style={{ paddingTop: 10 }}>
        <ProgressBar current={currentIndex + (completedCount >= userCount ? 1 : 0)} total={activeAzkars.length} color={accentColor} />
      </View>

      {/* Azkar Card */}
      {currentAzkar && (
        <AzkarCard
          key={currentAzkar.id}
          azkar={currentAzkar}
          userCount={userCount}
          completedCount={completedCount}
          onCount={handleCount}
          onNext={handleNext}
          onPrev={handlePrev}
          index={currentIndex}
          total={activeAzkars.length}
          period={period}
          allAzkars={activeAzkars}
        />
      )}
    </LinearGradient>
  );
}