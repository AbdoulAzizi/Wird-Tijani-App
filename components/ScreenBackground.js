import { ImageBackground, StyleSheet, View } from 'react-native';

export default function ScreenBackground({ children }) {
  return (
    <ImageBackground
      source={require('../assets/body-pattern.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1},
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
});
