import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useApp, SALAWAT_FORMULAS } from '../contexts/AppContext';

interface WirdSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function WirdSettingsModal({ visible, onClose, darkMode }: WirdSettingsModalProps) {
  const { state, dispatch } = useApp();

  const handleFormulaChange = (formula: keyof typeof SALAWAT_FORMULAS) => {
    dispatch({ 
      type: 'UPDATE_WIRD_SETTINGS', 
      settings: { salawatFormula: formula } 
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[
        styles.container,
        darkMode && styles.containerDark
      ]}>
        {/* Header */}
        <View style={[
          styles.header,
          darkMode && styles.headerDark
        ]}>
          <Text style={[
            styles.headerTitle,
            darkMode && styles.headerTitleDark
          ]}>
            Paramètres du Wird
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={darkMode ? '#FFFFFF' : '#6B7280'} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Section Formules de Salawat */}
          <View style={[
            styles.section,
            darkMode && styles.sectionDark
          ]}>
            <Text style={[
              styles.sectionTitle,
              darkMode && styles.sectionTitleDark
            ]}>
              Formule de Salawāt
            </Text>
            <Text style={[
              styles.sectionDescription,
              darkMode && styles.sectionDescriptionDark
            ]}>
              Choisissez la formule de Salawat ala Nabi que vous souhaitez utiliser dans votre Wird quotidien.
            </Text>

            {Object.entries(SALAWAT_FORMULAS).map(([key, formula]) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleFormulaChange(key as keyof typeof SALAWAT_FORMULAS)}
                style={[
                  styles.optionCard,
                  darkMode && styles.optionCardDark,
                  state.wirdSettings.salawatFormula === key && styles.optionCardSelected,
                  state.wirdSettings.salawatFormula === key && darkMode && styles.optionCardSelectedDark
                ]}
              >
                <View style={styles.optionHeader}>
                  <Text style={[
                    styles.optionTitle,
                    darkMode && styles.optionTitleDark,
                    state.wirdSettings.salawatFormula === key && styles.optionTitleSelected
                  ]}>
                    {formula.title}
                  </Text>
                  {state.wirdSettings.salawatFormula === key && (
                    <Check color="#059669" size={20} />
                  )}
                </View>
                
                <Text style={[
                  styles.optionDescription,
                  darkMode && styles.optionDescriptionDark
                ]}>
                  {formula.description}
                </Text>
                
                <View style={styles.arabicContainer}>
                  <Text style={[
                    styles.arabicText,
                    darkMode && styles.arabicTextDark
                  ]}>
                    {formula.arabic}
                  </Text>
                </View>
                
                <Text style={[
                  styles.transliteration,
                  darkMode && styles.transliterationDark
                ]}>
                  {formula.transliteration}
                </Text>
                
                <Text style={[
                  styles.translation,
                  darkMode && styles.translationDark
                ]}>
                  {formula.translation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note importante */}
          <View style={[
            styles.noteContainer,
            darkMode && styles.noteContainerDark
          ]}>
            <Text style={[
              styles.noteTitle,
              darkMode && styles.noteTitleDark
            ]}>
              Note importante
            </Text>
            <Text style={[
              styles.noteText,
              darkMode && styles.noteTextDark
            ]}>
              Changer de formule réinitialisera votre compteur de Salawat actuel. Il est recommandé de rester sur la même formule pendant toute la durée de votre Wird.
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1F2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionDescriptionDark: {
    color: '#D1D5DB',
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  optionCardDark: {
    borderColor: '#374151',
  },
  optionCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  optionCardSelectedDark: {
    borderColor: '#059669',
    backgroundColor: '#064E3B',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionTitleDark: {
    color: '#FFFFFF',
  },
  optionTitleSelected: {
    color: '#059669',
  },
  optionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  optionDescriptionDark: {
    color: '#D1D5DB',
  },
  arabicContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'right',
    lineHeight: 28,
    fontWeight: '500',
  },
  arabicTextDark: {
    color: '#1F2937',
  },
  transliteration: {
    fontSize: 13,
    color: '#059669',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
  },
  transliterationDark: {
    color: '#10B981',
  },
  translation: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  translationDark: {
    color: '#D1D5DB',
  },
  noteContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  noteContainerDark: {
    backgroundColor: '#1F2937',
    borderLeftColor: '#F59E0B',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  noteTitleDark: {
    color: '#FCD34D',
  },
  noteText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  noteTextDark: {
    color: '#FCD34D',
  },
  bottomSpacing: {
    height: 40,
  },
});