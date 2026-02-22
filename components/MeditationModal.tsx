import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Animated, Easing, Dimensions,
} from 'react-native';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NabiName } from '@/data/asmaaAnNabi';
import { CATEGORY_COLORS, CATEGORY_GRADIENTS, CATEGORY_LABELS } from '@/data/asmaaAnNabi';

const { width: W, height: H } = Dimensions.get('window');

const SALAWAT_BY_CAT: Record<string, string> = {
  essence:      'اللهم صلِّ على ذاتِه الشريفة',
  mercy:        'اللهم صلِّ على رحمتِه المُهداة',
  guidance:     'اللهم صلِّ على نُورِه الهادي',
  honor:        'اللهم صلِّ على سيِّدِ الخلق',
  intercession: 'اللهم صلِّ على شفيعِ الأمة',
  character:    'اللهم صلِّ على عظيمِ الأخلاق',
  mission:      'اللهم صلِّ على خاتمِ الأنبياء',
  quran:        'اللهم صلِّ على مَن نزل القرآن بحضرتِه',
};

interface MeditationModalProps {
  visible:  boolean;
  name:     NabiName | null;
  dark:     boolean;
  onClose:  () => void;
  onPrev:   () => void;
  onNext:   () => void;
  hasPrev:  boolean;
  hasNext:  boolean;
}

export default function MeditationModal({
  visible, name, dark, onClose, onPrev, onNext, hasPrev, hasNext,
}: MeditationModalProps) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowLoop  = useRef<Animated.CompositeAnimation | null>(null);
  const floatLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
      glowAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 180, useNativeDriver: true }),
      ]).start(() => {
        glowLoop.current = Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          ])
        );
        glowLoop.current.start();

        floatLoop.current = Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          ])
        );
        floatLoop.current.start();
      });
    } else {
      glowLoop.current?.stop();
      floatLoop.current?.stop();
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.92, duration: 250, useNativeDriver: true }),
      ]).start();
    }
    return () => { glowLoop.current?.stop(); floatLoop.current?.stop(); };
  }, [visible]);

  const handleNext = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 200, useNativeDriver: true }),
    ]).start();
    onNext();
  }, [onNext, scaleAnim]);

  const handlePrev = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 200, useNativeDriver: true }),
    ]).start();
    onPrev();
  }, [onPrev, scaleAnim]);

  if (!name) return null;

  const accentColor = CATEGORY_COLORS[name.category];
  const catLabel    = CATEGORY_LABELS[name.category];
  const salawat     = SALAWAT_BY_CAT[name.category] ?? 'اللهم صلِّ على سيدنا محمد';

  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const glowOp    = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.40] });
  const floatY    = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[mm.backdrop, { opacity: fadeAnim }]}>

        {/* Radial glow orb */}
        <Animated.View style={[
          mm.glow,
          { backgroundColor: accentColor, opacity: glowOp, transform: [{ scale: glowScale }] },
        ]} />

        <Animated.View style={[mm.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

          {/* Close */}
          <TouchableOpacity style={mm.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X color="#FFFFFF" size={20} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Number */}
          <View style={[mm.numberWrap, { borderColor: accentColor + '60' }]}>
            <Text style={[mm.numberText, { color: accentColor }]}>
              {String(name.id).padStart(3, '0')}  ·  201
            </Text>
          </View>

          {/* Gold shimmer line */}
          <LinearGradient
            colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={mm.goldLine}
          />

          {/* Floating Arabic */}
          <Animated.Text style={[
            mm.arabic,
            {
              transform: [{ translateY: floatY }],
              textShadowColor: accentColor,
              textShadowRadius: 30,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}>
            {name.arabic}
          </Animated.Text>

          {/* Divider */}
          <View style={[mm.divider, { backgroundColor: accentColor + '40' }]} />

          {/* Transliteration */}
          <Text style={[mm.transliteration, { color: accentColor }]}>
            {name.transliteration}
          </Text>

          {/* English meaning */}
          <Text style={mm.translation}>{name.english}</Text>

          {/* Category + source */}
          <View style={mm.metaRow}>
            <View style={[mm.catChip, { backgroundColor: accentColor + '20', borderColor: accentColor + '50' }]}>
              <Text style={[mm.catChipText, { color: accentColor }]}>
                {catLabel.toUpperCase()}
              </Text>
            </View>
            {name.source && (
              <View style={mm.sourceChip}>
                <BookOpen color="rgba(253,230,138,0.7)" size={10} strokeWidth={2} />
                <Text style={mm.sourceText}>{name.source}</Text>
              </View>
            )}
          </View>

          {/* Salawat block */}
          <View style={[mm.salawatWrap, { borderColor: accentColor + '35', backgroundColor: accentColor + '10' }]}>
            <Text style={[mm.salawatArabic, { color: accentColor }]}>{salawat}</Text>
            <Text style={mm.salawatSub}>صَلَّى اللّٰهُ عَلَيْهِ وَعَلَى آلِهِ وَسَلَّم</Text>
          </View>

          {/* Navigation */}
          <View style={mm.nav}>
            <TouchableOpacity
              style={[mm.navBtn, !hasPrev && mm.navBtnDisabled]}
              onPress={handlePrev}
              disabled={!hasPrev}
              activeOpacity={0.7}
            >
              <ChevronLeft color={hasPrev ? '#FFFFFF' : '#334155'} size={22} strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={mm.navDots}>
              <Text style={[mm.navLabel, { color: accentColor }]}>{catLabel.toUpperCase()}</Text>
            </View>

            <TouchableOpacity
              style={[mm.navBtn, !hasNext && mm.navBtnDisabled]}
              onPress={handleNext}
              disabled={!hasNext}
              activeOpacity={0.7}
            >
              <ChevronRight color={hasNext ? '#FFFFFF' : '#334155'} size={22} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const mm = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#020817',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: W * 1.2,
    height: W * 1.2,
    borderRadius: W * 0.6,
    top: H / 2 - W * 0.6,
  },
  content: {
    width: W - 40,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  closeBtn: {
    position: 'absolute',
    top: 0, right: 0,
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberWrap: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 20,
  },
  numberText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  goldLine: {
    height: 1.5,
    width: '65%',
    opacity: 0.65,
    marginBottom: 28,
  },
  arabic: {
    fontSize: 52,
    textAlign: 'center',
    lineHeight: 72,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 22,
  },
  divider: {
    width: 60,
    height: 1,
    marginBottom: 18,
  },
  transliteration: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  translation: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  catChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  catChipText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sourceText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(253,230,138,0.7)',
    letterSpacing: 0.5,
  },
  salawatWrap: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 36,
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  salawatArabic: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  salawatSub: {
    fontSize: 11,
    color: 'rgba(253,230,138,0.60)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  navBtn: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  navDots: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
});