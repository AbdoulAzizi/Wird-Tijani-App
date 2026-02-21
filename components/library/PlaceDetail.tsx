import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import DetailShell, { Section, ArabicBlock, BulletList, InfoChip } from './DetailShell';
import { HolyPlace } from '../../data/library/types';

const GREEN = '#065F46';

export default function PlaceDetail({ place, visible, onClose }: {
  place: HolyPlace | null; visible: boolean; onClose: () => void;
}) {
  if (!place) return null;
  return (
    <DetailShell
      visible={visible} onClose={onClose}
      title={place.name}
      subtitle={place.location}
      gradient={['#064E3B', '#065F46', '#047857']}
    >
      {place.arabicName && (
        <Section label="Arabic Name">
          <ArabicBlock text={place.arabicName} />
        </Section>
      )}

      <View style={pd.locBox}>
        <InfoChip icon={<MapPin color={GREEN} size={16} strokeWidth={2} />} label="Location" value={place.location} />
      </View>

      <Section label="About This Place">
        <Text style={pd.body}>{place.fullDescription}</Text>
      </Section>

      <Section label="Significance">
        <View style={pd.sigBox}>
          <Text style={pd.sigTxt}>{place.significance}</Text>
        </View>
      </Section>

      <Section label="History">
        <Text style={pd.body}>{place.history}</Text>
      </Section>

      <Section label="Spiritual Practices">
        <BulletList items={place.practices} color={GREEN} />
      </Section>
    </DetailShell>
  );
}

const pd = StyleSheet.create({
  locBox: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, overflow: 'hidden' },
  body:   { fontSize: 14, color: '#374151', lineHeight: 23 },
  sigBox: { backgroundColor: '#F0FDF4', borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: '#065F46' },
  sigTxt: { fontSize: 14, color: '#374151', lineHeight: 23, fontStyle: 'italic' },
});