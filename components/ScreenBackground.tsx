import { ImageBackground, StyleSheet, View } from 'react-native';
import { useApp } from '../contexts/AppContext';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  overlayOpacity?: number;
}

export default function ScreenBackground({
  children,
  overlayOpacity = 0.3,
}: ScreenBackgroundProps) {
  const { state } = useApp();
  const dark = state.settings.darkMode;

  return (
    <ImageBackground
      source={require('../assets/body-pattern.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: dark
              ? `rgba(0,0,0,${Math.min(0.5 + overlayOpacity * 0.2, 0.85)})`
              : `rgba(0,0,0,${overlayOpacity})`,
          },
        ]}
      >
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay:    { flex: 1 },
});