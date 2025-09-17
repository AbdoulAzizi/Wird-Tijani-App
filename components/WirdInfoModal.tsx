import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

interface WirdInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function WirdInfoModal({ visible, onClose, darkMode = false }: WirdInfoModalProps) {
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
                <Text style={styles.icon}>📿</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, darkMode && styles.titleDark]}>
                  Guide du Wird Tijāni
                </Text>
                <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
                  Pratique spirituelle quotidienne
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
                  Deux fois par jour obligatoire :
                </Text>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>🌅 Matin :</Text>
                  <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                    Après Fajr jusqu'à 3h après le lever du soleil
                  </Text>
                </View>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>🌇 Après-midi :</Text>
                  <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                    Après Asr jusqu'à 4h après le coucher du soleil
                  </Text>
                </View>
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
                    Maintenir la concentration
                  </Text>
                </View>
              </View>
            </View>

            {/* Steps Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                📋 Étapes à suivre dans l'ordre
              </Text>

              {[
                {
                  step: '1',
                  title: 'Intention (Niyya)',
                  description: 'Formuler l\'intention de réciter le Wird pour sublimer Allah'
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
                  arabic: 'أَسْتَغْفِرُ اللّٰهَ',
                  description: 'Cent fois (100) - Formule d\'absolution'
                },
                {
                  step: '5',
                  title: 'Prière sur le Prophète (ﷺ)',
                  arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَسَلِّمْ',
                  description: 'Cent fois (100) - Bénédictions sur le Prophète'
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
                  description: 'Cent fois (100) - Attestation d\'unicité'
                }
              ].map((item, index) => (
                <View key={index} style={[styles.stepCard, darkMode && styles.stepCardDark]}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
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
                  <Text style={[styles.stepDescription, darkMode && styles.stepDescriptionDark]}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>

            {/* Important Rules */}
            <View style={styles.section}>
              <View style={[styles.importantCard, darkMode && styles.importantCardDark]}>
                <Text style={[styles.importantTitle, darkMode && styles.importantTitleDark]}>
                  ⚠️ Règles importantes
                </Text>
                <View style={styles.ruleItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.ruleText, darkMode && styles.ruleTextDark]}>
                    Respecter l'ordre des étapes
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.ruleText, darkMode && styles.ruleTextDark]}>
                    Ne jamais interrompre une fois commencé
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.ruleText, darkMode && styles.ruleTextDark]}>
                    Rattrapage immédiat en cas d'oubli
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.ruleText, darkMode && styles.ruleTextDark]}>
                    Régularité quotidienne nécessaire
                  </Text>
                </View>
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
  importantCard: {
    backgroundColor: '#FEF7F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  importantCardDark: {
    backgroundColor: '#451A03',
    borderColor: '#92400E',
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EA580C',
    marginBottom: 12,
  },
  importantTitleDark: {
    color: '#FB923C',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    color: '#9A3412',
    flex: 1,
    lineHeight: 20,
  },
  ruleTextDark: {
    color: '#FED7AA',
  },
  bottomSpacing: {
    height: 40,
  },
});