// ============================================================
// AzkaarScreen.tsx — Azkaar du Matin et du Soir (COMPLET)
// Design: Sanctuaire meditatif — atmosphère douce et conviviale
// Fonctionnalites: compteur tactile + saisie, dhikr personnalise,
//   selection, progression bloquante, animation meditative
// ============================================================

import React, {
  useState, useEffect, useRef, useCallback, useMemo, memo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View, Text, TouchableOpacity, Animated, ScrollView, Modal,
  FlatList, Dimensions, StatusBar, PanResponder, TextInput,
  KeyboardAvoidingView, Platform, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Moon, Sun, ChevronLeft, ChevronRight, Settings, Check, X,
  RotateCcw, Star, Book, Minus, Plus, ArrowLeft, CheckCircle,
  Sparkles, PenLine, Trash2, GripVertical, AlertCircle,
} from 'lucide-react-native';
import {
  MORNING_AZKAAR, EVENING_AZKAAR, Dhikr, AzkaarTime,
  getMorningAzkaar, getEveningAzkaar, createCustomDhikr, COLOR_OPTIONS,
} from '../../data/azkars';

const { width: W, height: H } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────
type SessionTime = 'morning' | 'evening';

interface DhikrState {
  count: number;
  completed: boolean;
}

interface SessionPrefs {
  selectedIds: string[];
  customCounts: Record<string, number>;
  customDhikr: Dhikr[];
}

// ─── Palette ─────────────────────────────────────────────────
const P = {
  black:      '#000000',
  night:      '#03040A',
  surface:    '#0A0C18',
  surfaceMid: '#10132A',
  border:     'rgba(255,255,255,0.06)',
  borderMid:  'rgba(255,255,255,0.12)',
  gold:       '#C8922A',
  goldLight:  '#FDE68A',
  w90:        'rgba(255,255,255,0.90)',
  w70:        'rgba(255,255,255,0.70)',
  w50:        'rgba(255,255,255,0.50)',
  w30:        'rgba(255,255,255,0.30)',
  w15:        'rgba(255,255,255,0.15)',
  w08:        'rgba(255,255,255,0.08)',
  w04:        'rgba(255,255,255,0.04)',
  morning:    '#F6C06A',
  evening:    '#7C9CDB',
};

// ─── Ambient floating mote ────────────────────────────────────
// FIX: key prop removed from spread to avoid duplicate key TS warning.
// key={m.key} est passé directement, et le spread {...m} ne contient plus 'key'.
interface MoteConfig {
  size: number;
  x: number;
  y: number;
  delay: number;
}

const Mote = memo(({ color, size, x, y, delay }: MoteConfig & { color: string }) => {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(op, { toValue: 0.5, duration: 2200, useNativeDriver: true }),
          Animated.timing(op, { toValue: 0, duration: 2200, useNativeDriver: true }),
        ]),
        Animated.timing(ty, { toValue: -40, duration: 4400, useNativeDriver: true }),
      ]),
      Animated.timing(ty, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, opacity: op,
      transform: [{ translateY: ty }],
    }} pointerEvents="none" />
  );
});

const AmbientParticles = memo(({ color }: { color: string }) => {
  // FIX: key is extracted separately so it doesn't appear in the spread
  const motes = useMemo(() =>
    Array.from({ length: 14 }, (_, i): MoteConfig & { id: number } => ({
      id: i,
      size: 2 + Math.random() * 3.5,
      x: Math.random() * (W - 20),
      y: 100 + Math.random() * (H * 0.65),
      delay: i * 350,
    })), []
  );
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {motes.map(({ id, ...moteProps }) => (
        <Mote key={id} color={color} {...moteProps} />
      ))}
    </View>
  );
});

// ─── Radial ambient glow ──────────────────────────────────────
const AmbientGlow = memo(({ color }: { color: string }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 4500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 4500, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.07, 0.18] });
  const scale   = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  return (
    <Animated.View style={{
      position: 'absolute',
      width: W * 1.6, height: W * 1.6, borderRadius: W * 0.8,
      backgroundColor: color,
      top: H * 0.2 - W * 0.8, left: -W * 0.3,
      opacity, transform: [{ scale }],
    }} pointerEvents="none" />
  );
});

