import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Shield, ArrowLeft, Globe, Database, Lock, CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface PrivacyScreenProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack, isDarkMode = false }) => {
  const { t } = useTranslation();
  const styles = getStyles(isDarkMode);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Shield size={28} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
          <Text style={styles.title}>{t('privacy.title')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            {t('privacy.intro')}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>{t('privacy.guarantees.title')}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.guaranteeText}><Text style={styles.bold}>{t('privacy.guarantees.localProcessing')}</Text> {t('privacy.guarantees.localProcessingDesc')}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.guaranteeText}><Text style={styles.bold}>{t('privacy.guarantees.noThirdParty')}</Text> {t('privacy.guarantees.noThirdPartyDesc')}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.guaranteeText}><Text style={styles.bold}>{t('privacy.guarantees.noAds')}</Text> {t('privacy.guarantees.noAdsDesc')}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.guaranteeText}><Text style={styles.bold}>{t('privacy.guarantees.noAnalytics')}</Text> {t('privacy.guarantees.noAnalyticsDesc')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('privacy.dataStorage.title')}</Text>
          </View>
          <Text style={styles.sectionText}>
            • <Text style={styles.bold}>{t('privacy.dataStorage.temporary')}</Text> {t('privacy.dataStorage.temporaryDesc')}{'\n'}
            • <Text style={styles.bold}>{t('privacy.dataStorage.noPermanent')}</Text> {t('privacy.dataStorage.noPermanentDesc')}{'\n'}
            • <Text style={styles.bold}>{t('privacy.dataStorage.appClose')}</Text> {t('privacy.dataStorage.appCloseDesc')}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>{t('privacy.thirdParty.title')}</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{t('privacy.thirdParty.wikipediaApi')}</Text>
          <Text style={styles.sectionText}>
            • <Text style={styles.bold}>{t('privacy.thirdParty.creativeCommons')}</Text> {t('privacy.thirdParty.creativeCommonsDesc')}{'\n'}
            • <Text style={styles.bold}>{t('privacy.thirdParty.onlyDate')}</Text> {t('privacy.thirdParty.onlyDateDesc')}{'\n'}
            • <Text style={styles.bold}>{t('privacy.thirdParty.noPersonalInfo')}</Text> {t('privacy.thirdParty.noPersonalInfoDesc')}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#9C27B0" />
            <Text style={styles.sectionTitle}>{t('privacy.collectedInfo.title')}</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{t('privacy.collectedInfo.collected')}</Text>
          <Text style={styles.sectionText}>
            • <Text style={styles.bold}>{t('privacy.collectedInfo.birthDate')}</Text> {t('privacy.collectedInfo.birthDateDesc')}
          </Text>
          
          <Text style={styles.sectionSubtitle}>{t('privacy.collectedInfo.notCollected')}</Text>
          <Text style={styles.sectionText}>
            • {t('privacy.collectedInfo.name')}{'\n'}
            • {t('privacy.collectedInfo.email')}{'\n'}
            • {t('privacy.collectedInfo.phone')}{'\n'}
            • {t('privacy.collectedInfo.location')}{'\n'}
            • {t('privacy.collectedInfo.media')}{'\n'}
            • {t('privacy.collectedInfo.contacts')}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#1976D2" />
            <Text style={styles.sectionTitle}>{t('privacy.usage.title')}</Text>
          </View>
          <Text style={styles.sectionText}>
            {t('privacy.usage.description')}{'\n\n'}
            • {t('privacy.usage.fetchEvents')}{'\n'}
            • {t('privacy.usage.functionality')}{'\n'}
            • {t('privacy.usage.improvement')}
          </Text>
        </View>

        <View style={styles.highlightSection}>
          <Text style={styles.highlightTitle}>{t('privacy.important.title')}</Text>
          <Text style={styles.highlightText}>
            {t('privacy.important.description')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('privacy.footer.lastUpdate')} {new Date().toLocaleDateString(undefined, { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
          <Text style={styles.footerText}>
            {t('privacy.footer.version')}
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
  introSection: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  introText: {
    fontSize: 16,
    color: isDarkMode ? '#CCCCCC' : '#555',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginLeft: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginTop: 8,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 16,
    color: isDarkMode ? '#CCCCCC' : '#555',
    lineHeight: 24,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guaranteeText: {
    fontSize: 16,
    color: isDarkMode ? '#CCCCCC' : '#555',
    lineHeight: 24,
    marginLeft: 8,
    flex: 1,
  },
  highlightSection: {
    backgroundColor: isDarkMode ? '#1E3A8A' : '#E3F2FD',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: isDarkMode ? '#3B82F6' : '#64B5F6',
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#1976D2',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 16,
    color: isDarkMode ? '#E3F2FD' : '#1976D2',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: isDarkMode ? '#AAAAAA' : '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default PrivacyScreen; 