// utils/formatters.ts
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatArabicText = (text: string): string => {
  // Add any Arabic text formatting logic here
  return text;
};

export const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    formulas: '#059669',
    masters: '#047857',
    books: '#065F46',
    places: '#10B981',
    words: '#34D399',
  };
  return colors[categoryId] || '#059669';
};