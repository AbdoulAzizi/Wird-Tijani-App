import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, Plus, Trash2, ChevronRight, Check, BookOpen, Sparkles } from 'lucide-react-native';
import {
  AzkarItem, AzkarCategory,
  CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS, PRESET_AZKARS,
} from '@/data/azkarData';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DhikrPickerModalProps {
  visible: boolean;
  dark: boolean;
  customAzkars: AzkarItem[];
  onSelect: (azkar: AzkarItem, target: number) => void;
  onAddCustom: (item: Omit<AzkarItem, 'id' | 'category' | 'isCustom' | 'createdAt'>) => void;
  onDeleteCustom: (id: string) => void;
  onClose: () => void;
}

// ─── Glass helpers ────────────────────────────────────────────────────────────

const glassLight = {
  backgroundColor: 'rgba(255,255,255,0.82)',
  borderColor:     'rgba(255,255,255,0.90)',
} as const;

const glassDark = {
  backgroundColor: 'rgba(15,23,42,0.80)',
  borderColor:     'rgba(255,255,255,0.07)',
} as const;

// ─── Target Selector ──────────────────────────────────────────────────────────

const QUICK_TARGETS = [3, 7, 10, 11, 12, 33, 34, 100, 300, 500, 1000];

function TargetSelector({
  value, onChange, dark,
}: { value: number; onChange: (n: number) => void; dark: boolean }) {
  const [custom, setCustom] = useState('');

  const commit = () => {
    const n = parseInt(custom, 10);
    if (n > 0 && n <= 100000) { onChange(n); setCustom(''); }
    else Alert.alert('Invalid number', 'Please enter a number between 1 and 100,000.');
  };

  return (
    <View style={tgt.wrap}>
      <Text style={[tgt.label, dark && tgt.labelDark]}>Number of recitations</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tgt.row}>
        {QUICK_TARGETS.map(n => (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            style={[
              tgt.chip,
              dark ? tgt.chipDark : tgt.chipLight,
              value === n && tgt.chipActive,
            ]}
            activeOpacity={0.75}
          >
            <Text style={[tgt.chipText, dark && tgt.chipTextDark, value === n && tgt.chipTextActive]}>
              {n}×
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={tgt.customRow}>
        <TextInput
          style={[tgt.input, dark ? tgt.inputDark : tgt.inputLight]}
          placeholder="Custom number…"
          placeholderTextColor={dark ? '#475569' : '#94A3B8'}
          keyboardType="numeric"
          value={custom}
          onChangeText={setCustom}
          onSubmitEditing={commit}
          returnKeyType="done"
        />
        <TouchableOpacity style={tgt.customBtn} onPress={commit} activeOpacity={0.8}>
          <Check color="#fff" size={18} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const tgt = StyleSheet.create({
  wrap: { gap: 10, marginBottom: 24 },
  label: {
    fontSize: 12, fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  labelDark: { color: '#475569' },
  row: { gap: 8, paddingBottom: 4 },

  chip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 22, borderWidth: 1.5,
  },
  chipLight: { backgroundColor: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.9)' },
  chipDark:  { backgroundColor: 'rgba(30,41,59,0.70)',   borderColor: 'rgba(255,255,255,0.07)' },
  chipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  chipText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  chipTextDark: { color: '#94A3B8' },
  chipTextActive: { color: '#FFFFFF' },

  customRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1, height: 46, borderRadius: 14,
    borderWidth: 1.5, paddingHorizontal: 14,
    fontSize: 15, color: '#1E293B',
  },
  inputLight: { backgroundColor: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.9)' },
  inputDark:  { backgroundColor: 'rgba(30,41,59,0.70)',   borderColor: 'rgba(255,255,255,0.07)', color: '#F8FAFC' },
  customBtn: {
    width: 46, height: 46, borderRadius: 14, backgroundColor: '#059669',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#059669', shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
});

// ─── Add Custom Form ──────────────────────────────────────────────────────────

const CUSTOM_COLORS = [
  '#059669', '#7C3AED', '#0891B2', '#DB2777', '#F59E0B',
  '#6366F1', '#16A34A', '#DC2626', '#0284C7', '#9333EA',
];

function AddCustomForm({
  dark, onAdd, onCancel,
}: {
  dark: boolean;
  onAdd: (item: Omit<AzkarItem, 'id' | 'category' | 'isCustom' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [title,           setTitle]       = useState('');
  const [arabic,          setArabic]      = useState('');
  const [transliteration, setTranslit]    = useState('');
  const [translation,     setTranslation] = useState('');
  const [target,          setTarget]      = useState(33);
  const [color,           setColor]       = useState(CUSTOM_COLORS[0]);

  const g = dark ? glassDark : glassLight;

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Name required', 'Please give your dhikr a name.'); return;
    }
    onAdd({
      title: title.trim(),
      arabic: arabic.trim(),
      transliteration: transliteration.trim(),
      translation: translation.trim(),
      defaultTarget: target,
      color,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <Text style={[cf.heading, dark && cf.headingDark]}>New Custom Dhikr</Text>

        {/* Name */}
        <Text style={[cf.lbl, dark && cf.lblDark]}>Name *</Text>
        <TextInput
          style={[cf.inp, { ...g }]}
          placeholder="e.g. Morning tasbih"
          placeholderTextColor={dark ? '#475569' : '#94A3B8'}
          value={title} onChangeText={setTitle}
        />

        {/* Arabic */}
        <Text style={[cf.lbl, dark && cf.lblDark]}>Arabic text</Text>
        <TextInput
          style={[cf.inp, cf.inpArabic, { ...g }]}
          placeholder="اكتب هنا…"
          placeholderTextColor={dark ? '#475569' : '#94A3B8'}
          value={arabic} onChangeText={setArabic}
          textAlign="right" multiline
        />

        {/* Transliteration */}
        <Text style={[cf.lbl, dark && cf.lblDark]}>Transliteration</Text>
        <TextInput
          style={[cf.inp, { ...g }]}
          placeholder="e.g. Subḥāna Llāh"
          placeholderTextColor={dark ? '#475569' : '#94A3B8'}
          value={transliteration} onChangeText={setTranslit}
        />

        {/* Translation */}
        <Text style={[cf.lbl, dark && cf.lblDark]}>Translation</Text>
        <TextInput
          style={[cf.inp, { ...g }]}
          placeholder="e.g. Glory be to Allah"
          placeholderTextColor={dark ? '#475569' : '#94A3B8'}
          value={translation} onChangeText={setTranslation}
        />

        {/* Target */}
        <TargetSelector value={target} onChange={setTarget} dark={dark} />

        {/* Color */}
        <Text style={[cf.lbl, dark && cf.lblDark]}>Accent colour</Text>
        <View style={cf.colorRow}>
          {CUSTOM_COLORS.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[cf.colorDot, { backgroundColor: c }, color === c && cf.colorDotActive]}
              activeOpacity={0.8}
            >
              {color === c && <Check color="#fff" size={15} strokeWidth={3} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <View style={cf.btnRow}>
          <TouchableOpacity
            onPress={onCancel}
            style={[cf.btn, cf.btnCancel, dark ? cf.btnCancelDark : cf.btnCancelLight]}
            activeOpacity={0.8}
          >
            <Text style={[cf.btnText, dark ? { color: '#94A3B8' } : { color: '#64748B' }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAdd} style={[cf.btn, cf.btnAdd]} activeOpacity={0.8}>
            <Plus color="#fff" size={16} strokeWidth={2.5} />
            <Text style={[cf.btnText, { color: '#fff' }]}>Add Dhikr</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const cf = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 20, letterSpacing: -0.3 },
  headingDark: { color: '#F8FAFC' },
  lbl: {
    fontSize: 12, fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 6, marginTop: 16,
  },
  lblDark: { color: '#475569' },
  inp: {
    height: 48, borderRadius: 14, borderWidth: 1.5,
    paddingHorizontal: 14, fontSize: 15, color: '#1E293B',
  },
  inpArabic: {
    height: 88, paddingTop: 14,
    fontFamily: 'Amiri_400Regular', fontSize: 22, lineHeight: 34,
    color: '#1E293B',
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
  colorDot: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  colorDotActive: {
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 5,
  },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  btn: {
    flex: 1, height: 52, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnCancel: { borderWidth: 1.5 },
  btnCancelLight: { backgroundColor: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.9)' },
  btnCancelDark:  { backgroundColor: 'rgba(30,41,59,0.70)',   borderColor: 'rgba(255,255,255,0.07)' },
  btnAdd: {
    backgroundColor: '#059669',
    shadowColor: '#059669', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  btnText: { fontSize: 15, fontWeight: '700' },
});

// ─── Azkar Row ────────────────────────────────────────────────────────────────

function AzkarRow({
  item, dark, onSelect, onDelete,
}: { item: AzkarItem; dark: boolean; onSelect: () => void; onDelete?: () => void }) {
  return (
    <TouchableOpacity
      style={[ar.wrap, dark ? ar.wrapDark : ar.wrapLight]}
      onPress={onSelect}
      activeOpacity={0.75}
    >
      {/* Colour dot */}
      <View style={[ar.iconWrap, { backgroundColor: item.color + '22' }]}>
        <View style={[ar.dot, { backgroundColor: item.color }]} />
      </View>

      {/* Text */}
      <View style={ar.content}>
        <Text style={[ar.title, dark && ar.titleDark]} numberOfLines={1}>{item.title}</Text>
        <Text style={[ar.arabic, dark && ar.arabicDark]} numberOfLines={1}>{item.arabic}</Text>
      </View>

      {/* Right */}
      <View style={ar.right}>
        <View style={[ar.countBadge, { backgroundColor: item.color + '18' }]}>
          <Text style={[ar.countText, { color: item.color }]}>{item.defaultTarget}×</Text>
        </View>
        {onDelete ? (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={ar.delBtn}
          >
            <Trash2 color="#EF4444" size={16} strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <ChevronRight color={dark ? '#334155' : '#CBD5E1'} size={16} strokeWidth={2.5} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const ar = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 14,
    marginBottom: 6, borderRadius: 16, gap: 12,
    borderWidth: 1,
  },
  wrapLight: { backgroundColor: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.85)' },
  wrapDark:  { backgroundColor: 'rgba(15,23,42,0.65)',   borderColor: 'rgba(255,255,255,0.06)' },
  iconWrap: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
  titleDark: { color: '#F1F5F9' },
  arabic: { fontSize: 16, color: '#94A3B8', fontFamily: 'Amiri_400Regular' },
  arabicDark: { color: '#475569' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  countText: { fontSize: 12, fontWeight: '800' },
  delBtn: { padding: 4 },
});

// ─── Category chip ────────────────────────────────────────────────────────────

function CatChip({
  icon, label, active, color, dark, onPress,
}: { icon?: string; label: string; active: boolean; color?: string; dark: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        cc.chip,
        dark ? cc.chipDark : cc.chipLight,
        active && (color
          ? { backgroundColor: color, borderColor: color }
          : cc.chipActiveDefault),
      ]}
    >
      {icon ? (
        <Text style={cc.icon}>{icon}</Text>
      ) : null}
      <Text
        style={[cc.text, dark && cc.textDark, active && cc.textActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const cc = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5,
    maxWidth: 120,
  },
  chipLight: { backgroundColor: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.9)' },
  chipDark:  { backgroundColor: 'rgba(30,41,59,0.65)',   borderColor: 'rgba(255,255,255,0.07)' },
  chipActiveDefault: { backgroundColor: '#059669', borderColor: '#059669' },
  icon: { fontSize: 13 },
  text: { fontSize: 11, fontWeight: '700', color: '#64748B', flexShrink: 1 },
  textDark: { color: '#94A3B8' },
  textActive: { color: '#FFFFFF' },
});

// ─── Main Modal ───────────────────────────────────────────────────────────────

type Tab = 'library' | 'custom' | 'add';
const CATEGORIES: AzkarCategory[] = ['morning_evening', 'salat', 'quran', 'tasbih', 'dua', 'tijani'];

const CAT_SHORT: Record<AzkarCategory, string> = {
  morning_evening: 'Morning',
  salat:           'Prayer',
  quran:           'Quran',
  tasbih:          'Tasbih',
  dua:             'Dua',
  tijani:          'Tijani',
  custom:          'Custom',
};

export default function DhikrPickerModal({
  visible, dark, customAzkars, onSelect, onAddCustom, onDeleteCustom, onClose,
}: DhikrPickerModalProps) {
  const [tab,            setTab]            = useState<Tab>('library');
  const [search,         setSearch]         = useState('');
  const [selectedAzkar,  setSelectedAzkar]  = useState<AzkarItem | null>(null);
  const [target,         setTarget]         = useState(33);
  const [activeCategory, setActiveCategory] = useState<AzkarCategory | 'all'>('all');

  const g = dark ? glassDark : glassLight;

  const filtered = useMemo(() => {
    const q    = search.toLowerCase();
    const pool = tab === 'custom' ? customAzkars : PRESET_AZKARS;
    return pool.filter(a => {
      const matchSearch = !q
        || a.title.toLowerCase().includes(q)
        || a.transliteration?.toLowerCase().includes(q)
        || a.arabic.includes(search);
      const matchCat = tab === 'custom' || activeCategory === 'all' || a.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [tab, customAzkars, search, activeCategory]);

  const handleSelectAzkar = useCallback((azkar: AzkarItem) => {
    setSelectedAzkar(azkar);
    setTarget(azkar.defaultTarget);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedAzkar) return;
    onSelect(selectedAzkar, target);
    setSelectedAzkar(null);
    onClose();
  }, [selectedAzkar, target, onSelect, onClose]);

  const handleAddCustom = useCallback((item: Omit<AzkarItem, 'id' | 'category' | 'isCustom' | 'createdAt'>) => {
    onAddCustom(item);
    setTab('custom');
  }, [onAddCustom]);

  const handleDeleteCustom = useCallback((id: string) => {
    Alert.alert('Delete dhikr', 'Remove this custom dhikr permanently?', [
      { text: 'Cancel',  style: 'cancel' },
      { text: 'Delete',  style: 'destructive', onPress: () => onDeleteCustom(id) },
    ]);
  }, [onDeleteCustom]);

  const handleClose = () => {
    setSelectedAzkar(null);
    setSearch('');
    setTab('library');
    setActiveCategory('all');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[m.root, dark ? m.rootDark : m.rootLight]}>

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <View style={[m.header, dark ? m.headerDark : m.headerLight]}>
          {selectedAzkar ? (
            <TouchableOpacity
              onPress={() => setSelectedAzkar(null)}
              style={m.backBtn}
              activeOpacity={0.7}
            >
              <ChevronRight
                color={dark ? '#94A3B8' : '#64748B'}
                size={20} strokeWidth={2.5}
                style={{ transform: [{ scaleX: -1 }] }}
              />
              <Text style={[m.backText, dark && m.backTextDark]}>Back</Text>
            </TouchableOpacity>
          ) : tab === 'add' ? (
            <TouchableOpacity onPress={() => setTab('library')} style={m.backBtn} activeOpacity={0.7}>
              <ChevronRight
                color={dark ? '#94A3B8' : '#64748B'}
                size={20} strokeWidth={2.5}
                style={{ transform: [{ scaleX: -1 }] }}
              />
              <Text style={[m.backText, dark && m.backTextDark]}>Back</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[m.headerTitle, dark && m.headerTitleDark]}>Choose a Dhikr</Text>
          )}

          <TouchableOpacity onPress={handleClose} style={[m.closeBtn, dark ? m.closeBtnDark : m.closeBtnLight]} activeOpacity={0.7}>
            <X color={dark ? '#94A3B8' : '#64748B'} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* ══ CONFIRMATION SCREEN ═════════════════════════════════════════════ */}
        {selectedAzkar ? (
          <ScrollView contentContainerStyle={m.confirmPad} showsVerticalScrollIndicator={false}>

            <View style={[m.previewCard, dark ? m.previewCardDark : m.previewCardLight, { borderLeftColor: selectedAzkar.color }]}>
              <View style={[m.previewBadge, { backgroundColor: selectedAzkar.color + '22' }]}>
                <Text style={[m.previewBadgeText, { color: selectedAzkar.color }]}>
                  {CATEGORY_ICONS[selectedAzkar.category]}  {CATEGORY_LABELS[selectedAzkar.category]}
                </Text>
              </View>
              <Text style={[m.previewTitle, dark && m.previewTitleDark]}>{selectedAzkar.title}</Text>
              <Text style={[m.previewArabic, dark && m.previewArabicDark]}>{selectedAzkar.arabic}</Text>
              {selectedAzkar.transliteration ? (
                <Text style={[m.previewTranslit, { color: selectedAzkar.color }]}>
                  {selectedAzkar.transliteration}
                </Text>
              ) : null}
              {selectedAzkar.translation ? (
                <Text style={[m.previewTrans, dark && m.previewTransDark]}>{selectedAzkar.translation}</Text>
              ) : null}
            </View>

            <TargetSelector value={target} onChange={setTarget} dark={dark} />

            <TouchableOpacity
              onPress={handleConfirm}
              style={[m.confirmBtn, { backgroundColor: selectedAzkar.color, shadowColor: selectedAzkar.color }]}
              activeOpacity={0.85}
            >
              <Text style={m.confirmBtnText}>Start — {target}×</Text>
            </TouchableOpacity>

          </ScrollView>

        /* ══ ADD CUSTOM FORM ══════════════════════════════════════════════════ */
        ) : tab === 'add' ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={m.bodyPad} showsVerticalScrollIndicator={false}>
            <AddCustomForm dark={dark} onAdd={handleAddCustom} onCancel={() => setTab('library')} />
          </ScrollView>

        /* ══ LIBRARY / CUSTOM LIST ════════════════════════════════════════════ */
        ) : (
          <>
            {/* ── Tab switcher ── */}
            <View style={[m.tabs, dark ? m.tabsDark : m.tabsLight]}>
              <TouchableOpacity
                onPress={() => setTab('library')}
                style={[m.tabBtn, tab === 'library' && m.tabBtnActive]}
                activeOpacity={0.8}
              >
                <BookOpen
                  color={tab === 'library' ? '#fff' : (dark ? '#94A3B8' : '#64748B')}
                  size={14} strokeWidth={2}
                />
                <Text style={[m.tabBtnText, dark && m.tabBtnTextDark, tab === 'library' && m.tabBtnTextActive]}>
                  Library
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTab('custom')}
                style={[m.tabBtn, tab === 'custom' && m.tabBtnActive]}
                activeOpacity={0.8}
              >
                <Sparkles
                  color={tab === 'custom' ? '#fff' : (dark ? '#94A3B8' : '#64748B')}
                  size={14} strokeWidth={2}
                />
                <Text style={[m.tabBtnText, dark && m.tabBtnTextDark, tab === 'custom' && m.tabBtnTextActive]}>
                  My Dhikrs{customAzkars.length > 0 ? ` (${customAzkars.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Search ── */}
            <View style={[m.searchWrap, dark ? m.searchWrapDark : m.searchWrapLight]}>
              <Search color={dark ? '#475569' : '#94A3B8'} size={17} strokeWidth={2} />
              <TextInput
                style={[m.searchInput, dark && m.searchInputDark]}
                placeholder="Search azkars…"
                placeholderTextColor={dark ? '#475569' : '#94A3B8'}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search ? (
                <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X color={dark ? '#475569' : '#94A3B8'} size={15} strokeWidth={2} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* ── Category chips (library only) ── */}
            {tab === 'library' && (
              <View style={m.catWrap}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={m.catRow}
                >
                  <CatChip
                    label="All"
                    active={activeCategory === 'all'}
                    dark={dark}
                    onPress={() => setActiveCategory('all')}
                  />
                  {CATEGORIES.map(c => (
                    <CatChip
                      key={c}
                      icon={CATEGORY_ICONS[c]}
                      label={CAT_SHORT[c]}
                      active={activeCategory === c}
                      color={CATEGORY_COLORS[c]}
                      dark={dark}
                      onPress={() => setActiveCategory(c)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── List ── */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={m.listPad}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Add custom button (custom tab) */}
              {tab === 'custom' && (
                <TouchableOpacity
                  style={[m.addRow, dark ? m.addRowDark : m.addRowLight]}
                  onPress={() => setTab('add')}
                  activeOpacity={0.8}
                >
                  <View style={m.addIconWrap}>
                    <Plus color="#059669" size={18} strokeWidth={2.5} />
                  </View>
                  <View>
                    <Text style={m.addRowTitle}>Create new Dhikr</Text>
                    <Text style={[m.addRowSub, dark && m.addRowSubDark]}>Add a personalised azkar</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Empty state */}
              {filtered.length === 0 ? (
                <View style={m.empty}>
                  <Text style={m.emptyIcon}>{tab === 'custom' ? '✨' : '🔍'}</Text>
                  <Text style={[m.emptyTitle, dark && m.emptyTitleDark]}>
                    {tab === 'custom' ? 'No custom dhikrs yet' : 'No results found'}
                  </Text>
                  <Text style={[m.emptySub, dark && m.emptySubDark]}>
                    {tab === 'custom'
                      ? 'Tap "Create new Dhikr" above to add one'
                      : 'Try a different search term or category'}
                  </Text>
                </View>
              ) : (
                filtered.map(item => (
                  <AzkarRow
                    key={item.id}
                    item={item}
                    dark={dark}
                    onSelect={() => handleSelectAzkar(item)}
                    onDelete={item.isCustom ? () => handleDeleteCustom(item.id) : undefined}
                  />
                ))
              )}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const m = StyleSheet.create({
  root: { flex: 1 },
  rootLight: { backgroundColor: '#EEF2F0' },
  rootDark:  { backgroundColor: '#080E14' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderBottomColor: 'rgba(255,255,255,0.7)',
  },
  headerDark: {
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  headerTitleDark: { color: '#F8FAFC' },

  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5,
  },
  closeBtnLight: { backgroundColor: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.9)' },
  closeBtnDark:  { backgroundColor: 'rgba(30,41,59,0.70)',   borderColor: 'rgba(255,255,255,0.07)' },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  backTextDark: { color: '#94A3B8' },

  // Tabs
  tabs: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tabsLight: { backgroundColor: 'rgba(255,255,255,0.60)', borderBottomColor: 'rgba(255,255,255,0.55)' },
  tabsDark:  { backgroundColor: 'rgba(15,23,42,0.65)',   borderBottomColor: 'rgba(255,255,255,0.04)' },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 9, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  tabBtnActive: { backgroundColor: '#059669' },
  tabBtnText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabBtnTextDark: { color: '#94A3B8' },
  tabBtnTextActive: { color: '#FFFFFF' },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 14, marginTop: 10, marginBottom: 6,
    paddingHorizontal: 14, height: 44,
    borderRadius: 14, borderWidth: 1.5,
  },
  searchWrapLight: { backgroundColor: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.9)' },
  searchWrapDark:  { backgroundColor: 'rgba(30,41,59,0.70)',   borderColor: 'rgba(255,255,255,0.07)' },
  searchInput: { flex: 1, fontSize: 15, color: '#1E293B' },
  searchInputDark: { color: '#F8FAFC' },

  // Category chips — wrapper hauteur fixe pour contraindre le ScrollView horizontal
  catWrap: {
    height: 44,
    marginBottom: 6,
  },
  catRow: {
    gap: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    height: 44,
  },

  // List
  listPad: { paddingHorizontal: 14, paddingTop: 2, paddingBottom: 40 },

  // Add custom row
  addRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 14, borderRadius: 16, marginBottom: 6, borderWidth: 1.5,
  },
  addRowLight: { backgroundColor: 'rgba(240,253,244,0.85)', borderColor: 'rgba(167,243,208,0.6)' },
  addRowDark:  { backgroundColor: 'rgba(5,46,22,0.55)',     borderColor: 'rgba(6,95,70,0.5)' },
  addIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center',
  },
  addRowTitle: { fontSize: 14, fontWeight: '800', color: '#059669', marginBottom: 2 },
  addRowSub: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  addRowSubDark: { color: '#475569' },

  // Empty state
  empty: { paddingVertical: 52, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 42 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  emptyTitleDark: { color: '#F8FAFC' },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  emptySubDark: { color: '#475569' },

  // Confirm screen
  confirmPad: { padding: 18, paddingBottom: 60 },

  previewCard: {
    borderRadius: 22, padding: 22, marginBottom: 24,
    borderLeftWidth: 4, borderWidth: 1,
    alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  previewCardLight: { backgroundColor: 'rgba(255,255,255,0.88)', borderColor: 'rgba(255,255,255,0.9)' },
  previewCardDark:  { backgroundColor: 'rgba(15,23,42,0.80)',    borderColor: 'rgba(255,255,255,0.08)' },
  previewBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  previewBadgeText: { fontSize: 12, fontWeight: '700' },
  previewTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  previewTitleDark: { color: '#F8FAFC' },
  previewArabic: {
    fontSize: 30, textAlign: 'center', color: '#1E293B',
    fontFamily: 'Amiri_400Regular', lineHeight: 50,
  },
  previewArabicDark: { color: '#F1F5F9' },
  previewTranslit: { fontSize: 14, fontStyle: 'italic', fontWeight: '600', textAlign: 'center' },
  previewTrans: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },
  previewTransDark: { color: '#94A3B8' },

  confirmBtn: {
    height: 56, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 7,
  },
  confirmBtnText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },

  bodyPad: { padding: 20, paddingBottom: 40 },
});