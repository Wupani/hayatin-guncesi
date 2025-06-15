import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, UserPlus, UserMinus, Gift, Star, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface CategorySelectorProps {
  onSelectionComplete: (categories: string[]) => void;
  isDarkMode?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectionComplete, isDarkMode = false }) => {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    {
      id: 'events',
      name: t('categories.events'),
      description: t('categories.eventsDesc'),
      icon: Calendar,
      color: '#64B5F6'
    },
    {
      id: 'births',
      name: t('categories.births'),
      description: t('categories.birthsDesc'),
      icon: UserPlus,
      color: '#81C784'
    },
    {
      id: 'deaths',
      name: t('categories.deaths'),
      description: t('categories.deathsDesc'),
      icon: UserMinus,
      color: '#F06292'
    },
    {
      id: 'holidays',
      name: t('categories.holidays'),
      description: t('categories.holidaysDesc'),
      icon: Gift,
      color: '#FF9800'
    },
    {
      id: 'selected',
      name: t('categories.selected'),
      description: t('categories.selectedDesc'),
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
        {t('categories.selectMultiple')}
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
          {t('categories.continue')} ({selectedCategories.length} {t('categories.categoriesSelected')})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    maxHeight: 500,
  },
  subtitle: {
    fontSize: 15,
    color: isDarkMode ? '#CCCCCC' : '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  categoriesContainer: {
    flex: 1,
    maxHeight: 360,
  },
  categoryItem: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryItem: {
    backgroundColor: isDarkMode ? '#1E3A2E' : '#F0F8F0',
    borderWidth: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 3,
  },
  categoryDescription: {
    fontSize: 13,
    color: isDarkMode ? '#CCCCCC' : '#666',
    lineHeight: 16,
  },
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: isDarkMode ? '#666' : '#999',
  },
});

export default CategorySelector; 