// ─── Tasbih counter button ─────────────────────────────────────
const TasbihBtn = memo(({ count, target, color, onPress, completed }: {
  count: number; target: number; color: string;
  onPress: () => void; completed: boolean;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glow  = useRef(new Animated.Value(0)).current;

  const handlePress = useCallback(() => {
    if (completed) return;
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 0.91, damping: 14, stiffness: 320, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]),
    ]).start();
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [completed, onPress]);

  const glowOp   = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.38] });
  const progress = Math.min(count / Math.max(target, 1), 1);

  return (
    <View style={{ alignItems: 'center', gap: 14 }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} disabled={completed}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Animated.View style={{
            position: 'absolute', width: 104, height: 104, borderRadius: 52,
            backgroundColor: color, opacity: glowOp, top: -2, left: -2,
          }} />
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            backgroundColor: completed ? `${color}22` : `${color}14`,
            borderWidth: 1.5,
            borderColor: completed ? color : `${color}55`,
            alignItems: 'center', justifyContent: 'center',
          }}>
            {completed
              ? <Check size={38} color={color} strokeWidth={2} />
              : <>
                  <Text style={{ color: '#fff', fontSize: 30, fontWeight: '200', lineHeight: 34 }}>
                    {count}
                  </Text>
                  <Text style={{ color, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
                    / {target}
                  </Text>
                </>
            }
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={{
        width: W * 0.56, height: 2, backgroundColor: `${color}20`,
        borderRadius: 1, overflow: 'hidden',
      }}>
        <View style={{
          width: `${progress * 100}%`, height: '100%',
          backgroundColor: color, borderRadius: 1,
        }} />
      </View>

      <Text style={{
        color: completed ? color : P.w30,
        fontSize: 11, letterSpacing: 2, fontWeight: completed ? '700' : '400',
        fontStyle: completed ? 'normal' : 'italic',
      }}>
        {completed ? 'ACCOMPLI  ✓' : count === 0 ? 'Appuyez pour commencer' : `${target - count} restants`}
      </Text>
    </View>
  );
});

// ─── DhikrCard ─────────────────────────────────────────────────
// FIX: ScrollView déjà présent — on s'assure que flex:1 + contentContainerStyle
// permettent un scroll correct sans overflow caché.
const DhikrCard = memo(({
  dhikr, state, totalCount, index, total,
  onCount, onNext, onPrev, canPrev, canNext,
  bottomInset,
}: {
  dhikr: Dhikr;
  state: DhikrState;
  totalCount: number;
  index: number;
  total: number;
  onCount: () => void;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  canNext: boolean;
  bottomInset: number;
}) => {
  const cardOp = useRef(new Animated.Value(0)).current;
  const cardTY = useRef(new Animated.Value(18)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    cardOp.setValue(0);
    cardTY.setValue(18);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    Animated.parallel([
      Animated.timing(cardOp, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.spring(cardTY, { toValue: 0, damping: 18, stiffness: 150, useNativeDriver: true }),
    ]).start();
    const floatLoop = Animated.loop(Animated.sequence([
      Animated.timing(floatY, { toValue: -10, duration: 4200, useNativeDriver: true }),
      Animated.timing(floatY, { toValue: 0,   duration: 4200, useNativeDriver: true }),
    ]));
    floatLoop.start();
    return () => floatLoop.stop();
  }, [dhikr.id]);

  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 45 && Math.abs(g.dy) < 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50 && canNext) {
        if (state.completed) onNext();
        else if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (g.dx > 50 && canPrev) onPrev();
    },
  });

  const { color, glow } = dhikr;
  // Extra bottom padding = nav arrows zone (46px) + safe area + some breathing room
  const bottomPad = 46 + bottomInset + 24;

  return (
    <Animated.View
      {...pan.panHandlers}
      style={{ flex: 1, opacity: cardOp, transform: [{ translateY: cardTY }] }}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 12,
          paddingBottom: bottomPad,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Dot progress indicators */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingHorizontal: 14, paddingVertical: 7,
            borderRadius: 20, backgroundColor: `${color}12`,
            borderWidth: 1, borderColor: `${color}28`,
          }}>
            {Array.from({ length: Math.min(total, 20) }, (_, i) => (
              <View key={i} style={{
                width: i === index ? 20 : 5, height: 5, borderRadius: 2.5,
                backgroundColor: i === index ? color : i < index ? `${color}55` : `${color}18`,
              }} />
            ))}
            {total > 20 && (
              <Text style={{ color: P.w30, fontSize: 10, marginLeft: 2 }}>+{total - 20}</Text>
            )}
          </View>
        </View>

        {/* Source */}
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingHorizontal: 12, paddingVertical: 5,
            borderRadius: 12, borderWidth: 1,
            borderColor: P.border, backgroundColor: P.w04,
          }}>
            {dhikr.isCustom
              ? <PenLine size={10} color={color} />
              : <Book size={10} color={color} />
            }
            <Text style={{ color, fontSize: 10, letterSpacing: 1.5, fontWeight: '700' }}>
              {dhikr.source.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{
          color: P.w50, fontSize: 12, textAlign: 'center',
          letterSpacing: 2, fontWeight: '700', marginBottom: 16,
        }}>
          {dhikr.title.toUpperCase()}
        </Text>

        {/* ── Scrollable text block (Arabic + divider + transliteration + translation) ── */}
        <View style={{
          maxHeight: H * 0.32,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: `${color}14`,
          backgroundColor: `${color}05`,
          marginBottom: 28,
          overflow: 'hidden',
        }}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          >
            {/* Arabic text */}
            <Animated.View style={{ transform: [{ translateY: floatY }], marginBottom: 18 }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: dhikr.arabic.length > 200 ? 18 : dhikr.arabic.length > 100 ? 22 : 28,
                fontWeight: '300',
                textAlign: 'center',
                lineHeight: dhikr.arabic.length > 200 ? 34 : 42,
                textShadowColor: glow,
                textShadowRadius: 24,
                textShadowOffset: { width: 0, height: 0 },
                paddingHorizontal: 4,
              }}>
                {dhikr.arabic}
              </Text>
            </Animated.View>

            {/* Divider */}
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <LinearGradient
                colors={['transparent', P.gold, 'transparent']}
                start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                style={{ width: W * 0.45, height: 1, opacity: 0.35 }}
              />
            </View>

            {/* Transliteration */}
            <Text style={{
              color, fontSize: 13, fontStyle: 'italic', textAlign: 'center',
              letterSpacing: 0.4, marginBottom: 10, opacity: 0.9,
            }}>
              {dhikr.transliteration}
            </Text>

            {/* Translation */}
            <Text style={{
              color: P.w70, fontSize: 14, textAlign: 'center',
              lineHeight: 24, paddingHorizontal: 4,
            }}>
              {dhikr.translation}
            </Text>
          </ScrollView>

          {/* Fade-out gradient at bottom to hint scrollability */}
          <View style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 32,
            pointerEvents: 'none',
          }}>
            <LinearGradient
              colors={[`${color}00`, `${color}12`]}
              style={{ flex: 1, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
            />
          </View>
        </View>

        {/* Counter */}
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <TasbihBtn
            count={state.count}
            target={totalCount}
            color={color}
            onPress={onCount}
            completed={state.completed}
          />
        </View>

        {/* Virtue card */}
        {dhikr.virtue ? (
          <View style={{
            borderWidth: 1, borderColor: `${color}22`,
            borderRadius: 16, padding: 16,
            backgroundColor: `${color}07`, marginBottom: 20,
          }}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
            }}>
              <Sparkles size={13} color={color} />
              <Text style={{ color, fontSize: 10, letterSpacing: 2, fontWeight: '700' }}>
                VERTU & BIENFAIT
              </Text>
            </View>
            <Text style={{ color: P.w50, fontSize: 13, lineHeight: 22, fontStyle: 'italic' }}>
              {dhikr.virtue}
            </Text>
          </View>
        ) : null}

        {/* Next button */}
        {state.completed && (
          <TouchableOpacity onPress={canNext ? onNext : undefined} activeOpacity={0.8}>
            <LinearGradient
              colors={[`${color}28`, `${color}12`]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 10, paddingVertical: 15, borderRadius: 16,
                borderWidth: 1, borderColor: `${color}38`,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', letterSpacing: 0.8 }}>
                {canNext ? 'Dhikr Suivant' : 'Session Accomplie'}
              </Text>
              {canNext && <ChevronRight size={18} color={color} />}
              {!canNext && <CheckCircle size={18} color={color} />}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Animated.View>
  );
});

