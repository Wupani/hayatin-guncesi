import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, Check, X } from 'lucide-react-native';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSelectorProps {
  isDarkMode?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isDarkMode = false }) => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setModalVisible(false);
    } catch (error) {
      console.log('Language change error:', error);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === i18n.language;
    
    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          isDarkMode && styles.languageItemDark,
          isSelected && styles.selectedLanguageItem,
          isSelected && isDarkMode && styles.selectedLanguageItemDark,
        ]}
        onPress={() => handleLanguageChange(item.code)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{item.flag}</Text>
          <Text style={[
            styles.languageName,
            isDarkMode && styles.languageNameDark,
            isSelected && styles.selectedLanguageName,
          ]}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <Check size={20} color={isDarkMode ? "#007AFF" : "#007AFF"} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selectorButton, isDarkMode && styles.selectorButtonDark]}
        onPress={() => setModalVisible(true)}
      >
        <Globe size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
        <Text style={[styles.selectorText, isDarkMode && styles.selectorTextDark]}>
          {currentLanguage.flag} {currentLanguage.name}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, isDarkMode && styles.modalContainerDark]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>
              {t('settings.language')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    gap: 8,
  },
  selectorButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  selectorTextDark: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  languageItemDark: {
    backgroundColor: '#2C2C2E',
  },
  selectedLanguageItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectedLanguageItemDark: {
    backgroundColor: '#1A365D',
    borderColor: '#007AFF',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  languageNameDark: {
    color: '#FFFFFF',
  },
  selectedLanguageName: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LanguageSelector; 