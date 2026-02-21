import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';
import DetailShell, { Section, BulletList, InfoChip } from './DetailShell';
import { Master } from '../../data/library/types';

const AMBER = '#D97706';

export default function MasterDetail({ master, visible, onClose }: {
  master: Master | null; visible: boolean; onClose: () => void;
}) {
  if (!master) return null;
  return (
    <DetailShell
      visible={visible} onClose={onClose}
      title={master.name}
      subtitle={master.title}
      gradient={['#78350F', '#B45309', '#D97706']}
    >
      {/* Info chips */}
      <View style={md.infoBox}>
        <InfoChip icon={<Calendar color={AMBER} size={16} strokeWidth={2} />} label="Period" value={master.years} />
        <InfoChip icon={<MapPin color={AMBER} size={16} strokeWidth={2} />} label="Location" value={master.location} />
      </View>

      {/* Biography */}
      <Section label="Biography">
        <Text style={md.body}>{master.fullBiography}</Text>
      </Section>

      {/* Achievements */}
      <Section label="Major Achievements">
        <BulletList items={master.achievements} color={AMBER} />
      </Section>

      {/* Teachings */}
      <Section label="Key Teachings">
        <BulletList items={master.teachings} color="#059669" />
      </Section>

      {/* Legacy */}
      <Section label="Legacy">
        <View style={md.legacyBox}>
          <Text style={md.legacyTxt}>{master.legacy}</Text>
        </View>
      </Section>
    </DetailShell>
  );
}

const md = StyleSheet.create({
  infoBox: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, overflow: 'hidden' },
  body: { fontSize: 14, color: '#374151', lineHeight: 23 },
  legacyBox: { backgroundColor: '#FFFBEB', borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: '#D97706' },
  legacyTxt: { fontSize: 14, color: '#374151', lineHeight: 23, fontStyle: 'italic' },
});