import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DetailShell, { Section, ArabicBlock, BulletList } from './DetailShell';
import { Book } from '../../data/library/types';

export default function BookDetail({ book, visible, onClose }: {
  book: Book | null; visible: boolean; onClose: () => void;
}) {
  if (!book) return null;
  return (
    <DetailShell
      visible={visible} onClose={onClose}
      title={book.title}
      subtitle={book.author}
      gradient={['#3B0764', '#6D28D9', '#7C3AED']}
    >
      {book.arabicTitle && (
        <Section label="Arabic Title">
          <ArabicBlock text={book.arabicTitle} />
        </Section>
      )}

      <Section label="About This Book">
        <Text style={bd.body}>{book.fullDescription}</Text>
      </Section>

      <Section label="Key Topics">
        <BulletList items={book.keyTopics} color="#7C3AED" />
      </Section>

      <Section label="Significance">
        <View style={bd.sigBox}>
          <Text style={bd.sigTxt}>{book.significance}</Text>
        </View>
      </Section>
    </DetailShell>
  );
}

const bd = StyleSheet.create({
  body:   { fontSize: 14, color: '#374151', lineHeight: 23 },
  sigBox: { backgroundColor: '#F5F3FF', borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: '#7C3AED' },
  sigTxt: { fontSize: 14, color: '#374151', lineHeight: 23, fontStyle: 'italic' },
});