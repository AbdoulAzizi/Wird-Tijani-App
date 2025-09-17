import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

interface HadraInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function HadraInfoModal({ visible, onClose, darkMode = false }: HadraInfoModalProps) {
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
              <Text style={styles.icon}>🌙</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, darkMode && styles.titleDark]}>
                Guide de la Hadra Joumou'a
              </Text>
              <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
                Séance spirituelle collective hebdomadaire
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={darkMode ? '#FFFFFF' : '#6B7280'} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.scrollView, darkMode && styles.scrollViewDark]} showsVerticalScrollIndicator={false}>
          {/* Timing Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              🕐 Horaire d'exécution
            </Text>
            <View style={[styles.card, darkMode && styles.cardDark]}>
              <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
                Moment obligatoire :
              </Text>
              <View style={styles.timeSlot}>
                <Text style={styles.timeLabel}>🕌 Vendredi :</Text>
                <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                  Entre Asr et le coucher du soleil
                </Text>
              </View>
              <Text style={[styles.note, darkMode && styles.noteDark]}>
                💡 En groupe de préférence, seul si empêchement
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
                  Formation en cercle autour d'une nappe blanche
                </Text>
              </View>
              <View style={styles.preparationItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={[styles.preparationText, darkMode && styles.preparationTextDark]}>
                  Direction collective vers la Qibla
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
                description: 'Formuler l\'intention de réciter le dhikr du vendredi'
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
                description: 'Trois fois (3) - Formule complète d\'absolution'
              },
              {
                step: '5',
                title: 'Ṣalāt al-Fātiḥ',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ...',
                description: 'Trois fois (3) - Prière spéciale sur le Prophète (ﷺ)'
              },
              {
                step: '6',
                title: 'Glorification',
                arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ...',
                description: 'Une fois (1) - Glorification divine'
              },
              {
                step: '7',
                title: 'Tahlīl (Unicité) - Phase intensive',
                arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
                description: '800 à 1000 fois (groupe) / 1200 à 1600 fois (individuel)',
                note: '💫 Récitation rythmée et harmonieuse collective'
              },
              {
                step: '8',
                title: 'Ism Allah',
                arabic: 'اللّٰهُ',
                description: '400 fois - Invocation du Nom Suprême'
              },
              {
                step: '9',
                title: 'Clôture coranique',
                arabic: 'إِنَّ اللّٰهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ...',
                description: 'Une fois (1) - Verset coranique + glorification finale'
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
                {item.note && (
                  <Text style={[styles.stepNote, darkMode && styles.stepNoteDark]}>
                    {item.note}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Collective Practice */}
          <View style={styles.section}>
            <View style={[styles.collectiveCard, darkMode && styles.collectiveCardDark]}>
              <Text style={[styles.collectiveTitle, darkMode && styles.collectiveTitleDark]}>
                👥 Dimension collective
              </Text>
              <Text style={[styles.collectiveText, darkMode && styles.collectiveTextDark]}>
                Le dhikr du vendredi est avant tout une pratique collective qui renforce les liens 
                fraternels et la barakah communautaire. La récitation en groupe avec un rythme 
                harmonieux permet d'atteindre des états spirituels élevés.
              </Text>
            </View>
          </View>

          {/* Note on Numbers */}
          <View style={styles.section}>
            <View style={[styles.noteCard, darkMode && styles.noteCardDark]}>
              <Text style={[styles.noteTitle, darkMode && styles.noteTitleDark]}>
                📌 Note sur les nombres
              </Text>
              <Text style={[styles.noteText, darkMode && styles.noteTextDark]}>
                Les nombres peuvent être adaptés selon les circonstances et le temps disponible. 
                L'essentiel réside dans la qualité spirituelle et la présence du cœur plutôt 
                que dans le comptage strict.
              </Text>
            </View>
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
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
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
  scrollViewDark: {
    backgroundColor: '#111827',
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
    minWidth: 100,
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
  stepNote: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
    marginTop: 4,
  },
  stepNoteDark: {
    color: '#34D399',
  },
  collectiveCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  collectiveCardDark: {
    backgroundColor: '#064E3B',
    borderColor: '#065F46',
  },
  collectiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 12,
  },
  collectiveTitleDark: {
    color: '#34D399',
  },
  collectiveText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  collectiveTextDark: {
    color: '#A7F3D0',
  },
  noteCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteCardDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
  },
  noteTitleDark: {
    color: '#D1D5DB',
  },
  noteText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  noteTextDark: {
    color: '#D1D5DB',
  },
  bottomSpacing: {
    height: 40,
  },
});