// ─── Add Custom Dhikr Modal ────────────────────────────────────
const AddDhikrModal = memo(({ visible, sessionTime, onAdd, onClose }: {
  visible: boolean;
  sessionTime: SessionTime;
  onAdd: (d: Dhikr) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    title: '', arabic: '', transliteration: '', translation: '', virtue: '', count: '1',
  });
  const [selectedColor, setSelectedColor] = useState(0);
  const slideUp = useRef(new Animated.Value(H)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideUp, { toValue: 0, damping: 22, stiffness: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideUp, { toValue: H, duration: 240, useNativeDriver: true }).start();
      setForm({ title: '', arabic: '', transliteration: '', translation: '', virtue: '', count: '1' });
    }
  }, [visible]);

  const handleAdd = () => {
    if (!form.title.trim() || !form.arabic.trim()) {
      Alert.alert('Champs requis', 'Le titre et le texte arabe sont obligatoires.');
      return;
    }
    const c = COLOR_OPTIONS[selectedColor];
    const d = createCustomDhikr(sessionTime, {
      title: form.title.trim(),
      arabic: form.arabic.trim(),
      transliteration: form.transliteration.trim(),
      translation: form.translation.trim(),
      virtue: form.virtue.trim(),
      defaultCount: Math.max(1, parseInt(form.count, 10) || 1),
      color: c.color,
      glow: c.glow,
    });
    onAdd(d);
    onClose();
  };

  const F = (label: string, key: keyof typeof form, opts?: { multiline?: boolean; placeholder?: string }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: P.w50, fontSize: 11, letterSpacing: 1, fontWeight: '700', marginBottom: 6 }}>
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={form[key]}
        onChangeText={v => setForm(p => ({ ...p, [key]: v }))}
        style={{
          color: '#fff', fontSize: opts?.multiline ? 16 : 14,
          borderWidth: 1, borderColor: P.borderMid,
          borderRadius: 12, paddingHorizontal: 14,
          paddingVertical: opts?.multiline ? 12 : 10,
          backgroundColor: P.w04,
          minHeight: opts?.multiline ? 80 : undefined,
          textAlignVertical: opts?.multiline ? 'top' : 'center',
          textAlign: key === 'arabic' ? 'right' : 'left',
          writingDirection: key === 'arabic' ? 'rtl' : 'ltr',
        }}
        placeholder={opts?.placeholder ?? ''}
        placeholderTextColor={P.w30}
        multiline={opts?.multiline}
        keyboardType={key === 'count' ? 'number-pad' : 'default'}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        <Animated.View style={{
          transform: [{ translateY: slideUp }],
          backgroundColor: P.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          borderTopWidth: 1, borderColor: P.border,
          maxHeight: H * 0.88,
        }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Header */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
              borderBottomWidth: 1, borderBottomColor: P.border,
            }}>
              <Text style={{ color: P.w90, fontSize: 16, fontWeight: '600' }}>
                Ajouter un Dhikr
              </Text>
              <TouchableOpacity onPress={onClose}>
                <X size={22} color={P.w50} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
              {F('Titre *', 'title', { placeholder: 'Ex: Mon dhikr personnel' })}
              {F('Texte Arabe *', 'arabic', { multiline: true, placeholder: 'النص العربي' })}
              {F('Translitteration', 'transliteration', { placeholder: 'Transliteration phonetique' })}
              {F('Traduction', 'translation', { multiline: true, placeholder: 'Traduction en francais' })}
              {F('Vertu / Bienfait', 'virtue', { multiline: true, placeholder: 'Source ou vertu de ce dhikr' })}
              {F('Nombre de repetitions', 'count', { placeholder: '1' })}

              {/* Color picker */}
              <Text style={{ color: P.w50, fontSize: 11, letterSpacing: 1, fontWeight: '700', marginBottom: 10 }}>
                COULEUR
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                {COLOR_OPTIONS.map((c, i) => (
                  <TouchableOpacity key={c.name} onPress={() => setSelectedColor(i)}>
                    <View style={{
                      width: 32, height: 32, borderRadius: 10,
                      backgroundColor: `${c.color}30`,
                      borderWidth: 2,
                      borderColor: selectedColor === i ? c.color : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <View style={{
                        width: 16, height: 16, borderRadius: 8, backgroundColor: c.color,
                      }} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add button */}
              <TouchableOpacity onPress={handleAdd} activeOpacity={0.85}>
                <LinearGradient
                  colors={[`${COLOR_OPTIONS[selectedColor].color}40`, `${COLOR_OPTIONS[selectedColor].color}20`]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
                    borderWidth: 1, borderColor: `${COLOR_OPTIONS[selectedColor].color}50`,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.8 }}>
                    Ajouter ce Dhikr
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
});

// ─── Personalization Screen ────────────────────────────────────
const PersonalizationScreen = memo(({
  sessionTime, prefs, onUpdatePrefs, onClose,
}: {
  sessionTime: SessionTime;
  prefs: SessionPrefs;
  onUpdatePrefs: (p: SessionPrefs) => void;
  onClose: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const baseDhikr = sessionTime === 'morning' ? getMorningAzkaar() : getEveningAzkaar();
  const [local, setLocal] = useState<SessionPrefs>({
    selectedIds: [...prefs.selectedIds],
    customCounts: { ...prefs.customCounts },
    customDhikr: [...prefs.customDhikr],
  });
  const [showAdd, setShowAdd] = useState(false);

  const allDhikr = useMemo(() => [
    ...baseDhikr,
    ...local.customDhikr.filter(d => d.time === sessionTime || d.time === 'both'),
  ], [baseDhikr, local.customDhikr, sessionTime]);

  const sessionColor = sessionTime === 'morning' ? P.morning : P.evening;

  const toggleId = (id: string) => {
    setLocal(p => {
      const next = p.selectedIds.includes(id)
        ? p.selectedIds.filter(x => x !== id)
        : [...p.selectedIds, id];
      return { ...p, selectedIds: next.length === 0 ? [id] : next };
    });
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const setCount = (id: string, val: string) => {
    const n = parseInt(val, 10);
    if (val === '' || isNaN(n)) {
      setLocal(p => ({ ...p, customCounts: { ...p.customCounts, [id]: 1 } }));
    } else {
      setLocal(p => ({ ...p, customCounts: { ...p.customCounts, [id]: Math.max(1, Math.min(9999, n)) } }));
    }
  };

  const adjustCount = (id: string, delta: number, dhikr: Dhikr) => {
    const cur = local.customCounts[id] ?? dhikr.defaultCount;
    setCount(id, String(Math.max(1, cur + delta)));
  };

  const deleteCustom = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer ce dhikr personnalise ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: () => setLocal(p => ({
          ...p,
          customDhikr: p.customDhikr.filter(d => d.id !== id),
          selectedIds: p.selectedIds.filter(x => x !== id),
        })),
      },
    ]);
  };

  const addCustom = (d: Dhikr) => {
    setLocal(p => ({
      ...p,
      customDhikr: [...p.customDhikr, d],
      selectedIds: [...p.selectedIds, d.id],
      customCounts: { ...p.customCounts, [d.id]: d.defaultCount },
    }));
  };

  const selectAll = () => {
    const allIds = allDhikr.map(d => d.id);
    const allSelected = allIds.every(id => local.selectedIds.includes(id));
    setLocal(p => ({
      ...p,
      selectedIds: allSelected ? [allIds[0]] : allIds,
    }));
  };

  const save = () => {
    onUpdatePrefs(local);
    onClose();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* FIX: En-tête — utilise insets.top pour que rien ne soit caché */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: insets.top + 12,
        paddingBottom: 14,
        borderBottomWidth: 1, borderBottomColor: P.border,
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 8, marginLeft: -8 }}>
          <ArrowLeft size={22} color={P.w70} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: P.w90, fontSize: 15, fontWeight: '600' }}>Personnalisation</Text>
          <Text style={{ color: sessionColor, fontSize: 10, marginTop: 2, letterSpacing: 1.5 }}>
            {sessionTime === 'morning' ? 'AZKAAR DU MATIN' : 'AZKAAR DU SOIR'}
          </Text>
        </View>
        <TouchableOpacity onPress={save} style={{
          paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16,
          backgroundColor: `${sessionColor}20`,
          borderWidth: 1, borderColor: `${sessionColor}40`,
        }}>
          <Text style={{ color: sessionColor, fontSize: 13, fontWeight: '700' }}>Sauver</Text>
        </TouchableOpacity>
      </View>

      {/* Select all + Add button row */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 18, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: P.border,
      }}>
        <TouchableOpacity onPress={selectAll} style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
        }}>
          <View style={{
            width: 24, height: 24, borderRadius: 7,
            backgroundColor: allDhikr.every(d => local.selectedIds.includes(d.id))
              ? `${sessionColor}30` : P.w08,
            borderWidth: 1,
            borderColor: allDhikr.every(d => local.selectedIds.includes(d.id))
              ? sessionColor : P.border,
            alignItems: 'center', justifyContent: 'center',
          }}>
            {allDhikr.every(d => local.selectedIds.includes(d.id)) && (
              <Check size={13} color={sessionColor} />
            )}
          </View>
          <Text style={{ color: P.w70, fontSize: 13 }}>Tout selectionner</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowAdd(true)} style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          paddingHorizontal: 12, paddingVertical: 7,
          borderRadius: 12, borderWidth: 1,
          borderColor: `${sessionColor}40`, backgroundColor: `${sessionColor}12`,
        }}>
          <Plus size={14} color={sessionColor} />
          <Text style={{ color: sessionColor, fontSize: 12, fontWeight: '600' }}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {allDhikr.map((dhikr, idx) => {
          const selected = local.selectedIds.includes(dhikr.id);
          const count = local.customCounts[dhikr.id] ?? dhikr.defaultCount;
          const countStr = String(count);
          return (
            <View key={dhikr.id} style={{
              marginHorizontal: 14, marginVertical: 5,
              borderRadius: 16, borderWidth: 1,
              borderColor: selected ? `${dhikr.color}28` : P.border,
              backgroundColor: selected ? `${dhikr.color}07` : P.w04,
              overflow: 'hidden',
            }}>
              {/* Left accent */}
              <View style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                backgroundColor: selected ? dhikr.color : 'transparent',
                borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
              }} />

              <View style={{ padding: 14, paddingLeft: 18 }}>
                {/* Top row */}
                <View style={{
                  flexDirection: 'row', alignItems: 'flex-start',
                  justifyContent: 'space-between', marginBottom: 8,
                }}>
                  <View style={{ flex: 1, gap: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {dhikr.isCustom && (
                        <View style={{
                          paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5,
                          backgroundColor: `${dhikr.color}20`,
                        }}>
                          <Text style={{ color: dhikr.color, fontSize: 8, fontWeight: '700' }}>
                            PERSO
                          </Text>
                        </View>
                      )}
                      <Text style={{ color: dhikr.color, fontSize: 11, letterSpacing: 1, fontWeight: '700' }}>
                        {String(idx + 1).padStart(2, '0')} — {dhikr.title}
                      </Text>
                    </View>
                    <Text style={{
                      color: selected ? P.w70 : P.w30, fontSize: 12, lineHeight: 17,
                    }} numberOfLines={2}>
                      {dhikr.translation || dhikr.transliteration}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginLeft: 10, marginTop: 2 }}>
                    {dhikr.isCustom && (
                      <TouchableOpacity onPress={() => deleteCustom(dhikr.id)} style={{ padding: 4 }}>
                        <Trash2 size={15} color="rgba(239,68,68,0.7)" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => toggleId(dhikr.id)}>
                      <View style={{
                        width: 26, height: 26, borderRadius: 8,
                        backgroundColor: selected ? `${dhikr.color}28` : P.w08,
                        borderWidth: 1,
                        borderColor: selected ? dhikr.color : P.borderMid,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        {selected && <Check size={13} color={dhikr.color} />}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Count adjuster — shown only if selected */}
                {selected && (
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                    paddingTop: 10, borderTopWidth: 1,
                    borderTopColor: `${dhikr.color}14`,
                  }}>
                    <Text style={{ color: P.w50, fontSize: 11, flex: 1 }}>
                      Repetitions :
                    </Text>
                    {/* Minus */}
                    <TouchableOpacity
                      onPress={() => adjustCount(dhikr.id, -1, dhikr)}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        backgroundColor: P.w08, borderWidth: 1, borderColor: P.border,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Minus size={14} color={P.w70} />
                    </TouchableOpacity>

                    {/* Text input for direct entry */}
                    <TextInput
                      value={countStr}
                      onChangeText={v => setCount(dhikr.id, v.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      style={{
                        color: dhikr.color, fontSize: 16, fontWeight: '700',
                        minWidth: 48, textAlign: 'center',
                        borderWidth: 1, borderColor: `${dhikr.color}30`,
                        borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
                        backgroundColor: `${dhikr.color}10`,
                      }}
                      selectTextOnFocus
                    />

                    {/* Plus */}
                    <TouchableOpacity
                      onPress={() => adjustCount(dhikr.id, 1, dhikr)}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        backgroundColor: P.w08, borderWidth: 1, borderColor: P.border,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Plus size={14} color={P.w70} />
                    </TouchableOpacity>

                    {/* Reset to default */}
                    <TouchableOpacity
                      onPress={() => setCount(dhikr.id, String(dhikr.defaultCount))}
                      style={{ padding: 4 }}
                    >
                      <RotateCcw size={13} color={P.w30} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 50 }} />
      </ScrollView>

      <AddDhikrModal
        visible={showAdd}
        sessionTime={sessionTime}
        onAdd={addCustom}
        onClose={() => setShowAdd(false)}
      />
    </View>
  );
});

// ─── Completion Screen ─────────────────────────────────────────
const CompletionScreen = memo(({ sessionTime, completedCount, onRestart }: {
  sessionTime: SessionTime; completedCount: number; onRestart: () => void;
}) => {
  const op    = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const starR = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(op,    { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, damping: 16, stiffness: 110, useNativeDriver: true }),
      Animated.timing(starR, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ]).start();
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);
  const color = sessionTime === 'morning' ? P.morning : P.evening;
  const starRot = starR.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{
      flex: 1, alignItems: 'center', justifyContent: 'center',
      padding: 32, opacity: op, transform: [{ scale }],
    }}>
      <Animated.View style={{
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: `${color}18`, borderWidth: 1.5,
        borderColor: `${color}45`, alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
        transform: [{ rotate: starRot }],
      }}>
        <Star size={40} color={color} strokeWidth={1.5} />
      </Animated.View>

      <Text style={{ color: P.w90, fontSize: 26, fontWeight: '200', textAlign: 'center', marginBottom: 10 }}>
        Session Accomplie
      </Text>
      <Text style={{ color: P.gold, fontSize: 17, fontStyle: 'italic', textAlign: 'center', marginBottom: 6 }}>
        {sessionTime === 'morning' ? 'Azkaar du Matin' : 'Azkaar du Soir'}
      </Text>
      <Text style={{ color: P.w50, fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
        {completedCount} dhikr accomplis
      </Text>

      <LinearGradient
        colors={['transparent', P.gold, 'transparent']}
        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={{ width: W * 0.55, height: 1, opacity: 0.28, marginBottom: 28 }}
      />

      <Text style={{
        color: P.w30, fontSize: 13, fontStyle: 'italic', textAlign: 'center',
        lineHeight: 24, marginBottom: 40, paddingHorizontal: 20,
      }}>
        "Et invoquez votre Seigneur en vous-meme, avec humilite et crainte respectueuse..."{'\n'}
        — Al-A'raf 7:205
      </Text>

      <TouchableOpacity onPress={onRestart} activeOpacity={0.82}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          paddingHorizontal: 28, paddingVertical: 13, borderRadius: 28,
          borderWidth: 1, borderColor: `${color}38`, backgroundColor: `${color}10`,
        }}>
          <RotateCcw size={16} color={color} />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Recommencer</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── MAIN SCREEN ───────────────────────────────────────────────
