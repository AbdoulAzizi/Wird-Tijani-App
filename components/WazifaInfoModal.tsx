import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, Heart, AlertTriangle, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react-native';

interface WazifaInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function WazifaInfoModal({ visible, onClose, darkMode = false }: WazifaInfoModalProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const steps = [
    {
      step: '1',
      title: 'Intention (Niyya)',
      icon: '🤲',
      description: 'Formuler l\'intention sincère de réciter la Wazīfa pour la satisfaction d\'Allah',
      details: 'L\'intention est le fondement de tout acte d\'adoration. Elle doit être pure et dirigée uniquement vers Allah.',
      color: '#8B5CF6'
    },
    {
      step: '2',
      title: 'Protection (Ta\'awwudh)',
      icon: '🛡️',
      arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'A\'ūdhu bi-Llāhi mina sh-shayṭāni r-rajīm',
      description: 'Une fois (1×) - Chercher refuge auprès d\'Allah contre Satan le maudit',
      details: 'Cette invocation protège le récitant des tentations et distractions durant la récitation.',
      color: '#06B6D4'
    },
    {
      step: '3',
      title: 'Sourate Al-Fātiḥa',
      icon: '📖',
      description: 'Réciter la Fātiḥa une fois (1×)',
      details: 'La Fātiḥa est l\'ouverture du Coran, elle contient l\'essence de toute la révélation divine.',
      color: '#10B981'
    },
    {
      step: '4',
      title: 'Istighfār spécial',
      icon: '🌟',
      arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      transliteration: 'Astaghfiru Llāha l-\'aẓīma lladhī lā ilāha illā huwa l-ḥayyu l-qayyūm',
      description: 'Trente fois (30×) - Demande de pardon avec les Noms Al-Ḥayy et Al-Qayyūm',
      details: 'Cette formule complète purifie le cœur et prépare l\'âme à recevoir les bénédictions divines.',
      color: '#F59E0B'
    },
    {
      step: '5',
      title: 'Ṣalāt al-Fātiḥ',
      icon: '✨',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ...',
      transliteration: 'Allāhumma ṣalli \'alā sayyidinā Muḥammadin l-fātiḥi limā ughliqa...',
      description: 'Cinquante fois (50×) - Prière révélée à Sīdī Ahmad al-Tijānī',
      details: 'Cette prière bénie équivaut à 600,000 prières ordinaires selon la tradition Tijane.',
      color: '#EC4899'
    },
    {
      step: '6',
      title: 'Glorification (Tasbīḥ)',
      icon: '🌙',
      arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ ۝ وَسَلَامٌ عَلَى الْمُرْسَلِينَ ۝ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Subḥāna rabbika rabbi l-\'izzati \'ammā yaṣifūn, wa salāmun \'alā l-mursalīn, wa l-ḥamdu li-Llāhi rabbi l-\'ālamīn',
      description: 'Une fois (1×) - Glorification divine et salutation aux prophètes',
      details: 'Ces versets coraniques sanctifient Allah et envoient la paix sur tous les messagers.',
      color: '#6366F1'
    },
    {
      step: '7',
      title: 'Tahlīl (Unicité)',
      icon: '☝️',
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
      transliteration: 'Lā ilāha illa Llāh',
      description: 'Cent fois (100×) - Attestation de l\'Unicité divine absolue',
      details: 'Le Tahlīl est la clé du Paradis et l\'affirmation la plus puissante de la foi islamique.',
      color: '#14B8A6'
    },
    {
      step: '8',
      title: 'Jawharat al-Kamāl',
      icon: '💎',
      arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ...',
      transliteration: 'Allāhumma ṣalli wa sallim \'alā \'ayni r-raḥmati r-rabbāniyya...',
      description: 'Douze fois (12×) - "La Perle de la Perfection"',
      details: 'Strictement réservée aux initiés. Cette prière sublime contient des secrets spirituels profonds.',
      warning: true,
      color: '#F59E0B'
    }
  ];

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
              <BookOpen color="#FFFFFF" size={24} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, darkMode && styles.titleDark]}>
                Guide de la Wazīfa
              </Text>
              <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
                La récitation quotidienne essentielle
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
          style={[styles.scrollView, darkMode && styles.scrollViewDark]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Introduction */}
          <View style={styles.section}>
            <View style={[styles.introCard, darkMode && styles.introCardDark]}>
              <View style={styles.introHeader}>
                <Sparkles color="#10B981" size={20} />
                <Text style={[styles.introTitle, darkMode && styles.introTitleDark]}>
                  Essence spirituelle
                </Text>
              </View>
              <Text style={[styles.introText, darkMode && styles.introTextDark]}>
                La Wazīfa constitue le cœur battant de la Tarīqa Tijāniyya. C'est la connexion 
                quotidienne avec la barakah de notre maître Sīdī Ahmad al-Tijānī, qui ouvre les 
                portes de la réalisation spirituelle et rapproche le serviteur d'Allah.
              </Text>
            </View>
          </View>

          {/* Timing Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock color={darkMode ? '#10B981' : '#059669'} size={20} />
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Horaires de récitation
              </Text>
            </View>
            <View style={[styles.card, darkMode && styles.cardDark]}>
              <View style={styles.timingOption}>
                <View style={[styles.timingBadge, styles.timingBadgeMorning]}>
                  <Text style={styles.timingBadgeText}>Matin</Text>
                </View>
                <View style={styles.timingContent}>
                  <Text style={[styles.timingTitle, darkMode && styles.timingTitleDark]}>
                    Après Fajr
                  </Text>
                  <Text style={[styles.timingDetail, darkMode && styles.timingDetailDark]}>
                    Jusqu'à 3 heures après le lever du soleil
                  </Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.timingOption}>
                <View style={[styles.timingBadge, styles.timingBadgeEvening]}>
                  <Text style={styles.timingBadgeText}>Soir</Text>
                </View>
                <View style={styles.timingContent}>
                  <Text style={[styles.timingTitle, darkMode && styles.timingTitleDark]}>
                    Après Asr
                  </Text>
                  <Text style={[styles.timingDetail, darkMode && styles.timingDetailDark]}>
                    Jusqu'à 4 heures après le coucher du soleil
                  </Text>
                </View>
              </View>

              <View style={[styles.noteBox, darkMode && styles.noteBoxDark]}>
                <Heart color="#10B981" size={16} />
                <Text style={[styles.noteText, darkMode && styles.noteTextDark]}>
                  Peut être récitée matin ET soir pour multiplier les bénédictions
                </Text>
              </View>
            </View>
          </View>

          {/* Preparation Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle2 color={darkMode ? '#10B981' : '#059669'} size={20} />
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Préparation spirituelle
              </Text>
            </View>
            <View style={[styles.card, darkMode && styles.cardDark]}>
              {[
                { icon: '💧', title: 'Pureté rituelle', desc: 'État de wudū (ablutions) obligatoire' },
                { icon: '🧘', title: 'Posture', desc: 'S\'asseoir comme en prière, avec recueillement' },
                { icon: '🕋', title: 'Direction', desc: 'Se tourner vers la Qibla' },
                { icon: '❤️', title: 'Présence du cœur', desc: 'Maintenir la concentration et l\'humilité' }
              ].map((item, index) => (
                <View key={index} style={styles.preparationItem}>
                  <Text style={styles.preparationIcon}>{item.icon}</Text>
                  <View style={styles.preparationContent}>
                    <Text style={[styles.preparationTitle, darkMode && styles.preparationTitleDark]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.preparationDesc, darkMode && styles.preparationDescDark]}>
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Steps Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen color={darkMode ? '#10B981' : '#059669'} size={20} />
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Étapes dans l'ordre strict
              </Text>
            </View>

            {steps.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.stepCard,
                  darkMode && styles.stepCardDark,
                  item.warning && styles.warningStepCard,
                  item.warning && darkMode && styles.warningStepCardDark,
                  expandedSection === index && styles.stepCardExpanded
                ]}
                onPress={() => toggleSection(index)}
                activeOpacity={0.7}
              >
                <View style={styles.stepHeader}>
                  <View style={[styles.stepNumberContainer, { backgroundColor: item.color }]}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                  </View>
                  <View style={styles.stepTitleContainer}>
                    <View style={styles.stepTitleRow}>
                      <Text style={styles.stepIcon}>{item.icon}</Text>
                      <Text style={[styles.stepTitle, darkMode && styles.stepTitleDark]}>
                        {item.title}
                      </Text>
                    </View>
                    <Text style={[styles.stepDescription, darkMode && styles.stepDescriptionDark]}>
                      {item.description}
                    </Text>
                  </View>
                </View>

                {expandedSection === index && (
                  <View style={styles.stepDetails}>
                    {item.arabic && (
                      <View style={[styles.arabicContainer, darkMode && styles.arabicContainerDark]}>
                        <Text style={[styles.arabicText, darkMode && styles.arabicTextDark]}>
                          {item.arabic}
                        </Text>
                        {item.transliteration && (
                          <Text style={[styles.transliterationText, darkMode && styles.transliterationTextDark]}>
                            {item.transliteration}
                          </Text>
                        )}
                      </View>
                    )}
                    <Text style={[styles.detailsText, darkMode && styles.detailsTextDark]}>
                      {item.details}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Important Notes */}
          <View style={styles.section}>
            <View style={[styles.alertCard, styles.warningCard, darkMode && styles.warningCardDark]}>
              <View style={styles.alertHeader}>
                <AlertTriangle color="#F59E0B" size={20} />
                <Text style={[styles.alertTitle, styles.warningTitle]}>
                  Avertissement crucial
                </Text>
              </View>
              <Text style={[styles.alertText, styles.warningText]}>
                <Text style={styles.boldText}>Jawharat al-Kamāl</Text> est strictement réservée 
                aux initiés de la Tarīqa Tijāniyya. Elle ne doit jamais être récitée sans 
                initiation formelle auprès d'un maître autorisé (muqaddam).
              </Text>
            </View>

            <View style={[styles.alertCard, styles.successCard, darkMode && styles.successCardDark]}>
              <View style={styles.alertHeader}>
                <Sparkles color="#10B981" size={20} />
                <Text style={[styles.alertTitle, styles.successTitle]}>
                  Bénéfices spirituels
                </Text>
              </View>
              <Text style={[styles.alertText, styles.successText]}>
                • Purification du cœur et élévation spirituelle{'\n'}
                • Protection divine contre les épreuves{'\n'}
                • Satisfaction d'Allah et proximité avec le Prophète ﷺ{'\n'}
                • Barakah perpétuelle dans la vie et l'au-delà
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
    backgroundColor: '#1F2937',
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
  iconContainerDark: {
    backgroundColor: '#059669',
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
  closeButtonDark: {
    backgroundColor: '#374151',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollViewDark: {
    backgroundColor: '#111827',
  },
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  introCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 12,
    gap: 8,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  introTitleDark: {
    color: '#34D399',
  },
  introText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 22,
  },
  introTextDark: {
    color: '#A7F3D0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  timingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timingBadgeMorning: {
    backgroundColor: '#DBEAFE',
  },
  timingBadgeEvening: {
    backgroundColor: '#FEF3C7',
  },
  timingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  timingContent: {
    flex: 1,
  },
  timingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timingTitleDark: {
    color: '#FFFFFF',
  },
  timingDetail: {
    fontSize: 13,
    color: '#6B7280',
  },
  timingDetailDark: {
    color: '#D1D5DB',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  noteBoxDark: {
    backgroundColor: '#064E3B',
  },
  noteText: {
    fontSize: 13,
    color: '#059669',
    flex: 1,
    fontStyle: 'italic',
  },
  noteTextDark: {
    color: '#6EE7B7',
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  preparationIcon: {
    fontSize: 24,
  },
  preparationContent: {
    flex: 1,
  },
  preparationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  preparationTitleDark: {
    color: '#FFFFFF',
  },
  preparationDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  preparationDescDark: {
    color: '#D1D5DB',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepCardDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  stepCardExpanded: {
    borderColor: '#10B981',
  },
  warningStepCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FED7AA',
  },
  warningStepCardDark: {
    backgroundColor: '#451A03',
    borderColor: '#92400E',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepIcon: {
    fontSize: 18,
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
  stepDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  stepDescriptionDark: {
    color: '#D1D5DB',
  },
  stepDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  arabicContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  arabicContainerDark: {
    backgroundColor: '#111827',
  },
  arabicText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 8,
  },
  arabicTextDark: {
    color: '#34D399',
  },
  transliterationText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'right',
    lineHeight: 20,
  },
  transliterationTextDark: {
    color: '#9CA3AF',
  },
  detailsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  detailsTextDark: {
    color: '#D1D5DB',
  },
  alertCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  alertText: {
    fontSize: 14,
    lineHeight: 22,
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  warningCardDark: {
    backgroundColor: '#451A03',
    borderColor: '#92400E',
  },
  warningTitle: {
    color: '#EA580C',
  },
  warningText: {
    color: '#92400E',
  },
  successCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successCardDark: {
    backgroundColor: '#064E3B',
    borderColor: '#065F46',
  },
  successTitle: {
    color: '#059669',
  },
  successText: {
    color: '#047857',
  },
  boldText: {
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});