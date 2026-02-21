// screens/LibraryScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

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
    <View style={styles.container}>
      <ScreenBackground>
        <View style={styles.wrapper}>
          {/* Header seulement pour la vue catégories */}
          {/* {view === 'categories' && (
            <LibraryHeader
              title="Bibliothèque Spirituelle"
              subtitle="المكتبة الروحية"
              showBack={false}
              onBack={handleBackToCategories}
            />
          )} */}

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

          {/* Bouton retour flottant - APRÈS le ScrollView pour être au-dessus */}
          {view === 'items' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCategories}
              activeOpacity={0.7}
              accessibilityLabel="Retour aux catégories"
              accessibilityRole="button"
            >
              <ChevronLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          <DetailModal
            visible={modalVisible}
            onClose={closeModal}
            item={selectedItem}
            type={getItemType()}
          />
        </View>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
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