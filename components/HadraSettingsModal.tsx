import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Info, RotateCcw } from 'lucide-react-native';

interface HadraSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentTargets: {
    tahlil: number;
    ismuLlah: number;
  };
  onSave: (targets: { tahlil: number; ismuLlah: number }) => void;
  darkMode?: boolean;
}

const DEFAULT_TARGETS = {
  tahlil: 800,
  ismuLlah: 400,
};

export default function HadraSettingsModal({
  visible,
  onClose,
  currentTargets,
  onSave,
  darkMode = false,
}: HadraSettingsModalProps) {
  const [tempTargets, setTempTargets] = useState(currentTargets);

  // Sync avec les props quand le modal s'ouvre
  useEffect(() => {
    if (visible) {
      setTempTargets(currentTargets);
    }
  }, [visible, currentTargets]);

  const handleTargetChange = useCallback((key: 'tahlil' | 'ismuLlah', text: string) => {
    const num = parseInt(text) || 0;
    setTempTargets(prev => ({ ...prev, [key]: Math.max(0, num) }));
  }, []);

  const handleResetToDefault = useCallback(() => {
    Alert.alert(
      'Reset to Default',
      'Reset targets to 800 (Tahlīl) and 400 (Ism Allāh)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => setTempTargets(DEFAULT_TARGETS)
        },
      ]
    );
  }, []);

  const handleSave = useCallback(() => {
    // Validation des valeurs
    if (tempTargets.tahlil < 1 || tempTargets.ismuLlah < 1) {
      Alert.alert(
        'Invalid Values',
        'Target numbers must be at least 1.',
        [{ text: 'OK' }]
      );
      return;
    }

    onSave(tempTargets);
    onClose();
  }, [tempTargets, onSave, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
        {/* Header */}
        <View style={[styles.header, darkMode && styles.headerDark]}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>⚙️</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDark]}>
              Customize Targets
            </Text>
          </View>
          <TouchableOpacity 
            onPress={onClose}
            style={[styles.closeButton, darkMode && styles.closeButtonDark]}
            activeOpacity={0.7}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X color={darkMode ? '#FFFFFF' : '#6B7280'} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[styles.scrollView, darkMode && styles.scrollViewDark]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Description Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              Set Custom Repetitions
            </Text>
            <Text style={[styles.sectionDescription, darkMode && styles.sectionDescriptionDark]}>
              Adjust the number of repetitions for each dhikr according to your preference or tradition.
            </Text>
          </View>

          {/* Settings Cards */}
          <View style={styles.section}>
            {/* Tahlil Input */}
            <View style={[styles.settingCard, darkMode && styles.settingCardDark]}>
              <View style={styles.settingHeader}>
                <View style={styles.dhikrTitleWrapper}>
                  <Text style={styles.dhikrEmoji}>☝️</Text>
                  <View style={styles.dhikrTextContainer}>
                    <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>
                      Tahlīl
                    </Text>
                    <Text style={[styles.arabicLabel, darkMode && styles.arabicLabelDark]}>
                      لَا إِلٰهَ إِلَّا اللّٰهُ
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.inputContainer, darkMode && styles.inputContainerDark]}>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  value={tempTargets.tahlil.toString()}
                  onChangeText={(text) => handleTargetChange('tahlil', text)}
                  keyboardType="numeric"
                  placeholder="800"
                  placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
                  maxLength={5}
                />
                <View style={styles.inputSuffixContainer}>
                  <Text style={[styles.inputSuffix, darkMode && styles.inputSuffixDark]}>
                    times
                  </Text>
                </View>
              </View>
            </View>

            {/* Ism Allah Input */}
            <View style={[styles.settingCard, darkMode && styles.settingCardDark]}>
              <View style={styles.settingHeader}>
                <View style={styles.dhikrTitleWrapper}>
                  <Text style={styles.dhikrEmoji}>🌙</Text>
                  <View style={styles.dhikrTextContainer}>
                    <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>
                      Ism Allāh
                    </Text>
                    <Text style={[styles.arabicLabel, darkMode && styles.arabicLabelDark]}>
                      اللّٰهُ
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.inputContainer, darkMode && styles.inputContainerDark]}>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  value={tempTargets.ismuLlah.toString()}
                  onChangeText={(text) => handleTargetChange('ismuLlah', text)}
                  keyboardType="numeric"
                  placeholder="400"
                  placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
                  maxLength={5}
                />
                <View style={styles.inputSuffixContainer}>
                  <Text style={[styles.inputSuffix, darkMode && styles.inputSuffixDark]}>
                    times
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.section}>
            <View style={[styles.infoBox, darkMode && styles.infoBoxDark]}>
              <View style={styles.infoIconWrapper}>
                <Info color={darkMode ? '#60A5FA' : '#3B82F6'} size={18} />
              </View>
              <Text style={[styles.infoText, darkMode && styles.infoTextDark]}>
                Default values are 800 (Tahlīl) and 400 (Ism Allāh). You can adjust these based on your tradition.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <TouchableOpacity 
              onPress={handleResetToDefault} 
              style={[styles.defaultButton, darkMode && styles.defaultButtonDark]}
              activeOpacity={0.7}
            >
              <RotateCcw color={darkMode ? '#9CA3AF' : '#6B7280'} size={18} />
              <Text style={[styles.defaultButtonText, darkMode && styles.defaultButtonTextDark]}>
                Reset to Default Values
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, darkMode && styles.saveButtonDark]}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  containerDark: {
    backgroundColor: '#0F1419',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerDark: {
    backgroundColor: '#1A1F26',
    shadowOpacity: 0.3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  closeButtonDark: {
    backgroundColor: '#374151',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollViewDark: {
    backgroundColor: '#0F1419',
  },
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  sectionDescriptionDark: {
    color: '#9CA3AF',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingCardDark: {
    backgroundColor: '#1A1F26',
    shadowOpacity: 0.2,
  },
  settingHeader: {
    marginBottom: 16,
  },
  dhikrTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dhikrEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  dhikrTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  arabicLabel: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  arabicLabelDark: {
    color: '#34D399',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputContainerDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  inputSuffixContainer: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputSuffix: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  inputSuffixDark: {
    color: '#9CA3AF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoBoxDark: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E40AF',
  },
  infoIconWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  infoTextDark: {
    color: '#93C5FD',
  },
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  defaultButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  defaultButtonText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  defaultButtonTextDark: {
    color: '#D1D5DB',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDark: {
    backgroundColor: '#059669',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 40,
  },
});