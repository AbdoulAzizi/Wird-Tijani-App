// screens/LibraryScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LibraryHeader } from '@/components/library';
import { CategoryCard } from '@/components/library';
import { ItemCard } from '@/components/library';
import { DetailModal } from '@/components/library';
import { QuoteSection } from '@/components/library';
import ScreenBackground from '@/components/ScreenBackground';

import { 
  categories, 
  formulasData, 
  mastersData, 
  booksData, 
  holyPlacesData, 
  livingWordsData 
} from '../../components/data/libraryData';
import { COLORS } from '../../components/constants/colors';

type ViewState = 'categories' | 'items';
type ItemType = 'formula' | 'master' | 'book' | 'place' | 'word';

export default function LibraryScreen() {
  const [view, setView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('items');
  };

  const handleBackToCategories = () => {
    setView('categories');
    setSelectedCategory('');
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const getCurrentData = () => {
    switch (selectedCategory) {
      case 'formulas':
        return formulasData;
      case 'masters':
        return mastersData;
      case 'books':
        return booksData;
      case 'places':
        return holyPlacesData;
      case 'words':
        return livingWordsData;
      default:
        return [];
    }
  };

  const getItemType = (): ItemType => {
    switch (selectedCategory) {
      case 'formulas':
        return 'formula';
      case 'masters':
        return 'master';
      case 'books':
        return 'book';
      case 'places':
        return 'place';
      case 'words':
        return 'word';
      default:
        return 'formula';
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackground>
        <View style={styles.wrapper}>
          <LibraryHeader
            title={view === 'categories' ? 'Bibliothèque Spirituelle' : currentCategory?.title || ''}
            subtitle={view === 'categories' ? 'المكتبة الروحية' : currentCategory?.arabicTitle}
            showBack={view === 'items'}
            onBack={handleBackToCategories}
          />

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {view === 'categories' ? (
              <View style={styles.categoriesContainer}>
                {categories.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onPress={() => handleCategoryPress(category.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.itemsContainer}>
                {getCurrentData().map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPress={() => openModal(item)}
                  />
                ))}
              </View>
            )}

            <QuoteSection />
          </ScrollView>

          <DetailModal
            visible={modalVisible}
            onClose={closeModal}
            item={selectedItem}
            type={getItemType()}
          />
        </View>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -24,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesContainer: {
    padding: 20,
  },
  itemsContainer: {
    padding: 20,
  },
});