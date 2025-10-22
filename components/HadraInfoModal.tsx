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
      <SafeAreaView style={[styles.container, darkMode && styles.containerDark]} edges={['top']}>
        {/* Header avec dégradé */}
        <View style={[styles.header, darkMode && styles.headerDark]}>
          <View style={styles.headerGradient} />
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🌙</Text>
              <View style={styles.iconGlow} />
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
          <TouchableOpacity 
            onPress={onClose} 
            style={[styles.closeButton, darkMode && styles.closeButtonDark]}
            activeOpacity={0.7}
          >
            <X color={darkMode ? '#FFFFFF' : '#6B7280'} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[styles.scrollView, darkMode && styles.scrollViewDark]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Timing Section avec design amélioré */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrapper}>
                <Text style={styles.sectionIcon}>🕐</Text>
              </View>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Horaire d'exécution
              </Text>
            </View>
            <View style={[styles.card, styles.timingCard, darkMode && styles.cardDark]}>
              <View style={styles.timingHeader}>
                <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
                  Moment obligatoire
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Essentiel</Text>
                </View>
              </View>
              <View style={[styles.timeSlot, darkMode && styles.timeSlotDark]}>
                <View style={styles.timeIconWrapper}>
                  <Text style={styles.timeIcon}>🕌</Text>
                </View>
                <View style={styles.timeContent}>
                  <Text style={[styles.timeDay, darkMode && styles.timeDayDark]}>Vendredi</Text>
                  <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                    Entre Asr et le coucher du soleil
                  </Text>
                </View>
              </View>
              <View style={[styles.noteBox, darkMode && styles.noteBoxDark]}>
                <Text style={styles.noteIcon}>💡</Text>
                <Text style={[styles.note, darkMode && styles.noteDark]}>
                  En groupe de préférence, seul si empêchement
                </Text>
              </View>
            </View>
          </View>

          {/* Preparation Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrapper}>
                <Text style={styles.sectionIcon}>🧘‍♂️</Text>
              </View>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Préparation spirituelle
              </Text>
            </View>
            <View style={[styles.card, darkMode && styles.cardDark]}>
              {[
                { icon: '💧', text: 'État de pureté (wudû) obligatoire' },
                { icon: '🤲', text: 'S\'asseoir comme en prière' },
                { icon: '⭕', text: 'Formation en cercle autour d\'une nappe blanche' },
                { icon: '🧭', text: 'Direction collective vers la Qibla' }
              ].map((item, index) => (
                <View key={index} style={[styles.preparationItem, darkMode && styles.preparationItemDark]}>
                  <View style={styles.preparationIconWrapper}>
                    <Text style={styles.preparationIcon}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.preparationText, darkMode && styles.preparationTextDark]}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Steps Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrapper}>
                <Text style={styles.sectionIcon}>📋</Text>
              </View>
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Étapes à suivre dans l'ordre
              </Text>
            </View>

            {[
              {
                step: '1',
                title: 'Intention (Niyya)',
                icon: '💭',
                description: 'Formuler l\'intention de réciter le dhikr du vendredi'
              },
              {
                step: '2',
                title: 'Protection (Ta\'awwudh)',
                icon: '🛡️',
                arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
                count: '1×',
                description: 'Protection contre Satan'
              },
              {
                step: '3',
                title: 'Al-Fātiḥa',
                icon: '📖',
                count: '1×',
                description: 'Réciter la Fātiḥa'
              },
              {
                step: '4',
                title: 'Istighfār spécial',
                icon: '🤲',
                arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
                count: '3×',
                description: 'Formule complète d\'absolution'
              },
              {
                step: '5',
                title: 'Ṣalāt al-Fātiḥ',
                icon: '🌟',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ...',
                count: '3×',
                description: 'Prière spéciale sur le Prophète ﷺ'
              },
              {
                step: '6',
                title: 'Glorification',
                icon: '✨',
                arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ...',
                count: '1×',
                description: 'Glorification divine'
              },
              {
                step: '7',
                title: 'Tahlīl (Unicité)',
                icon: '☝️',
                arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
                count: '800-1000×',
                description: 'En groupe',
                alternateCount: '1200-1600×',
                alternateDescription: 'Individuel',
                note: 'Récitation rythmée et harmonieuse collective',
                highlight: true
              },
              {
                step: '8',
                title: 'Ism Allah',
                icon: '🌙',
                arabic: 'اللّٰهُ',
                count: '400×',
                description: 'Invocation du Nom Suprême'
              },
              {
                step: '9',
                title: 'Clôture coranique',
                icon: '📿',
                arabic: 'إِنَّ اللّٰهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ...',
                count: '1×',
                description: 'Verset coranique + glorification finale'
              }
            ].map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.stepCard, 
                  darkMode && styles.stepCardDark,
                  item.highlight && styles.stepCardHighlight,
                  item.highlight && darkMode && styles.stepCardHighlightDark
                ]}
              >
                <View style={styles.stepHeader}>
                  <View style={[styles.stepNumber, item.highlight && styles.stepNumberHighlight]}>
                    <Text style={styles.stepNumberText}>{item.step}</Text>
                  </View>
                  <View style={styles.stepTitleWrapper}>
                    <Text style={styles.stepEmoji}>{item.icon}</Text>
                    <Text style={[styles.stepTitle, darkMode && styles.stepTitleDark]}>
                      {item.title}
                    </Text>
                  </View>
                </View>
                
                {item.arabic && (
                  <View style={[styles.arabicContainer, darkMode && styles.arabicContainerDark]}>
                    <Text style={[styles.arabicText, darkMode && styles.arabicTextDark]}>
                      {item.arabic}
                    </Text>
                  </View>
                )}
                
                <View style={styles.stepDetails}>
                  {item.count && (
                    <View style={[styles.countBadge, item.highlight && styles.countBadgeHighlight]}>
                      <Text style={[styles.countText, item.highlight && styles.countTextHighlight]}>
                        {item.count}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.stepDescription, darkMode && styles.stepDescriptionDark]}>
                    {item.description}
                  </Text>
                </View>
                
                {item.alternateCount && (
                  <View style={styles.stepDetails}>
                    <View style={styles.countBadgeSecondary}>
                      <Text style={styles.countTextSecondary}>{item.alternateCount}</Text>
                    </View>
                    <Text style={[styles.stepDescription, darkMode && styles.stepDescriptionDark]}>
                      {item.alternateDescription}
                    </Text>
                  </View>
                )}
                
                {item.note && (
                  <View style={[styles.stepNoteBox, darkMode && styles.stepNoteBoxDark]}>
                    <Text style={styles.stepNoteIcon}>💫</Text>
                    <Text style={[styles.stepNote, darkMode && styles.stepNoteDark]}>
                      {item.note}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Collective Practice */}
          <View style={styles.section}>
            <View style={[styles.collectiveCard, darkMode && styles.collectiveCardDark]}>
              <View style={styles.collectiveHeader}>
                <View style={styles.collectiveIconWrapper}>
                  <Text style={styles.collectiveIcon}>👥</Text>
                </View>
                <Text style={[styles.collectiveTitle, darkMode && styles.collectiveTitleDark]}>
                  Dimension collective
                </Text>
              </View>
              <Text style={[styles.collectiveText, darkMode && styles.collectiveTextDark]}>
                Le dhikr du vendredi est avant tout une pratique collective qui renforce les liens 
                fraternels et la barakah communautaire. La récitation en groupe avec un rythme 
                harmonieux permet d'atteindre des états spirituels élevés.
              </Text>
            </View>
          </View>

          {/* Note on Numbers */}
          <View style={styles.section}>
            <View style={[styles.infoCard, darkMode && styles.infoCardDark]}>
              <View style={styles.infoIconWrapper}>
                <Text style={styles.infoIcon}>📌</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, darkMode && styles.infoTitleDark]}>
                  Note sur les nombres
                </Text>
                <Text style={[styles.infoText, darkMode && styles.infoTextDark]}>
                  Les nombres peuvent être adaptés selon les circonstances et le temps disponible. 
                  L'essentiel réside dans la qualité spirituelle et la présence du cœur plutôt 
                  que dans le comptage strict.
                </Text>
              </View>
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
    backgroundColor: '#FAFAFA',
  },
  containerDark: {
    backgroundColor: '#0F1419',
  },
  header: {
    position: 'relative',
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
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#10B981',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    opacity: 0.2,
  },
  icon: {
    fontSize: 28,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  subtitleDark: {
    color: '#9CA3AF',
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
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1A1F26',
    shadowOpacity: 0.2,
  },
  timingCard: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#10B981',
  },
  cardTitleDark: {
    color: '#34D399',
  },
  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  timeSlotDark: {
    backgroundColor: '#111827',
  },
  timeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timeIcon: {
    fontSize: 20,
  },
  timeContent: {
    flex: 1,
  },
  timeDay: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  timeDayDark: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeTextDark: {
    color: '#9CA3AF',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  noteBoxDark: {
    backgroundColor: '#064E3B',
    borderLeftColor: '#34D399',
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  note: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  noteDark: {
    color: '#6EE7B7',
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
  },
  preparationItemDark: {
    backgroundColor: '#111827',
  },
  preparationIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  preparationIcon: {
    fontSize: 18,
  },
  preparationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
  preparationTextDark: {
    color: '#D1D5DB',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCardDark: {
    backgroundColor: '#1A1F26',
  },
  stepCardHighlight: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  stepCardHighlightDark: {
    backgroundColor: '#1F2937',
    borderLeftColor: '#FBBF24',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberHighlight: {
    backgroundColor: '#F59E0B',
  },
  stepNumberText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  stepTitleDark: {
    color: '#FFFFFF',
  },
  arabicContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  arabicContainerDark: {
    backgroundColor: '#064E3B',
    borderColor: '#065F46',
  },
  arabicText: {
    fontSize: 17,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'right',
    lineHeight: 28,
  },
  arabicTextDark: {
    color: '#6EE7B7',
  },
  stepDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  countBadgeHighlight: {
    backgroundColor: '#FEF3C7',
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  countTextHighlight: {
    color: '#D97706',
  },
  countBadgeSecondary: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  countTextSecondary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  stepDescriptionDark: {
    color: '#9CA3AF',
  },
  stepNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  stepNoteBoxDark: {
    backgroundColor: '#1F2937',
  },
  stepNoteIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  stepNote: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  stepNoteDark: {
    color: '#FCD34D',
  },
  collectiveCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  collectiveCardDark: {
    backgroundColor: '#064E3B',
    borderColor: '#059669',
  },
  collectiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectiveIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  collectiveIcon: {
    fontSize: 20,
  },
  collectiveTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#047857',
  },
  collectiveTitleDark: {
    color: '#6EE7B7',
  },
  collectiveText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 22,
    fontWeight: '500',
  },
  collectiveTextDark: {
    color: '#A7F3D0',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCardDark: {
    backgroundColor: '#1A1F26',
    borderColor: '#374151',
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  infoTitleDark: {
    color: '#D1D5DB',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  infoTextDark: {
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 50,
  },
});