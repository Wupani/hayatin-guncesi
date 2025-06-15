import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, UserPlus, UserMinus, Gift, Star, Check } from 'lucide-react-native';

interface CategorySelectorProps {
  onSelectionComplete: (categories: string[]) => void;
  isDarkMode?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectionComplete, isDarkMode = false }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    {
      id: 'events',
      name: 'Olaylar',
      description: 'Tarihi olaylar ve önemli gelişmeler',
      icon: Calendar,
      color: '#64B5F6'
    },
    {
      id: 'births',
      name: 'Doğumlar',
      description: 'Ünlü kişilerin doğum tarihleri',
      icon: UserPlus,
      color: '#81C784'
    },
    {
      id: 'deaths',
      name: 'Vefatlar',
      description: 'Önemli kişilerin vefat tarihleri',
      icon: UserMinus,
      color: '#F06292'
    },
    {
      id: 'holidays',
      name: 'Tatiller',
      description: 'Özel günler ve kutlamalar',
      icon: Gift,
      color: '#FF9800'
    },
    {
      id: 'selected',
      name: 'Seçilmiş',
      description: 'Öne çıkan özel olaylar',
      icon: Star,
      color: '#9C27B0'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedCategories.length > 0) {
      onSelectionComplete(selectedCategories);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        İstediğiniz kategorileri seçin (birden fazla seçebilirsiniz)
      </Text>
      
      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const IconComponent = category.icon;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                isSelected && { ...styles.selectedCategoryItem, borderColor: category.color }
              ]}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryContent}>
                <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                  <IconComponent size={24} color={category.color} />
                </View>
                
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                
                {isSelected && (
                  <View style={[styles.checkContainer, { backgroundColor: category.color }]}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedCategories.length === 0 && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={selectedCategories.length === 0}
      >
        <Text style={[
          styles.continueButtonText,
          selectedCategories.length === 0 && styles.disabledButtonText
        ]}>
          Devam Et ({selectedCategories.length} kategori seçildi)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: isDarkMode ? '#CCCCCC' : '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  categoriesContainer: {
    flex: 1,
    maxHeight: 400,
  },
  categoryItem: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryItem: {
    backgroundColor: isDarkMode ? '#1E3A2E' : '#F0F8F0',
    borderWidth: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: isDarkMode ? '#CCCCCC' : '#666',
    lineHeight: 18,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: isDarkMode ? '#666' : '#999',
  },
});

export default CategorySelector; 