const AzkaarScreen = ({ onBack }: { onBack?: () => void }) => {
  // FIX: useSafeAreaInsets pour gérer correctement le notch/dynamic island
  const navigation = useNavigation();
  const handleBack = useCallback(() => { if (onBack) onBack(); else navigation.goBack(); }, [onBack, navigation]);

  // FIX: useSafeAreaInsets pour gérer correctement le notch/dynamic island
  const insets = useSafeAreaInsets();

  const [sessionTime, setSessionTime] = useState<SessionTime>('morning');
  const [showPersonal, setShowPersonal] = useState(false);
  const [sessionDone, setSessionDone]   = useState(false);
  const [currentIdx, setCurrentIdx]     = useState(0);

  // Per-session prefs
  const [morningPrefs, setMorningPrefs] = useState<SessionPrefs>(() => {
    const ids = getMorningAzkaar().map(d => d.id);
    const counts: Record<string, number> = {};
    getMorningAzkaar().forEach(d => { counts[d.id] = d.defaultCount; });
    return { selectedIds: ids, customCounts: counts, customDhikr: [] };
  });
  const [eveningPrefs, setEveningPrefs] = useState<SessionPrefs>(() => {
    const ids = getEveningAzkaar().map(d => d.id);
    const counts: Record<string, number> = {};
    getEveningAzkaar().forEach(d => { counts[d.id] = d.defaultCount; });
    return { selectedIds: ids, customCounts: counts, customDhikr: [] };
  });

  const prefs = sessionTime === 'morning' ? morningPrefs : eveningPrefs;
  const setPrefs = sessionTime === 'morning' ? setMorningPrefs : setEveningPrefs;

  const [dhikrStates, setDhikrStates] = useState<Record<string, DhikrState>>({});

  const activeDhikr = useMemo(() => {
    const base = sessionTime === 'morning' ? getMorningAzkaar() : getEveningAzkaar();
    const custom = prefs.customDhikr.filter(d => d.time === sessionTime || d.time === 'both');
    return [...base, ...custom].filter(d => prefs.selectedIds.includes(d.id));
  }, [sessionTime, prefs]);

  const current = activeDhikr[currentIdx];

  const getState = useCallback((id: string): DhikrState =>
    dhikrStates[id] ?? { count: 0, completed: false },
    [dhikrStates]
  );

  const getTarget = useCallback((id: string, dhikr: Dhikr) =>
    prefs.customCounts[id] ?? dhikr.defaultCount,
    [prefs.customCounts]
  );

  const handleCount = useCallback(() => {
    if (!current) return;
    const id     = current.id;
    const target = getTarget(id, current);
    setDhikrStates(prev => {
      const cur      = prev[id] ?? { count: 0, completed: false };
      const newCount = cur.count + 1;
      const completed = newCount >= target;
      if (completed && Platform.OS === 'ios')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { ...prev, [id]: { count: newCount, completed } };
    });
  }, [current, getTarget]);

  const handleNext = useCallback(() => {
    if (currentIdx < activeDhikr.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setSessionDone(true);
    }
  }, [currentIdx, activeDhikr.length]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  }, [currentIdx]);

  const handleTimeSwitch = useCallback((t: SessionTime) => {
    if (t === sessionTime) return;
    setSessionTime(t);
    setCurrentIdx(0);
    setDhikrStates({});
    setSessionDone(false);
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [sessionTime]);

  const handleRestart = useCallback(() => {
    setDhikrStates({});
    setCurrentIdx(0);
    setSessionDone(false);
  }, []);

  const updatePrefs = useCallback((p: SessionPrefs) => {
    setPrefs(p);
    setCurrentIdx(0);
    setDhikrStates({});
    setSessionDone(false);
  }, [setPrefs]);

  const completedCount = useMemo(() =>
    activeDhikr.filter(d => dhikrStates[d.id]?.completed).length,
    [activeDhikr, dhikrStates]
  );

  const sessionColor = sessionTime === 'morning' ? P.morning : P.evening;
  const bgColors: [string, string, string] = sessionTime === 'morning'
    ? [P.night, '#0C0905', P.black]
    : [P.night, '#04060D', P.black];

  // ── Personalization overlay ──────────────────────────────────
  if (showPersonal) {
    return (
      <View style={{ flex: 1, backgroundColor: P.night }}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={bgColors} style={StyleSheet.absoluteFillObject} />
        <AmbientGlow color={sessionColor} />
        <PersonalizationScreen
          sessionTime={sessionTime}
          prefs={prefs}
          onUpdatePrefs={updatePrefs}
          onClose={() => setShowPersonal(false)}
        />
      </View>
    );
  }

  // Bottom nav arrows height + safe area
  const bottomNavBottom = insets.bottom + 24;

  // ── Main session view ────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: P.black }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={bgColors} style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }} end={{ x: 0.2, y: 1 }}
      />
      <AmbientGlow color={sessionColor} />
      <AmbientParticles color={sessionColor} />

      {/* ── Top bar — FIX: paddingTop via insets.top pour éviter le clipping ── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: insets.top + 10,
        paddingBottom: 14,
        borderBottomWidth: 1, borderBottomColor: P.border,
        backgroundColor: 'rgba(0,0,0,0.35)',
      }}>
        <TouchableOpacity onPress={handleBack} style={{ padding: 8, marginLeft: -8 }}>
          <ArrowLeft size={22} color={P.w70} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: P.w90, fontSize: 18, fontWeight: '300', letterSpacing: 0.5 }}>
            الأذكار
          </Text>
          <Text style={{ color: P.w30, fontSize: 9, letterSpacing: 2.5 }}>AZKAAR</Text>
        </View>
        <TouchableOpacity onPress={() => setShowPersonal(true)} style={{
          padding: 9, borderRadius: 12, backgroundColor: P.w08,
        }}>
          <Settings size={18} color={P.w70} />
        </TouchableOpacity>
      </View>

      {/* ── Morning / Evening toggle ── */}
      <View style={{
        flexDirection: 'row', marginHorizontal: 20, marginTop: 14, marginBottom: 8,
        borderRadius: 16, backgroundColor: P.w04,
        borderWidth: 1, borderColor: P.border, padding: 4,
      }}>
        {(['morning', 'evening'] as SessionTime[]).map(t => {
          const active = sessionTime === t;
          const tc = t === 'morning' ? P.morning : P.evening;
          return (
            <TouchableOpacity key={t} onPress={() => handleTimeSwitch(t)} style={{ flex: 1 }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 8, paddingVertical: 11,
                borderRadius: 12,
                backgroundColor: active ? `${tc}18` : 'transparent',
                borderWidth: active ? 1 : 0, borderColor: active ? `${tc}45` : 'transparent',
              }}>
                {t === 'morning'
                  ? <Sun size={15} color={active ? tc : P.w30} />
                  : <Moon size={15} color={active ? tc : P.w30} />
                }
                <Text style={{
                  color: active ? '#fff' : P.w30,
                  fontSize: 13, fontWeight: active ? '600' : '400',
                }}>
                  {t === 'morning' ? 'Matin' : 'Soir'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Progress row ── */}
      {!sessionDone && (
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 22, paddingBottom: 6,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: sessionColor }} />
            <Text style={{ color: P.w50, fontSize: 12 }}>
              <Text style={{ color: sessionColor, fontWeight: '700' }}>{completedCount}</Text>
              /{activeDhikr.length} accomplis
            </Text>
          </View>
          {current && (
            <Text style={{ color: P.w30, fontSize: 11 }}>
              {currentIdx + 1} / {activeDhikr.length}
            </Text>
          )}
        </View>
      )}

      {/* ── Content ── */}
      <View style={{ flex: 1 }}>
        {sessionDone ? (
          <CompletionScreen
            sessionTime={sessionTime}
            completedCount={completedCount}
            onRestart={handleRestart}
          />
        ) : activeDhikr.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <AlertCircle size={32} color={P.w30} />
            <Text style={{ color: P.w50, fontSize: 14 }}>Aucun dhikr selectionne</Text>
            <TouchableOpacity onPress={() => setShowPersonal(true)}>
              <Text style={{ color: sessionColor, fontSize: 14 }}>
                Ouvrir la personnalisation
              </Text>
            </TouchableOpacity>
          </View>
        ) : current ? (
          <DhikrCard
            dhikr={current}
            state={getState(current.id)}
            totalCount={getTarget(current.id, current)}
            index={currentIdx}
            total={activeDhikr.length}
            onCount={handleCount}
            onNext={handleNext}
            onPrev={handlePrev}
            canPrev={currentIdx > 0}
            canNext={currentIdx < activeDhikr.length - 1}
            bottomInset={insets.bottom}
          />
        ) : null}
      </View>

      {/* ── Bottom navigation arrows ── */}
      {!sessionDone && current && (
        <View style={{
          position: 'absolute',
          bottom: bottomNavBottom,
          left: 0, right: 0,
          flexDirection: 'row', justifyContent: 'space-between',
          paddingHorizontal: 28,
        }}>
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIdx === 0}
            style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: P.w08, borderWidth: 1, borderColor: P.border,
              alignItems: 'center', justifyContent: 'center',
              opacity: currentIdx === 0 ? 0.25 : 1,
            }}
          >
            <ChevronLeft size={22} color={P.w70} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={!getState(current.id).completed}
            style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: getState(current.id).completed
                ? `${sessionColor}20` : P.w04,
              borderWidth: 1,
              borderColor: getState(current.id).completed
                ? `${sessionColor}40` : P.border,
              alignItems: 'center', justifyContent: 'center',
              opacity: getState(current.id).completed ? 1 : 0.25,
            }}
          >
            <ChevronRight size={22} color={
              getState(current.id).completed ? sessionColor : P.w70
            } />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AzkaarScreen;