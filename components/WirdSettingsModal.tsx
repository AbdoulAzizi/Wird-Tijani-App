import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, AlertTriangle, Info, BookOpen, Sparkles } from 'lucide-react-native';
import { useApp, SALAWAT_FORMULAS } from '../contexts/AppContext';

interface WirdSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function WirdSettingsModal({ visible, onClose, darkMode }: WirdSettingsModalProps) {
  const { state, dispatch } = useApp();
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  const handleFormulaChange = (formula: keyof typeof SALAWAT_FORMULAS) => {
    if (state.wirdSettings.salawatFormula === formula) {
      return; // Already selected
    }

    Alert.alert(
      'Changer de formule ?',
      'Votre compteur actuel de Salawāt sera réinitialisé. Êtes-vous sûr de vouloir continuer ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Changer',
          style: 'destructive',
          onPress: () => {
            dispatch({ 
              type: 'UPDATE_WIRD_SETTINGS', 
              settings: { salawatFormula: formula } 
            });
            Alert.alert(
              'Formule mise à jour',
              'Votre nouvelle formule de Salawāt a été enregistrée.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const toggleExpand = (key: string) => {
    setExpandedFormula(expandedFormula === key ? null : key);
  };

  const getFormulaIcon = (key: string) => {
    const icons: { [key: string]: string } = {
      salatulFatih: '⭐',
      salatulIbrahimiyya: '📿',
      salawatSimple: '🌙',
      salatulKamila: '💎'
    };
    return icons[key] || '✨';
  };

  const getFormulaColor = (key: string) => {
    const colors: { [key: string]: string } = {
      salatulFatih: '#059669',
      salatulIbrahimiyya: '#3B82F6',
      salawatSimple: '#8B5CF6',
      salatulKamila: '#F59E0B'
    };
    return colors[key] || '#6B7280';
  };

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
            <View style={[styles.iconContainer, darkMode && styles.iconContainerDark]}>
              <BookOpen color="#FFFFFF" size={20} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>
                Paramètres du Wird
              </Text>
              <Text style={[styles.headerSubtitle, darkMode && styles.headerSubtitleDark]}>
                Personnaliser votre formule de Salawāt
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={onClose} 
            style={[styles.closeButton, darkMode && styles.closeButtonDark]}
            activeOpacity={0.7}
          >
            <X color={darkMode ? '#D1D5DB' : '#6B7280'} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[styles.content, darkMode && styles.contentDark]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Introduction Card */}
          <View style={[styles.introCard, darkMode && styles.introCardDark]}>
            <View style={styles.introHeader}>
              <Sparkles color="#059669" size={18} />
              <Text style={[styles.introTitle, darkMode && styles.introTitleDark]}>
                Choix de la formule
              </Text>
            </View>
            <Text style={[styles.introText, darkMode && styles.introTextDark]}>
              Le Wird comprend 100 Salawāt sur le Prophète ﷺ. Vous pouvez choisir parmi 
              quatre formules authentiques de la tradition islamique.
            </Text>
          </View>

          {/* Formulas Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Formules disponibles
              </Text>
              <Text style={[styles.formulaCount, darkMode && styles.formulaCountDark]}>
                {Object.keys(SALAWAT_FORMULAS).length} options
              </Text>
            </View>

            {Object.entries(SALAWAT_FORMULAS).map(([key, formula]) => {
              const isSelected = state.wirdSettings.salawatFormula === key;
              const isExpanded = expandedFormula === key;
              const color = getFormulaColor(key);
              const icon = getFormulaIcon(key);

              return (
                <View key={key} style={styles.formulaWrapper}>
                  <TouchableOpacity
                    onPress={() => toggleExpand(key)}
                    style={[
                      styles.optionCard,
                      darkMode && styles.optionCardDark,
                      isSelected && styles.optionCardSelected,
                      isSelected && darkMode && styles.optionCardSelectedDark,
                      isExpanded && styles.optionCardExpanded
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionHeader}>
                      <View style={styles.optionTitleRow}>
                        <Text style={styles.formulaIcon}>{icon}</Text>
                        <View style={styles.optionTitleContainer}>
                          <Text style={[
                            styles.optionTitle,
                            darkMode && styles.optionTitleDark,
                            isSelected && { color }
                          ]}>
                            {formula.title}
                          </Text>
                          {isSelected && (
                            <View style={[styles.selectedBadge, { backgroundColor: color }]}>
                              <Check color="#FFFFFF" size={12} />
                              <Text style={styles.selectedBadgeText}>Actuelle</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <Text style={[
                      styles.optionDescription,
                      darkMode && styles.optionDescriptionDark
                    ]}>
                      {formula.description}
                    </Text>

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <View style={[styles.arabicContainer, darkMode && styles.arabicContainerDark]}>
                          <Text style={[styles.arabicText, darkMode && styles.arabicTextDark]}>
                            {formula.arabic}
                          </Text>
                        </View>
                        
                        <View style={[styles.transliterationBox, darkMode && styles.transliterationBoxDark]}>
                          <Text style={[styles.transliterationLabel, darkMode && styles.transliterationLabelDark]}>
                            Translitération :
                          </Text>
                          <Text style={[styles.transliteration, darkMode && styles.transliterationDark]}>
                            {formula.transliteration}
                          </Text>
                        </View>
                        
                        <View style={[styles.translationBox, darkMode && styles.translationBoxDark]}>
                          <Text style={[styles.translationLabel, darkMode && styles.translationLabelDark]}>
                            Traduction :
                          </Text>
                          <Text style={[styles.translation, darkMode && styles.translationDark]}>
                            {formula.translation}
                          </Text>
                        </View>

                        {!isSelected && (
                          <TouchableOpacity
                            onPress={() => handleFormulaChange(key as keyof typeof SALAWAT_FORMULAS)}
                            style={[styles.selectButton, { backgroundColor: color }]}
                            activeOpacity={0.8}
                          >
                            <Check color="#FFFFFF" size={18} />
                            <Text style={styles.selectButtonText}>Utiliser cette formule</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Important Note */}
          <View style={[styles.warningCard, darkMode && styles.warningCardDark]}>
            <View style={styles.warningHeader}>
              <AlertTriangle color="#F59E0B" size={20} />
              <Text style={[styles.warningTitle, darkMode && styles.warningTitleDark]}>
                Note importante
              </Text>
            </View>
            <Text style={[styles.warningText, darkMode && styles.warningTextDark]}>
              Changer de formule réinitialisera votre compteur de Salawāt actuel. Il est 
              recommandé de rester sur la même formule pendant toute la durée de votre Wird quotidien.
            </Text>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, darkMode && styles.infoCardDark]}>
            <View style={styles.infoHeader}>
              <Info color="#3B82F6" size={20} />
              <Text style={[styles.infoTitle, darkMode && styles.infoTitleDark]}>
                Toutes les formules sont authentiques
              </Text>
            </View>
            <Text style={[styles.infoText, darkMode && styles.infoTextDark]}>
              Chacune de ces formules provient de sources authentiques de la tradition 
              islamique. Le choix dépend de votre préférence personnelle et de votre connexion 
              spirituelle avec chaque formule.
            </Text>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerDark: {
    backgroundColor: '#047857',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  headerSubtitleDark: {
    color: '#D1D5DB',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  closeButtonDark: {
    backgroundColor: '#374151',
  },
  content: {
    flex: 1,
  },
  contentDark: {
    backgroundColor: '#111827',
  },
  scrollContent: {
    padding: 20,
  },
  introCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  introCardDark: {
    backgroundColor: '#064E3B',
    borderColor: '#065F46',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#047857',
  },
  introTitleDark: {
    color: '#6EE7B7',
  },
  introText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
  introTextDark: {
    color: '#A7F3D0',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  formulaCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  formulaCountDark: {
    color: '#D1D5DB',
    backgroundColor: '#374151',
  },
  formulaWrapper: {
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  optionCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  optionCardSelectedDark: {
    backgroundColor: '#064E3B',
    borderColor: '#059669',
  },
  optionCardExpanded: {
    shadowOpacity: 0.1,
    elevation: 4,
  },
  optionHeader: {
    marginBottom: 8,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formulaIcon: {
    fontSize: 24,
  },
  optionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionTitleDark: {
    color: '#FFFFFF',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  optionDescriptionDark: {
    color: '#D1D5DB',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  arabicContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  arabicContainerDark: {
    backgroundColor: '#111827',
  },
  arabicText: {
    fontSize: 17,
    color: '#1F2937',
    textAlign: 'right',
    lineHeight: 32,
    fontWeight: '500',
  },
  arabicTextDark: {
    color: '#E5E7EB',
  },
  transliterationBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  transliterationBoxDark: {
    backgroundColor: '#064E3B',
  },
  transliterationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  transliterationLabelDark: {
    color: '#6EE7B7',
  },
  transliteration: {
    fontSize: 13,
    color: '#047857',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  transliterationDark: {
    color: '#A7F3D0',
  },
  translationBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  translationBoxDark: {
    backgroundColor: '#374151',
  },
  translationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  translationLabelDark: {
    color: '#9CA3AF',
  },
  translation: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  translationDark: {
    color: '#D1D5DB',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  warningCardDark: {
    backgroundColor: '#451A03',
    borderColor: '#92400E',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  warningTitleDark: {
    color: '#FCD34D',
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  warningTextDark: {
    color: '#FDE68A',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoCardDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E40AF',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  infoTitleDark: {
    color: '#93C5FD',
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
  },
  infoTextDark: {
    color: '#DBEAFE',
  },
  bottomSpacing: {
    height: 40,
  },
});