# 🗓️ Hayatın Güncesi (Life's Journal)

[![Version](https://img.shields.io/badge/version-2.3.0-blue.svg)](https://github.com/emreakyol/hayatin-guncesi)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)](https://expo.dev)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.3-blue.svg)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org)

> **Portfolyo Projesi** - Doğum tarihinizle ilişkilendirilmiş tarihi olayları keşfedin veya Time Machine ile herhangi bir yılı araştırın! React Native + Expo ile geliştirilmiş, çok dilli destek sunan modern mobil uygulama.

## 🚀 Proje Hakkında

Bu proje, **React Native** ve **Expo** teknolojileri kullanılarak geliştirilmiş modern bir mobil uygulamadır. Kullanıcıların doğum tarihleriyle ilişkili tarihi olayları keşfetmelerini sağlar ve "Time Machine" özelliği ile herhangi bir yıla ait olayları araştırabilirler.

### 🎯 Proje Amacı
- Tarihi olayları eğlenceli bir şekilde keşfetme
- Çok dilli destek ile global kullanıcı deneyimi
- Modern mobil uygulama geliştirme tekniklerini sergileme
- Wikipedia API entegrasyonu ile gerçek zamanlı veri

### 📱 Test Etmek İçin
- **Expo Go:** QR kod ile anında test edin
- **Development Build:** Geliştiriciler için özel build
- **Source Code:** Bu repository'yi klonlayarak yerel olarak çalıştırın

## 📱 Özellikler

### 🎯 Ana Özellikler
- ✨ **Doğum Tarihi Araması:** Doğum tarihinizi girerek o güne ait tarihi olayları görüntüleyin
- ⏰ **Time Machine:** Herhangi bir yılı (1-2024) girerek o yıla ait olayları keşfedin
- 🌍 **4 Dil Desteği:** Türkçe, İngilizce, Almanca, Fransızca
- 📊 **Kategori Bazlı Görüntüleme:** Olaylar, Doğumlar, Ölümler, Tatiller
- 🖼️ **Görsel İçerik:** Wikipedia'dan yüksek kaliteli resimlerle zenginleştirilmiş içerik

### 🔧 Teknik Özellikler
- 📱 **Responsive Tasarım:** Tablet ve telefon için optimize edilmiş
- 🌙 **Dark/Light Mode:** Göz dostu tema seçenekleri
- 🚀 **Akıllı Fallback Sistemi:** Seçilen dilde yeterli içerik yoksa İngilizce'den ek veri
- ⚡ **Paralel API Çağrıları:** Hızlı veri yükleme (1-2 saniye)
- 💾 **Performans Optimizasyonu:** Akıllı önbellekleme ve stil optimizasyonu

### 🎨 Kullanıcı Deneyimi
- 🎭 **Modal Tabanlı Arayüz:** Kolay navigasyon
- 📤 **Paylaşım Özelliği:** Olayları sosyal medyada paylaşın
- 🔍 **Detaylı Görüntüleme:** Her olay için genişletilmiş bilgi
- 🎯 **Kategori Seçimi:** İlgi alanlarınıza göre filtreleme

## 🏗️ Teknik Detaylar

### 📦 Proje Bilgileri
- **Version:** 2.3.0
- **Framework:** React Native 0.79.3 + Expo SDK 53
- **Language:** TypeScript 5.8.3
- **Target Platforms:** Android & iOS
- **Bundle Size:** ~15-20 MB (optimized)

### 🔧 Build Konfigürasyonu
- **ProGuard:** Aktif (kod optimizasyonu)
- **Resource Shrinking:** Aktif (boyut optimizasyonu)
- **Hermes Engine:** Aktif (JavaScript performansı)
- **Target SDK:** Android 14 (API 34)
- **Min SDK:** Android 7.0 (API 24)

### 📊 Performans Metrikleri
- **İlk yükleme:** 1-2 saniye
- **API yanıt süresi:** 0.5-1.5 saniye
- **Memory usage:** ~50-80 MB
- **Battery impact:** Minimal

## 🚀 Kurulum ve Geliştirme

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo CLI
- EAS CLI (production build için)

### Geliştirici Kurulumu

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/emreakyol/hayatin-guncesi.git
cd hayatin-guncesi
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Development server başlatın:**
```bash
npm start
# veya
expo start
```

4. **Production build oluşturun:**
```bash
# Önce EAS project ID'sini app.json'da güncelleyin
# Android AAB
eas build --platform android --profile production

# iOS IPA
eas build --platform ios --profile production
```

> **Not:** Production build için önce `app.json` dosyasındaki `YOUR_EAS_PROJECT_ID_HERE` kısmını kendi EAS project ID'nizle değiştirmeniz gerekiyor.

### 📱 Test Etme

**Expo Go ile:**
- Telefonda Expo Go uygulamasını açın
- QR kodu tarayın
- Uygulamayı çalıştırın

**Development Build ile:**
```bash
eas build --platform android --profile development
```

## 📁 Proje Yapısı

```
hayatin-guncesi/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Ana ekran (dual-mode arama)
│   │   ├── SettingsScreen.tsx      # Ayarlar ekranı
│   │   └── PrivacyScreen.tsx       # Gizlilik politikası
│   ├── components/
│   │   ├── EventCard.tsx           # Olay kartı bileşeni
│   │   └── CategorySelector.tsx    # Kategori seçici
│   ├── services/
│   │   └── wikiService.ts          # Wikipedia API servisi (fallback sistemi)
│   ├── locales/
│   │   ├── tr.json                 # Türkçe çeviriler
│   │   ├── en.json                 # İngilizce çeviriler
│   │   ├── de.json                 # Almanca çeviriler
│   │   └── fr.json                 # Fransızca çeviriler
│   └── utils/
│       └── performanceUtils.ts     # Performans optimizasyonları
├── assets/
│   ├── iOS/                        # iOS app icons
│   └── Android/                    # Android app icons
├── App.tsx                         # Ana uygulama dosyası
├── app.json                        # Expo konfigürasyonu
├── eas.json                        # EAS build konfigürasyonu
├── package.json
└── README.md
```

## 🎨 Tasarım ve UI

### 🎨 Renk Paleti
- **Ana renkler:** Mavi (#007AFF), Turuncu (#FF6B35)
- **Kategori renkleri:** 
  - Doğumlar: Yeşil (#81C784)
  - Ölümler: Pembe (#F06292)
  - Tatiller: Turuncu (#FF9800)
  - Seçilmiş: Mor (#9C27B0)

### 🖼️ App Icons ve Assets
- **iOS Icons:** 20x20 - 1024x1024 (tüm boyutlar)
- **Android Icons:** 48x48 - 512x512 + Adaptive Icon
- **Splash Screen:** Mavi gradient background
- **Screenshots:** Store listing için hazır

### 📱 UI/UX Özellikleri
- **Modern kartlar:** Yuvarlak köşeli, gölgeli tasarım
- **Responsive layout:** Tablet ve telefon için optimize edilmiş boyutlar
- **Smooth animasyonlar:** Modal geçişleri ve etkileşimler
- **Accessibility:** Ekran okuyucu desteği

## 🔗 API ve Veri Kaynakları

### Wikipedia REST API
Tarihi veriler Wikipedia REST API kullanılarak çekilmektedir:

**Doğum tarihi araması:**
```
https://{lang}.wikipedia.org/api/rest_v1/feed/onthisday/all/{MM}/{DD}
```

**Time Machine (yıl bazlı arama):**
- 18 stratejik tarih üzerinden paralel arama
- Önemli tarihi günler (milli bayramlar, önemli olaylar)
- Akıllı filtreleme ve tekrar kaldırma

### 🔄 Fallback Sistemi
- Seçilen dilde yeterli içerik yoksa (<10-15 olay) İngilizce'den ek arama
- Paralel API çağrıları ile performans optimizasyonu
- Timeout koruması (2 saniye)

## 📦 Kullanılan Teknolojiler

### 🏗️ Ana Framework
- **React Native + Expo SDK 53:** Mobil uygulama geliştirme
- **TypeScript:** Tip güvenliği
- **EAS Build:** Production build sistemi

### 📚 Kütüphaneler
- **react-i18next:** Çoklu dil desteği
- **axios:** HTTP istekleri
- **lucide-react-native:** Modern ikonlar
- **@react-native-async-storage/async-storage:** Yerel veri saklama

### 🔧 Expo Modülleri
- **expo-sharing:** Paylaşım özelliği
- **expo-file-system:** Dosya işlemleri
- **expo-localization:** Cihaz dili algılama
- **expo-build-properties:** Build optimizasyonları

## 🌍 Çoklu Dil Desteği

### 🗣️ Desteklenen Diller
- 🇹🇷 **Türkçe** (tr) - Ana dil
- 🇺🇸 **İngilizce** (en) - Fallback dili
- 🇩🇪 **Almanca** (de)
- 🇫🇷 **Fransızca** (fr)

### ⚙️ Dil Özellikleri
- Otomatik cihaz dili algılama
- Dinamik dil değiştirme (runtime)
- Wikipedia API'si ile uyumlu dil kodları
- Fallback sistemi ile içerik garantisi
- RTL dil desteği hazır (gelecek sürümler için)

## ⚡ Performans ve Optimizasyonlar

### 🚀 API Optimizasyonları
- **Paralel çağrılar:** Promise.all() kullanımı
- **Akıllı timeout:** 2 saniye koruma
- **Request batching:** Toplu API çağrıları
- **Duplicate removal:** Tekrar eden içerik filtreleme
- **Caching:** Akıllı önbellekleme stratejisi

### 🎯 UI Optimizasyonları
- **Memoization:** React.memo ve useMemo kullanımı
- **Lazy loading:** Gerektiğinde yükleme
- **Style caching:** Stil önbellekleme
- **Image optimization:** Resim boyutlandırma ve caching
- **Bundle splitting:** Kod bölümleme

### 📊 Performans Hedefleri
- **İlk yükleme:** < 2 saniye
- **API yanıt:** < 1.5 saniye
- **Memory usage:** < 100 MB
- **App size:** < 25 MB
- **Battery impact:** Minimal

## 🔒 Gizlilik ve Güvenlik

### 🛡️ Veri Koruma
- ✅ Hiçbir kişisel veri sunucuya gönderilmez
- ✅ Doğum tarihi sadece yerel olarak kullanılır
- ✅ Wikipedia verileri Creative Commons lisansı altında
- ✅ Açık kaynak kod - tam şeffaflık
- ✅ GDPR uyumlu

### 🔐 Güvenlik Önlemleri
- API timeout koruması
- Hata yakalama ve graceful degradation
- Input validation ve sanitization
- Secure HTTP connections (HTTPS only)
- No third-party tracking

### ⚠️ Güvenlik Notları
- **EAS Project ID:** `app.json` dosyasında `YOUR_EAS_PROJECT_ID_HERE` olarak işaretlenmiştir
- **Debug Keystore:** `.gitignore` ile korunmaktadır
- **Build Dosyaları:** AAB/IPA dosyaları repository'de bulunmamaktadır
- **Hassas Bilgiler:** Tüm güvenlik açığı yaratabilecek dosyalar .gitignore'da listelenmiştir

## 🎯 Kullanım Senaryoları

### 👤 Bireysel Kullanım
- Doğum gününüzde neler olduğunu öğrenin
- Tarihi kişiliklerle bağlantı kurun
- Eğitici içerik keşfedin
- Sosyal medya paylaşımları

### 🎓 Eğitim Sektörü
- Tarih dersleri için kaynak
- Öğrenciler için araştırma aracı
- İnteraktif öğrenme deneyimi
- Ödev ve proje desteği

### 📱 Sosyal Medya
- Doğum günü paylaşımları
- Tarihi bilgi paylaşımı
- İlginç içerik keşfi
- Viral content creation

## 🤝 Katkıda Bulunma

### 🔧 Geliştirici Katkıları
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### 🌍 Katkı Alanları
- 🌍 Yeni dil desteği ekleme
- 🎨 UI/UX iyileştirmeleri
- ⚡ Performans optimizasyonları
- 🐛 Bug düzeltmeleri
- 📚 Dokümantasyon iyileştirmeleri
- 🧪 Test coverage artırma

### 📝 Kod Standartları
- TypeScript kullanımı zorunlu
- ESLint ve Prettier konfigürasyonuna uyum
- Commit message formatı: [type]: description
- PR'lar için test coverage gerekli

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- **Wikimedia Foundation:** Wikipedia API'si için
- **Expo Team:** Harika geliştirme araçları için
- **React Native Community:** Sürekli destek için
- **Lucide Icons:** Modern ikon seti için
- **i18next Team:** Çoklu dil desteği için

## 📈 Sürüm Geçmişi

### v2.0.0 (Güncel - Play Store İnceleme Aşamasında)
- ⏰ Time Machine özelliği eklendi
- 🌍 4 dil desteği (TR, EN, DE, FR)
- 🚀 Akıllı fallback sistemi
- 🖼️ Geliştirilmiş resim görüntüleme
- 📱 Responsive tasarım iyileştirmeleri
- ⚡ Performans optimizasyonları (%60 hızlanma)
- 📦 AAB build sistemi
- 🔧 EAS Build entegrasyonu
- 🏪 **Play Store'a yüklendi - Google incelemesi bekleniyor**

### v1.0.0 (İlk Sürüm)
- ✨ Temel doğum tarihi arama
- 🎨 İlk tasarım implementasyonu
- 📤 Paylaşım özelliği
- 🇹🇷 Türkçe dil desteği

## 👨‍💻 Geliştirici

**Emre Akyol** - Full Stack Developer

- **GitHub:** [@emreakyol](https://github.com/emreakyol)
- **Portfolio:** Bu proje portfolyo amaçlı geliştirilmiştir
- **Technologies:** React Native, Expo, TypeScript, Node.js
- **Contact:** GitHub üzerinden iletişime geçebilirsiniz

## 📞 İletişim

- **Issues:** GitHub Issues
- **Pull Requests:** Katkılarınızı bekliyoruz
- **Email:** GitHub üzerinden iletişime geçin

---

**Tarihi keşiflerinizde keyifli anlar! 🎉✨**

*Made with ❤️ using React Native & Expo - Portfolio Project*