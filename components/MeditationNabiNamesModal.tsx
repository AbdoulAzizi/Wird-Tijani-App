import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Animated, Easing, Dimensions,
} from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { ProphetName } from '@/data/prophetNames';
import { THEME_COLORS } from '@/data/prophetNames';

const { width: W, height: H } = Dimensions.get('window');

interface MeditationModalProps {
  visible: boolean;
  name: ProphetName | null;
  dark: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function MeditationModal({
  visible, name, dark, onClose, onPrev, onNext, hasPrev, hasNext,
}: MeditationModalProps) {
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.92)).current;
  const glowAnim    = useRef(new Animated.Value(0)).current;
  const floatAnim   = useRef(new Animated.Value(0)).current;
  const glowLoop    = useRef<Animated.CompositeAnimation | null>(null);
  const floatLoop   = useRef<Animated.CompositeAnimation | null>(null);

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
  }, [onNext]);

  const handlePrev = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 200, useNativeDriver: true }),
    ]).start();
    onPrev();
  }, [onPrev]);

  if (!name) return null;

  const theme     = THEME_COLORS[name.theme];
  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const glowOp    = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.40] });
  const floatY    = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      {/* Deep dark backdrop */}
      <Animated.View style={[mm.backdrop, { opacity: fadeAnim }]}>
        {/* Radial glow */}
        <Animated.View style={[
          mm.glow,
          { backgroundColor: theme.border, opacity: glowOp, transform: [{ scale: glowScale }] },
        ]} />

        <Animated.View style={[mm.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

          {/* Close button */}
          <TouchableOpacity style={mm.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X color="#FFFFFF" size={20} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Number */}
          <View style={[mm.numberWrap, { borderColor: theme.border + '60' }]}>
            <Text style={[mm.numberText, { color: theme.text }]}>{name.id} / 201</Text>
          </View>

          {/* Floating Arabic */}
          <Animated.Text style={[
            mm.arabic,
            { color: '#FFFFFF', transform: [{ translateY: floatY }],
              textShadowColor: theme.border,
              textShadowRadius: 30,
            },
          ]}>
            {name.arabic}
          </Animated.Text>

          {/* Divider */}
          <View style={[mm.divider, { backgroundColor: theme.border + '40' }]} />

          {/* Transliteration */}
          <Text style={[mm.transliteration, { color: theme.text }]}>
            {name.transliteration}
          </Text>

          {/* Translation */}
          <Text style={mm.translation}>{name.translation}</Text>

          {/* Description */}
          {!!name.description && (
            <View style={[mm.descWrap, { borderColor: theme.border + '40', backgroundColor: theme.border + '12' }]}>
              <Text style={[mm.desc, { color: theme.text }]}>{name.description}</Text>
            </View>
          )}

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

            <View style={[mm.navDots]}>
              <Text style={[mm.navLabel, { color: theme.text }]}>{name.theme.toUpperCase()}</Text>
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberWrap: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 36,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  arabic: {
    fontSize: 42,
    textAlign: 'center',
    lineHeight: 64,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 28,
  },
  divider: {
    width: 60,
    height: 1,
    marginBottom: 20,
  },
  transliteration: {
    fontSize: 16,
    fontStyle: 'italic',
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
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  descWrap: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 36,
    width: '100%',
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
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