import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DetailShell, { Section, ArabicBlock, BulletList } from './DetailShell';
import { LivingWord } from '../../data/library/types';

const BLUE = '#1D4ED8';

export default function WordDetail({ word, visible, onClose }: {
  word: LivingWord | null; visible: boolean; onClose: () => void;
}) {
  if (!word) return null;
  return (
    <DetailShell
      visible={visible} onClose={onClose}
      title={word.title}
      subtitle={`— ${word.speaker}`}
      gradient={['#1E1B4B', '#1D4ED8', '#2563EB']}
    >
      {/* The quote itself */}
      <View style={wd.quoteWrap}>
        <Text style={wd.quoteOpen}>"</Text>
        <Text style={wd.quoteTxt}>{word.fullText}</Text>
        <Text style={wd.quoteClose}>"</Text>
        <Text style={wd.quoteSpeaker}>— {word.speaker}</Text>
      </View>

      {word.arabicText && (
        <Section label="Arabic Text">
          <ArabicBlock text={word.arabicText} />
        </Section>
      )}

      <Section label="Context">
        <Text style={wd.body}>{word.context}</Text>
      </Section>

      <Section label="Lessons">
        <BulletList items={word.lessons} color={BLUE} />
      </Section>
    </DetailShell>
  );
}

const wd = StyleSheet.create({
  quoteWrap: {
    backgroundColor: '#EFF6FF', borderRadius: 18, padding: 20,
    alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  quoteOpen:    { fontSize: 48, color: '#1D4ED8', opacity: 0.2, lineHeight: 48, marginBottom: -10 },
  quoteTxt:     { fontSize: 17, color: '#1E293B', fontStyle: 'italic', textAlign: 'center', lineHeight: 26, fontWeight: '600' },
  quoteClose:   { fontSize: 48, color: '#1D4ED8', opacity: 0.2, lineHeight: 32, marginTop: -10 },
  quoteSpeaker: { fontSize: 12, color: '#1D4ED8', fontWeight: '700', marginTop: 6 },
  body:         { fontSize: 14, color: '#374151', lineHeight: 23 },
});