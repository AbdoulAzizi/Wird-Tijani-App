import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

interface WazifaInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function WazifaInfoModal({ visible, onClose, darkMode = false }: WazifaInfoModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
        <View style={[styles.modalContent, darkMode && styles.modalContentDark]}>
          {/* Header */}
          <View style={[styles.header, darkMode && styles.headerDark]}>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>⭐</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, darkMode && styles.titleDark]}>
                  Guide de la Wazīfa Tijāniyya
                </Text>
                <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
                  La récitation quotidienne principale
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={darkMode ? '#FFFFFF' : '#6B7280'} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Timing Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                🕐 Horaires d'exécution
              </Text>
              <View style={[styles.card, darkMode && styles.cardDark]}>
                <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
                  Une fois par jour minimum :
                </Text>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>🌅 Matin :</Text>
                  <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                    Après Fajr jusqu'à 3h après le lever du soleil
                  </Text>
                </View>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>🌇 Soir :</Text>
                  <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                    Après Asr jusqu'à 4h après le coucher du soleil
                  </Text>
                </View>
                <Text style={[styles.note, darkMode && styles.noteDark]}>
                  💡 Peut être récitée matin ET soir pour plus de bénéfices
                </Text>
              </View>
            </View>

            {/* Preparation Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                🧘‍♂️ Préparation spirituelle
              </Text>
              <View style={[styles.card, darkMode && styles.cardDark]}>
                <View style={styles.preparationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.preparationText, darkMode && styles.preparationTextDark]}>
                    État de pureté (wudû) obligatoire
                  </Text>
                </View>
                <View style={styles.preparationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.preparationText, darkMode && styles.preparationTextDark]}>
                    S'asseoir comme en prière
                  </Text>
                </View>
                <View style={styles.preparationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.preparationText, darkMode && styles.preparationTextDark]}>
                    Se diriger vers la Qibla
                  </Text>
                </View>
                <View style={styles.preparationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.preparationText, darkMode && styles.preparationTextDark]}>
                    Maintenir la concentration du cœur
                  </Text>
                </View>
              </View>
            </View>

            {/* Steps Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                📋 Étapes à suivre dans l'ordre strict
              </Text>

              {[
                {
                  step: '1',
                  title: 'Intention (Niyya)',
                  description: 'Formuler l\'intention de réciter la Wazīfa pour sublimer Allah'
                },
                {
                  step: '2',
                  title: 'Protection (Ta\'awwudh)',
                  arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
                  description: 'Une fois (1) - Protection contre Satan'
                },
                {
                  step: '3',
                  title: 'Al-Fātiḥa',
                  description: 'Réciter la Fātiḥa une fois (1)'
                },
                {
                  step: '4',
                  title: 'Istighfār spécial',
                  arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
                  description: 'Trente fois (30) - Formule complète avec Al-Hayy et Al-Qayyūm'
                },
                {
                  step: '5',
                  title: 'Ṣalāt al-Fātiḥ',
                  arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ...',
                  description: 'Cinquante fois (50) - Prière spéciale révélée à Sīdī Ahmad al-Tijānī'
                },
                {
                  step: '6',
                  title: 'Glorification',
                  arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ...',
                  description: 'Une fois (1) - Glorification divine'
                },
                {
                  step: '7',
                  title: 'Tahlīl (Unicité)',
                  arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
                  description: 'Cent fois (100) - Attestation d\'unicité divine'
                },
                {
                  step: '8',
                  title: 'Jawharat al-Kamāl',
                  arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ...',
                  description: 'Douze fois (12) - "La Perle de la Perfection" (initiés uniquement)',
                  warning: true
                }
              ].map((item, index) => (
                <View key={index} style={[
                  styles.stepCard, 
                  darkMode && styles.stepCardDark,
                  item.warning && styles.warningStepCard,
                  item.warning && darkMode && styles.warningStepCardDark
                ]}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepNumber, item.warning && styles.warningStepNumber]}>
                      <Text style={styles.stepNumberText}>{item.step}</Text>
                    </View>
                    <Text style={[styles.stepTitle, darkMode && styles.stepTitleDark]}>
                      {item.title}
                    </Text>
                  </View>
                  {item.arabic && (
                    <Text style={styles.arabicText}>
                      {item.arabic}
                    </Text>
                  )}
                  <Text style={[
                    styles.stepDescription, 
                    darkMode && styles.stepDescriptionDark,
                    item.warning && styles.warningStepDescription,
                    item.warning && darkMode && styles.warningStepDescriptionDark
                  ]}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>

            {/* Warning Section */}
            <View style={styles.section}>
              <View style={[styles.warningCard, darkMode && styles.warningCardDark]}>
                <Text style={[styles.warningTitle, darkMode && styles.warningTitleDark]}>
                  ⚠️ Avertissement Crucial
                </Text>
                <Text style={[styles.warningText, darkMode && styles.warningTextDark]}>
                  Jawharat al-Kamāl est strictement réservée aux initiés de la Tarīqa Tijāniyya. 
                  Elle ne doit jamais être récitée sans initiation formelle.
                </Text>
              </View>
            </View>

            {/* Importance Section */}
            <View style={styles.section}>
              <View style={[styles.importanceCard, darkMode && styles.importanceCardDark]}>
                <Text style={[styles.importanceTitle, darkMode && styles.importanceTitleDark]}>
                  💎 Importance spirituelle
                </Text>
                <Text style={[styles.importanceText, darkMode && styles.importanceTextDark]}>
                  La Wazīfa constitue le cœur de la pratique tijane. Elle assure la connexion 
                  quotidienne avec la barakah de Sīdī Ahmad al-Tijānī et ouvre les portes de 
                  la réalisation spirituelle.
                </Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContentDark: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerDark: {
    backgroundColor: '#111827',
    borderBottomColor: '#374151',
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
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  subtitleDark: {
    color: '#D1D5DB',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
  },
  cardTitleDark: {
    color: '#34D399',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    minWidth: 80,
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  timeTextDark: {
    color: '#D1D5DB',
  },
  note: {
    fontSize: 13,
    color: '#059669',
    fontStyle: 'italic',
    marginTop: 8,
  },
  noteDark: {
    color: '#34D399',
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 8,
    marginTop: 2,
  },
  preparationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  preparationTextDark: {
    color: '#D1D5DB',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCardDark: {
    backgroundColor: '#1F2937',
  },
  warningStepCard: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  warningStepCardDark: {
    backgroundColor: '#451A03',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  warningStepNumber: {
    backgroundColor: '#F59E0B',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  stepTitleDark: {
    color: '#FFFFFF',
  },
  arabicText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 24,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  stepDescriptionDark: {
    color: '#D1D5DB',
  },
  warningStepDescription: {
    color: '#92400E',
  },
  warningStepDescriptionDark: {
    color: '#FED7AA',
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  warningCardDark: {
    backgroundColor: '#451A03',
    borderColor: '#92400E',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EA580C',
    marginBottom: 12,
  },
  warningTitleDark: {
    color: '#FB923C',
  },
  warningText: {
    fontSize: 14,
    color: '#9A3412',
    lineHeight: 20,
  },
  warningTextDark: {
    color: '#FED7AA',
  },
  importanceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  importanceCardDark: {
    backgroundColor: '#064E3B',
    borderColor: '#065F46',
  },
  importanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 12,
  },
  importanceTitleDark: {
    color: '#34D399',
  },
  importanceText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  importanceTextDark: {
    color: '#A7F3D0',
  },
  bottomSpacing: {
    height: 40,
  },
});