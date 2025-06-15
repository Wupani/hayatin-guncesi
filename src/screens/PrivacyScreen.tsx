import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Shield, ArrowLeft, Globe, Database, Lock } from 'lucide-react-native';

interface PrivacyScreenProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack, isDarkMode = false }) => {
  const styles = getStyles(isDarkMode);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Shield size={28} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
          <Text style={styles.title}>Gizlilik Politikası</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Veri Güvenliği</Text>
          </View>
          <Text style={styles.sectionText}>
            Hayatın Güncesi uygulaması gizliliğinizi korur ve kişisel verilerinizi güvende tutar.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>Toplanan Veriler</Text>
          </View>
          <Text style={styles.sectionText}>
            • <Text style={styles.bold}>Doğum Tarihi:</Text> Sadece gün ve ay bilgisi yerel olarak kullanılır{'\n'}
            • <Text style={styles.bold}>Hiçbir Kişisel Veri:</Text> İsim, yaş, konum gibi bilgiler toplanmaz{'\n'}
            • <Text style={styles.bold}>Sunucuya Gönderim Yok:</Text> Verileriniz hiçbir sunucuya gönderilmez
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>Veri Kaynağı</Text>
          </View>
          <Text style={styles.sectionText}>
            • <Text style={styles.bold}>Wikipedia API:</Text> Tarihi olaylar Wikipedia'dan çekilir{'\n'}
            • <Text style={styles.bold}>Creative Commons:</Text> Tüm içerik Creative Commons lisansı altındadır{'\n'}
            • <Text style={styles.bold}>Açık Kaynak:</Text> Halka açık ve ücretsiz veriler kullanılır
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Gizlilik Garantileri</Text>
          </View>
          <Text style={styles.sectionText}>
            ✅ <Text style={styles.bold}>Yerel İşlem:</Text> Tüm veriler cihazınızda işlenir{'\n'}
            ✅ <Text style={styles.bold}>Üçüncü Taraf Yok:</Text> Verileriniz üçüncü taraflarla paylaşılmaz{'\n'}
            ✅ <Text style={styles.bold}>Reklam Yok:</Text> Kişisel veri toplayan reklamlar yoktur{'\n'}
            ✅ <Text style={styles.bold}>Analitik Yok:</Text> Kullanım verileriniz takip edilmez
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#F44336" />
            <Text style={styles.sectionTitle}>Veri Saklama</Text>
          </View>
          <Text style={styles.sectionText}>
            • <Text style={styles.bold}>Geçici Saklama:</Text> Doğum tarihi sadece uygulama açıkken bellekte tutulur{'\n'}
            • <Text style={styles.bold}>Kalıcı Depolama Yok:</Text> Hiçbir veri kalıcı olarak saklanmaz{'\n'}
            • <Text style={styles.bold}>Uygulama Kapanınca:</Text> Tüm veriler otomatik olarak silinir
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <Text style={styles.sectionText}>
            Gizlilik politikası hakkında sorularınız için:{'\n'}
            📧 Email: privacy@hayatinguncesi.com{'\n'}
            🌐 Web: www.hayatinguncesi.com/privacy
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </Text>
          <Text style={styles.footerText}>
            Hayatın Güncesi v1.0.0
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
  sectionText: {
    fontSize: 16,
    color: isDarkMode ? '#CCCCCC' : '#555',
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