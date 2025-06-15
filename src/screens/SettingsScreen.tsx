import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { Settings, ArrowLeft, Shield, Moon, Sun, Info, Star, Globe } from 'lucide-react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

interface SettingsScreenProps {
  onBack: () => void;
  onPrivacyPress: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onBack, 
  onPrivacyPress, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  const { t } = useTranslation();
  const styles = getStyles(isDarkMode);

  const handleRateApp = async () => {
    try {
      // Dinamik olarak package name'i al
      const packageName = Platform.OS === 'android' 
        ? Constants.expoConfig?.android?.package || 'com.hayatinguncesi.app'
        : Constants.expoConfig?.ios?.bundleIdentifier || 'com.hayatinguncesi.app';
      
      let storeUrl = '';
      
      if (Platform.OS === 'android') {
        // Android için Play Store
        storeUrl = `market://details?id=${packageName}`;
        const webStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
        
        try {
          const canOpen = await Linking.canOpenURL(storeUrl);
          if (canOpen) {
            await Linking.openURL(storeUrl);
          } else {
            await Linking.openURL(webStoreUrl);
          }
        } catch {
          await Linking.openURL(webStoreUrl);
        }
      } else {
        // iOS için App Store (gelecekte kullanılabilir)
        storeUrl = `itms-apps://itunes.apple.com/app/id${packageName}`;
        const webStoreUrl = `https://apps.apple.com/app/id${packageName}`;
        
        try {
          const canOpen = await Linking.canOpenURL(storeUrl);
          if (canOpen) {
            await Linking.openURL(storeUrl);
          } else {
            await Linking.openURL(webStoreUrl);
          }
        } catch {
          await Linking.openURL(webStoreUrl);
        }
      }
    } catch (error) {
      console.error('Store açılırken hata:', error);
      Alert.alert(
        t('settings.error'),
        t('settings.storeError'),
        [{ text: t('settings.ok'), style: 'default' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Settings size={28} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
          <Text style={styles.title}>{t('settings.title')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={20} color={isDarkMode ? "#4CAF50" : "#4CAF50"} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.language')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.languageDescription')}
                </Text>
              </View>
            </View>
            <LanguageSelector isDarkMode={isDarkMode} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={onToggleDarkMode}>
            <View style={styles.settingLeft}>
              {isDarkMode ? (
                <Moon size={20} color={isDarkMode ? "#FFFFFF" : "#333"} />
              ) : (
                <Sun size={20} color={isDarkMode ? "#FFFFFF" : "#333"} />
              )}
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.darkMode')}</Text>
                <Text style={styles.settingDescription}>
                  {isDarkMode ? t('settings.darkModeActive') : t('settings.lightModeActive')}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={onToggleDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.privacySecurity')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={onPrivacyPress}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={isDarkMode ? "#4CAF50" : "#4CAF50"} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.privacy')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.privacyDescription')}
                </Text>
              </View>
            </View>
            <ArrowLeft 
              size={16} 
              color={isDarkMode ? "#666" : "#999"} 
              style={{ transform: [{ rotate: '180deg' }] }} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.supportFeedback')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleRateApp}>
            <View style={styles.settingLeft}>
              <Star size={20} color={isDarkMode ? "#FFD700" : "#FFD700"} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.rateApp')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.rateAppDescription')}
                </Text>
              </View>
            </View>
            <ArrowLeft 
              size={16} 
              color={isDarkMode ? "#666" : "#999"} 
              style={{ transform: [{ rotate: '180deg' }] }} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Info size={20} color={isDarkMode ? "#2196F3" : "#2196F3"} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.version')}</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={isDarkMode ? "#FF9800" : "#FF9800"} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.dataSource')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.dataSourceDescription')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('app.title')}
          </Text>
          <Text style={styles.footerSubtext}>
            {t('app.subtitle')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: isDarkMode ? '#AAAAAA' : '#666',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: isDarkMode ? '#AAAAAA' : '#666',
    textAlign: 'center',
  },
});

export default SettingsScreen; 