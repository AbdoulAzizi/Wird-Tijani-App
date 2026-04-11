// utils/OpenRawdatDhikr.ts — Wird Tijāni
//
// Strategy: always attempt Linking.openURL() directly.
// canOpenURL() is unreliable for cross-app custom schemes even with
// manifestQueries declared — it depends on the build cache and device.
// openURL() itself is the ground truth:
//   • App installed   → opens immediately, no error
//   • App not installed → Android raises ActivityNotFoundException (caught)
//
// UI: a centered modal (InstallPromptModal) is shown when the app is not
// installed. This is better than a toast because:
//   • The user cannot miss it
//   • Two clear action buttons: "Install" and "Later"
//   • Dismissable by tapping the backdrop

import React, {
  useState, useCallback, createContext, useContext,
  useRef, useEffect,
} from 'react';
import {
  Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback,
  StyleSheet, Animated, Platform, Linking, Dimensions,
} from 'react-native';
import { ExternalLink, X, Download } from 'lucide-react-native';

// ─── Store URLs ───────────────────────────────────────────────────────────────
const RD_SCHEME        = 'rawdatdhikr://';
const RD_PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.rawdatdhikr.app';
const RD_APPSTORE_URL  = 'https://apps.apple.com/app/rawdat-dhikr/id0000000000'; // ← replace

// ─── Screen map ───────────────────────────────────────────────────────────────
const SCREEN_PATHS: Record<string, string> = {
  'dhikr-counter': 'dhikr-counter',
  'azkars':        'azkars',
  'asmaa-alhusna': 'asmaa-alhusna',
  'asmaa-nabi':    'asmaa-nabi',
  'suwar':         'suwar',
  'hadra-station': 'hadra-station',
};

// ─── Global modal trigger ─────────────────────────────────────────────────────
// A simple event emitter so openRawdatDhikr() (a plain function, not a hook)
// can trigger the modal that lives in the React tree.
type Listener = () => void;
let _listener: Listener | null = null;
function _registerListener(fn: Listener) { _listener = fn; }
function _triggerModal()                  { _listener?.(); }

// ─── InstallPromptModal ───────────────────────────────────────────────────────
const { width } = Dimensions.get('window');

export function InstallPromptModal() {
  const [visible, setVisible] = useState(false);
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Register this modal instance as the global listener
  useEffect(() => {
    _registerListener(() => setVisible(true));
    return () => { _listener = null; };
  }, []);

  // Animate in / out
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1,    useNativeDriver: true, damping: 18, stiffness: 260 }),
        Animated.timing(opacityAnim, { toValue: 1,    duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 0.85, useNativeDriver: true, damping: 20, stiffness: 300 }),
        Animated.timing(opacityAnim, { toValue: 0,    duration: 140, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const storeUrl = Platform.OS === 'ios' ? RD_APPSTORE_URL : RD_PLAYSTORE_URL;
  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Play Store';

  const handleInstall = useCallback(() => {
    setVisible(false);
    setTimeout(() => Linking.openURL(storeUrl), 300);
  }, [storeUrl]);

  const handleDismiss = useCallback(() => setVisible(false), []);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View style={[m.backdrop, { opacity: opacityAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[m.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>

              {/* Close button */}
              <TouchableOpacity style={m.closeBtn} onPress={handleDismiss} activeOpacity={0.7}>
                <X color="#94A3B8" size={18} strokeWidth={2.5} />
              </TouchableOpacity>

              {/* Icon */}
              <View style={m.iconCircle}>
                <Text style={m.iconEmoji}>🌿</Text>
              </View>

              {/* Title */}
              <Text style={m.title}>Rawdat Dhikr</Text>
              <Text style={m.arabicSubtitle}>رَوْضَةُ الذِّكْر</Text>

              {/* Divider */}
              <View style={m.divider} />

              {/* Description */}
              <Text style={m.desc}>
                This feature is part of{' '}
                <Text style={m.descBold}>Rawdat Dhikr</Text>
                , our companion app.{'\n'}
                Install it to access Dhikr Counter,{'\n'}
                Daily Adhkaar, Al-Hadra, and more.
              </Text>

              {/* Feature pills */}
              <View style={m.pillsRow}>
                {['Dhikr', 'Adhkaar', "Qur'ān", 'Al-Hadra'].map(f => (
                  <View key={f} style={m.pill}>
                    <Text style={m.pillText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* CTA buttons */}
              <TouchableOpacity style={m.installBtn} onPress={handleInstall} activeOpacity={0.85}>
                <Download color="#FFFFFF" size={16} strokeWidth={2.5} />
                <Text style={m.installBtnText}>Install on {storeName}</Text>
                <ExternalLink color="rgba(255,255,255,0.60)" size={13} strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={m.laterBtn} onPress={handleDismiss} activeOpacity={0.7}>
                <Text style={m.laterBtnText}>Maybe later</Text>
              </TouchableOpacity>

            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ─── Main function ────────────────────────────────────────────────────────────
/**
 * Opens Rawdat Dhikr on a specific screen.
 * If not installed, shows a centered install prompt modal.
 *
 * @param screen  Optional screen key (see SCREEN_PATHS above).
 *
 * @example
 *   openRawdatDhikr();                  // home
 *   openRawdatDhikr('dhikr-counter');   // Dhikr Counter screen
 *   openRawdatDhikr('asmaa-alhusna');   // 99 Names screen
 */
export async function openRawdatDhikr(screen?: string) {
  const path     = screen ? (SCREEN_PATHS[screen] ?? '') : '';
  const deepLink = path ? `${RD_SCHEME}${path}` : RD_SCHEME;

  // Flush current touch event before backgrounding Wird Tijāni
  await new Promise(r => setTimeout(r, 100));

  try {
    await Linking.openURL(deepLink);
    // If we reach here on Android, the app opened successfully.
    // On iOS, openURL resolves even if no handler — we rely on the catch.
  } catch {
    // Android: ActivityNotFoundException → app not installed
    // iOS: no handler registered → app not installed
    _triggerModal();
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const INDIGO  = '#6366F1';
const INDIGO2 = '#818CF8';
const NAVY    = '#050A1F';

const m = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.60)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: Math.min(width - 48, 360),
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 24,
    position: 'relative',
  },

  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: 'rgba(99,102,241,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 32 },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  arabicSubtitle: {
    fontSize: 14,
    color: INDIGO,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  divider: {
    width: 40,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },

  desc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  descBold: {
    fontWeight: '700',
    color: '#1E293B',
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  pill: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: INDIGO,
  },

  installBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: INDIGO,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: INDIGO,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  installBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  laterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  laterBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
});