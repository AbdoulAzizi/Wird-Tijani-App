import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Star, Users } from 'lucide-react-native';
import DetailShell, { Section, ArabicBlock, BulletList, InfoChip } from './DetailShell';
import { LibraryItem } from '../../data/library/types';

const RED = '#DC2626';

export default function FormulaDetail({ item, visible, onClose }: {
  item: LibraryItem | null; visible: boolean; onClose: () => void;
}) {
  if (!item) return null;
  return (
    <DetailShell
      visible={visible} onClose={onClose}
      title={item.title}
      subtitle="Sacred Formula · الوِرد"
      gradient={['#7F1D1D', '#B91C1C', '#DC2626']}
    >
      {/* Badge */}
      <View style={[fd.badge, { backgroundColor: item.badgeColor + '18', borderColor: item.badgeColor + '40' }]}>
        <Text style={[fd.badgeTxt, { color: item.badgeColor }]}>{item.badge}</Text>
      </View>

      {/* Description */}
      <Text style={fd.desc}>{item.fullDescription}</Text>

      {/* Arabic text */}
      <Section label="Arabic Text">
        <ArabicBlock text={item.arabicText} />
      </Section>

      {/* Transliteration */}
      <Section label="Transliteration">
        <View style={fd.transBox}>
          <Text style={fd.transTxt}>{item.transliteration}</Text>
        </View>
      </Section>

      {/* Translation */}
      <Section label="Translation">
        <Text style={fd.translatTxt}>{item.translation}</Text>
      </Section>

      {/* Benefits */}
      <Section label="Spiritual Benefits">
        <BulletList items={item.benefits} color={RED} />
      </Section>

      {/* Recitation guidelines */}
      {/* <Section label="Recitation Guidelines">
        <View style={fd.guideBox}>
          <InfoChip icon={<Clock color="#059669" size={16} strokeWidth={2} />} label="Frequency" value={item.recitation.frequency} />
          <InfoChip icon={<Star color="#059669" size={16} strokeWidth={2} />} label="Timing" value={item.recitation.timing} />
          <InfoChip icon={<Users color="#059669" size={16} strokeWidth={2} />} label="Requirements" value={item.recitation.requirements} />
        </View>
      </Section> */}
    </DetailShell>
  );
}

const fd = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  badgeTxt: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  desc: { fontSize: 15, color: '#374151', lineHeight: 24 },
  transBox: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14 },
  transTxt: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 22 },
  translatTxt: { fontSize: 14, color: '#1E293B', lineHeight: 23 },
  guideBox: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, overflow: 'hidden' },
});