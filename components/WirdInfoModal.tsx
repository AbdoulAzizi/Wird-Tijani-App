import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, Heart, AlertCircle, BookOpen, Sparkles, CheckCircle2, Star } from 'lucide-react-native';

interface WirdInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function WirdInfoModal({ visible, onClose, darkMode = false }: WirdInfoModalProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const steps = [
    {
      step: '1',
      title: 'Intention (Niyya)',
      icon: '🤲',
      description: 'Formuler l\'intention sincère de réciter le Wird pour Allah',
      details: 'L\'intention pure est la fondation. Concentrez votre cœur sur la recherche de la satisfaction divine et la proximité avec Allah.',
      color: '#8B5CF6'
    },
    {
      step: '2',
      title: 'Protection (Ta\'awwudh)',
      icon: '🛡️',
      arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'A\'ūdhu bi-Llāhi mina sh-shayṭāni r-rajīm',
      translation: 'Je cherche refuge auprès d\'Allah contre Satan le maudit',
      description: 'Une fois (1×) - Chercher protection divine',
      details: 'Cette invocation protège le cœur des distractions et des tentations pendant la récitation spirituelle.',
      color: '#06B6D4'
    },
    {
      step: '3',
      title: 'Sourate Al-Fātiḥa',
      icon: '📖',
      description: 'Réciter la Fātiḥa une fois (1×)',
      details: 'La Fātiḥa est "la mère du Coran". Elle ouvre la porte de la communication avec Allah et contient l\'essence de tout le message coranique.',
      color: '#10B981'
    },
    {
      step: '4',
      title: 'Istighfār (Demande de pardon)',
      icon: '💧',
      arabic: 'أَسْتَغْفِرُ اللّٰهَ',
      transliteration: 'Astaghfiru Llāh',
      translation: 'Je demande pardon à Allah',
      description: 'Cent fois (100×) - Purification du cœur',
      details: 'Cette formule simple mais puissante purifie l\'âme des péchés mineurs et prépare le cœur à recevoir les lumières divines.',
      color: '#F59E0B'
    },
    {
      step: '5',
      title: 'Ṣalawāt (Prière sur le Prophète)',
      icon: '✨',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَسَلِّمْ',
      transliteration: 'Allāhumma ṣalli \'alā sayyidinā Muḥammadin wa sallim',
      translation: 'Ô Allah, prie sur notre maître Muhammad et salue-le',
      description: 'Cent fois (100×) - Bénédictions prophétiques',
      details: 'Chaque prière sur le Prophète ﷺ attire dix bénédictions d\'Allah. C\'est un moyen d\'obtenir l\'intercession prophétique.',
      color: '#EC4899'
    },
    {
      step: '6',
      title: 'Glorification (Tasbīḥ)',
      icon: '🌙',
      arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ ۝ وَسَلَامٌ عَلَى الْمُرْسَلِينَ ۝ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Subḥāna rabbika rabbi l-\'izzati \'ammā yaṣifūn, wa salāmun \'alā l-mursalīn, wa l-ḥamdu li-Llāhi rabbi l-\'ālamīn',
      translation: 'Gloire à ton Seigneur, le Seigneur de la puissance, au-dessus de ce qu\'ils décrivent. Paix sur les messagers. Louange à Allah, Seigneur des mondes',
      description: 'Une fois (1×) - Versets coraniques de glorification',
      details: 'Ces versets sacrés (Coran 37:180-182) purifient la langue et le cœur, et envoient la paix sur tous les prophètes.',
      color: '#6366F1'
    },
    {
      step: '7',
      title: 'Tahlīl (Attestation d\'Unicité)',
      icon: '☝️',
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
      transliteration: 'Lā ilāha illa Llāh',
      translation: 'Il n\'y a de divinité qu\'Allah',
      description: 'Cent fois (100×) - Affirmation de l\'Unicité divine',
      details: 'Le Tahlīl est la plus grande parole. C\'est la clé du Paradis et l\'essence même du message de tous les prophètes.',
      color: '#14B8A6'
    }
  ];

  const virtues = [
    { icon: '🌟', title: 'Protection quotidienne', desc: 'Garde spirituelle contre les épreuves' },
    { icon: '💎', title: 'Élévation des rangs', desc: 'Ascension spirituelle auprès d\'Allah' },
    { icon: '🌙', title: 'Purification du cœur', desc: 'Nettoyage des maladies spirituelles' },
    { icon: '✨', title: 'Barakah perpétuelle', desc: 'Bénédictions dans tous les aspects de la vie' }
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
                Guide du Wird Tijānī
              </Text>
              <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
                Pratique spirituelle quotidienne obligatoire
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
                <Sparkles color="#3B82F6" size={20} />
                <Text style={[styles.introTitle, darkMode && styles.introTitleDark]}>
                  L'essence du Wird
                </Text>
              </View>
              <Text style={[styles.introText, darkMode && styles.introTextDark]}>
                Le Wird (littéralement "ce qui est régulier") est la pratique spirituelle fondamentale 
                de la Tarīqa Tijāniyya. Récité deux fois par jour, il constitue le lien quotidien 
                indispensable avec Allah et la voie vers la purification de l'âme.
              </Text>
            </View>
          </View>

          {/* Timing Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock color={darkMode ? '#3B82F6' : '#2563EB'} size={20} />
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Horaires obligatoires
              </Text>
            </View>
            <View style={[styles.card, darkMode && styles.cardDark]}>
              <View style={[styles.frequencyBadge, darkMode && styles.frequencyBadgeDark]}>
                <Star color="#F59E0B" size={16} />
                <Text style={[styles.frequencyText, darkMode && styles.frequencyTextDark]}>
                  Deux fois par jour obligatoire
                </Text>
              </View>

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
                  <Text style={styles.timingBadgeText}>Après-midi</Text>
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
                <AlertCircle color="#EF4444" size={16} />
                <Text style={[styles.noteText, darkMode && styles.noteTextDark]}>
                  Le rattrapage immédiat est obligatoire en cas d'oubli ou de retard
                </Text>
              </View>
            </View>
          </View>

          {/* Preparation Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle2 color={darkMode ? '#3B82F6' : '#2563EB'} size={20} />
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Conditions de validité
              </Text>
            </View>
            <View style={[styles.card, darkMode && styles.cardDark]}>
              {[
                { icon: '💧', title: 'Pureté rituelle obligatoire', desc: 'Wudū (ablutions) valide requis', required: true },
                { icon: '🧘', title: 'Posture correcte', desc: 'S\'asseoir comme en prière avec dignité', required: true },
                { icon: '🕋', title: 'Direction de la Qibla', desc: 'Se tourner vers la Mecque', required: true },
                { icon: '❤️', title: 'Présence du cœur', desc: 'Concentration et humilité totales', required: true }
              ].map((item, index) => (
                <View key={index} style={styles.preparationItem}>
                  <Text style={styles.preparationIcon}>{item.icon}</Text>
                  <View style={styles.preparationContent}>
                    <View style={styles.preparationTitleRow}>
                      <Text style={[styles.preparationTitle, darkMode && styles.preparationTitleDark]}>
                        {item.title}
                      </Text>
                      {item.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredText}>Obligatoire</Text>
                        </View>
                      )}
                    </View>
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
              <BookOpen color={darkMode ? '#3B82F6' : '#2563EB'} size={20} />
              <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                Les sept étapes du Wird
              </Text>
            </View>

            {steps.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.stepCard,
                  darkMode && styles.stepCardDark,
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
                        {item.translation && (
                          <Text style={[styles.translationText, darkMode && styles.translationTextDark]}>
                            {item.translation}
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

          {/* Important Rules */}
          <View style={styles.section}>
            <View style={[styles.alertCard, styles.warningCard, darkMode && styles.warningCardDark]}>
              <View style={styles.alertHeader}>
                <AlertCircle color="#EF4444" size={20} />
                <Text style={[styles.alertTitle, styles.warningTitle]}>
                  Règles strictes à respecter
                </Text>
              </View>
              <View style={styles.rulesList}>
                {[
                  'Respecter l\'ordre exact des sept étapes',
                  'Ne jamais interrompre la récitation une fois commencée',
                  'Rattrapage immédiat obligatoire en cas d\'oubli',
                  'Maintenir la régularité quotidienne (2 fois/jour)',
                  'Conserver l\'état de pureté rituelle durant toute la récitation'
                ].map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <View style={styles.ruleBullet} />
                    <Text style={[styles.ruleText, darkMode && styles.ruleTextDark]}>
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Virtues Section */}
          <View style={styles.section}>
            <View style={[styles.alertCard, styles.successCard, darkMode && styles.successCardDark]}>
              <View style={styles.alertHeader}>
                <Heart color="#3B82F6" size={20} />
                <Text style={[styles.alertTitle, styles.successTitle]}>
                  Vertus spirituelles du Wird
                </Text>
              </View>
              <View style={styles.virtuesGrid}>
                {virtues.map((virtue, index) => (
                  <View key={index} style={[styles.virtueItem, darkMode && styles.virtueItemDark]}>
                    <Text style={styles.virtueIcon}>{virtue.icon}</Text>
                    <Text style={[styles.virtueTitle, darkMode && styles.virtueTitleDark]}>
                      {virtue.title}
                    </Text>
                    <Text style={[styles.virtueDesc, darkMode && styles.virtueDescDark]}>
                      {virtue.desc}
                    </Text>
                  </View>
                ))}
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
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerDark: {
    backgroundColor: '#2563EB',
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
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  introCardDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E40AF',
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
    color: '#2563EB',
  },
  introTitleDark: {
    color: '#93C5FD',
  },
  introText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 22,
  },
  introTextDark: {
    color: '#DBEAFE',
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
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  frequencyBadgeDark: {
    backgroundColor: '#78350F',
  },
  frequencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  frequencyTextDark: {
    color: '#FCD34D',
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
    backgroundColor: '#FED7AA',
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
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  noteBoxDark: {
    backgroundColor: '#7F1D1D',
  },
  noteText: {
    fontSize: 13,
    color: '#991B1B',
    flex: 1,
    fontWeight: '500',
  },
  noteTextDark: {
    color: '#FCA5A5',
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
  preparationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  preparationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  preparationTitleDark: {
    color: '#FFFFFF',
  },
  requiredBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E40AF',
    textTransform: 'uppercase',
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
    borderColor: '#3B82F6',
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
    color: '#3B82F6',
    fontWeight: '500',
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 8,
  },
  arabicTextDark: {
    color: '#60A5FA',
  },
  transliterationText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 6,
  },
  transliterationTextDark: {
    color: '#9CA3AF',
  },
  translationText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  translationTextDark: {
    color: '#D1D5DB',
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
  warningCard: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  warningCardDark: {
    backgroundColor: '#7F1D1D',
    borderColor: '#991B1B',
  },
  warningTitle: {
    color: '#DC2626',
  },
  rulesList: {
    gap: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginTop: 7,
  },
  ruleText: {
    fontSize: 14,
    color: '#991B1B',
    flex: 1,
    lineHeight: 20,
  },
  ruleTextDark: {
    color: '#FCA5A5',
  },
  successCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  successCardDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E40AF',
  },
  successTitle: {
    color: '#2563EB',
  },
  virtuesGrid: {
    gap: 12,
  },
  virtueItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  virtueItemDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  virtueIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  virtueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  virtueTitleDark: {
    color: '#FFFFFF',
  },
  virtueDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  virtueDescDark: {
    color: '#D1D5DB',
  },
  bottomSpacing: {
    height: 40,
  },
});