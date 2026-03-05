// hooks/useSwipeDrawer.ts

import { useRef } from 'react';
import { Animated, PanResponder, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const DRAWER_WIDTH    = 300;
const SWIPE_THRESHOLD = 150;

interface Options {
  enabled: boolean;
  onOpen:  () => void;
}

export function useSwipeDrawer({ enabled, onOpen }: Options) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const collapse = () =>
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, damping: 20, stiffness: 200 }),
      Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        enabled && gs.dx > 10 && Math.abs(gs.dy) < 80,

      onPanResponderGrant: () => {
        if (Platform.OS === 'ios')
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },

      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0 && gs.dx < DRAWER_WIDTH) {
          slideAnim.setValue(-DRAWER_WIDTH + gs.dx);
          fadeAnim.setValue(gs.dx / DRAWER_WIDTH);
        }
      },

      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD || gs.vx > 0.5) onOpen();
        else collapse();
      },
    }),
  ).current;

  return panResponder.panHandlers;
}