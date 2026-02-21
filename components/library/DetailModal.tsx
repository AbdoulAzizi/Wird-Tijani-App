// components/library/DetailModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  Pressable,
  PanResponder,
} from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { FormulaDetail } from './FormulaDetail-fr';
import { MasterDetail } from './MasterDetail-fr';
import { BookDetail } from './BookDetail-fr';
import { PlaceDetail } from './PlaceDetail-fr';
import { WordDetail } from './WordDetail-fr';

const { height, width } = Dimensions.get('window');

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  type: 'formula' | 'master' | 'book' | 'place' | 'word';
  modalHeight?: number; // Pourcentage de la hauteur (0.5 à 0.95)
}

export const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  onClose,
  item,
  type,
  modalHeight = 0.85,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(height * modalHeight);

  // Calculer la hauteur maximale du modal
  const maxModalHeight = height * Math.min(Math.max(modalHeight, 0.5), 0.95);

  useEffect(() => {
    if (visible) {
      // Ouvrir le modal
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 150,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fermer le modal
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  // PanResponder pour fermer avec un swipe vers le bas
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dx) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 150,
          }).start();
        }
      },
    })
  ).current;

  if (!item) return null;

  const renderContent = () => {
    switch (type) {
      case 'formula':
        return <FormulaDetail item={item} />;
      case 'master':
        return <MasterDetail item={item} />;
      case 'book':
        return <BookDetail item={item} />;
      case 'place':
        return <PlaceDetail item={item} />;
      case 'word':
        return <WordDetail item={item} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        {/* Overlay avec fade - CORRECTION: Retrait de activeOpacity */}
        <Pressable 
          style={styles.overlay}
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.overlayBackground,
              { opacity: fadeAnim }
            ]} 
          />
        </Pressable>

        {/* Container du contenu avec slide et hauteur dynamique */}
        <Animated.View
          style={[
            styles.container,
            {
              height: maxModalHeight,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header avec dégradé et drag indicator */}
          <View style={styles.header} {...panResponder.panHandlers}>
            <View style={styles.dragIndicator} />
            
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title || item.name}
                </Text>
                {item.arabicTitle && (
                  <Text style={styles.arabicTitle}>{item.arabicTitle}</Text>
                )}
                {item.subtitle && (
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X color={COLORS.primary || '#059669'} size={24} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contenu scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {renderContent()}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    backgroundColor: COLORS.white || '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryPale || '#E8F5E9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: COLORS.background || '#F9FAFB',
    paddingTop: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary || '#1F2937',
    marginBottom: 6,
    lineHeight: 28,
  },
  arabicTitle: {
    fontSize: 20,
    color: COLORS.primary || '#059669',
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white || '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryPale || '#E8F5E9',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary || '#059669',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white || '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  bottomSpacing: {
    height: 20,
  },
});