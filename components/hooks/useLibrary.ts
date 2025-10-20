// hooks/useLibrary.ts
import { useState, useCallback } from 'react';
import { ViewState } from '@/types/library.types';

export const useLibrary = () => {
  const [view, setView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('items');
  }, []);

  const handleBackToCategories = useCallback(() => {
    setView('categories');
    setSelectedCategory('');
  }, []);

  const openModal = useCallback((item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  return {
    view,
    selectedCategory,
    selectedItem,
    modalVisible,
    handleCategoryPress,
    handleBackToCategories,
    openModal,
    closeModal,
  };
};