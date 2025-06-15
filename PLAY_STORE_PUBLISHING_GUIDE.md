# Play Store Yayınlama Rehberi - Hayatın Güncesi

## 📋 Ön Hazırlık Kontrol Listesi

### ✅ Uygulama Durumu Kontrolü
- [x] Uygulama tamamen çalışır durumda
- [x] 4 dil desteği (Türkçe, İngilizce, Almanca, Fransızca)
- [x] Android performans optimizasyonları tamamlandı
- [x] Gizlilik politikası hazır
- [x] Karanlık mod desteği
- [ ] APK/AAB dosyası oluşturulacak
- [ ] Uygulama simgesi ve ekran görüntüleri hazırlanacak

### 🔧 Teknik Gereksinimler
- **Minimum SDK**: 21 (Android 5.0)
- **Target SDK**: 34 (Android 14)
- **Uygulama Boyutu**: ~15-20 MB (tahmin)
- **İzinler**: İnternet erişimi (Wikipedia API için)

## 🏗️ 1. Adım: Production Build Oluşturma

### EAS Build ile AAB Oluşturma

```bash
# EAS CLI kurulumu (eğer yoksa)
npm install -g @expo/eas-cli

# EAS hesabına giriş
eas login

# Build konfigürasyonu
eas build:configure

# Production build oluşturma
eas build --platform android --profile production
```

### Alternatif: Expo Build Service

```bash
# Expo CLI ile build
expo build:android -t app-bundle
```

### Build Konfigürasyonu (eas.json)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle",
        "gradleCommand": ":app:bundleRelease"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

## 🎨 2. Adım: Görsel Materyaller Hazırlama

### Uygulama Simgesi
- **Boyut**: 512x512 px
- **Format**: PNG (şeffaf arka plan)
- **Tasarım**: Mevcut app.json'daki simgeyi optimize et

### Özellik Grafiği (Feature Graphic)
- **Boyut**: 1024x500 px
- **Format**: PNG veya JPG
- **İçerik**: Uygulama adı + ana özellikler

### Ekran Görüntüleri

#### Telefon Ekran Görüntüleri (Zorunlu)
- **Boyut**: 16:9 veya 9:16 oranında
- **Minimum**: 320px
- **Maksimum**: 3840px
- **Adet**: 2-8 adet

#### Önerilen Ekran Görüntüleri:
1. **Ana Ekran**: Kategori seçimi
2. **Tarih Seçimi**: Doğum tarihi girişi
3. **Olay Listesi**: Tarihi olaylar görünümü
4. **Olay Detayı**: Genişletilmiş olay bilgisi
5. **Ayarlar**: Dil seçimi ve karanlık mod
6. **Gizlilik**: Gizlilik politikası ekranı

#### Tablet Ekran Görüntüleri (Opsiyonel)
- **Boyut**: 7" ve 10" tablet boyutları
- **Adet**: 1-8 adet

## 📝 3. Adım: Play Console'da Uygulama Oluşturma

### Yeni Uygulama Oluşturma
1. [Google Play Console](https://play.google.com/console)'a giriş yapın
2. "Uygulama oluştur" butonuna tıklayın
3. Uygulama detaylarını doldurun:
   - **Uygulama adı**: "Hayatın Güncesi"
   - **Varsayılan dil**: Türkçe
   - **Uygulama türü**: Uygulama
   - **Ücretsiz/Ücretli**: Ücretsiz

### Uygulama Kategorisi ve Etiketleri
- **Kategori**: Eğitim
- **Alt kategori**: Genel eğitim
- **Etiketler**: tarih, eğitim, kişisel, günce, wikipedia

## 📋 4. Adım: Mağaza Sayfası Bilgileri

### Kısa Açıklama (80 karakter)
```
Doğum tarihinizde yaşanan tarihi olayları keşfedin! 4 dil, karanlık mod.
```

### Uzun Açıklama (4000 karakter)

```
🎂 Doğum Tarihinizde Neler Oldu?

Hayatın Güncesi ile doğum tarihinizde dünyada yaşanan tarihi olayları, doğan ünlü kişileri ve önemli gelişmeleri keşfedin!

✨ ÖZELLİKLER:

📅 5 Farklı Kategori:
• Tarihi Olaylar - O günün önemli hadiselerini öğrenin
• Doğumlar - Ünlü kişilerin doğum günlerini keşfedin  
• Ölümler - Tarihte kaybettiğimiz önemli isimleri hatırlayın
• Tatiller - Dünya genelindeki özel günleri görün
• Seçilmiş Olaylar - Wikipedia'nın öne çıkardığı olaylar

🌍 Çok Dilli Destek:
• Türkçe (Ana dil)
• English (İngilizce)
• Deutsch (Almanca)  
• Français (Fransızca)
• Otomatik dil algılama

🎨 Modern Tasarım:
• Karanlık mod desteği
• Kullanıcı dostu arayüz
• Hızlı ve akıcı performans
• Android optimizasyonları

🔒 Gizlilik Odaklı:
• Kişisel veri toplama YOK
• İnternet sadece Wikipedia API için
• Tamamen güvenli kullanım

📱 Teknik Özellikler:
• React Native & Expo ile geliştirildi
• Wikipedia API entegrasyonu
• Çevrimdışı önbellek desteği
• Düşük pil tüketimi

🎯 Kimler İçin:
• Tarih meraklıları
• Öğrenciler ve eğitimciler
• Kişisel gelişim odaklı kullanıcılar
• Doğum günü sürprizleri arayanlar

Hayatın Güncesi ile geçmişin kapılarını aralayın ve doğum tarihinizin özel anlamını keşfedin!

#tarih #eğitim #doğumgünü #wikipedia #çokdilli
```

### Anahtar Kelimeler (SEO)
```
tarih, tarihi olaylar, doğum günü, wikipedia, eğitim, kişisel, günce, çok dilli, karanlık mod, performans, gizlilik, ücretsiz
```

## 🖼️ 5. Adım: Görsel Yükleme

### Play Console'da Görsel Yükleme Sırası:
1. **Uygulama simgesi** (512x512)
2. **Özellik grafiği** (1024x500)
3. **Telefon ekran görüntüleri** (2-8 adet)
4. **Tablet ekran görüntüleri** (opsiyonel)

### Görsel Optimizasyon İpuçları:
- Yüksek çözünürlük kullanın
- Metin okunabilir olsun
- Uygulama özelliklerini vurgulayın
- Tutarlı renk paleti kullanın

## 📦 6. Adım: APK/AAB Yükleme

### App Bundle Yükleme:
1. "Uygulama paketleri" sekmesine gidin
2. "Yeni sürüm oluştur" butonuna tıklayın
3. AAB dosyasını sürükleyip bırakın
4. Sürüm notlarını ekleyin

### Sürüm Notları (v1.0.0):
```
🎉 İlk Sürüm - Hayatın Güncesi

✨ Özellikler:
• 5 kategori ile tarihi keşif
• 4 dil desteği (TR/EN/DE/FR)
• Karanlık mod
• Hızlı performans
• Gizlilik odaklı tasarım

📱 Android optimizasyonları ile mükemmel deneyim!
```

## 🔍 7. Adım: İçerik Derecelendirmesi

### Derecelendirme Anketi:
1. "İçerik derecelendirmesi" bölümüne gidin
2. Anketi doldurun:
   - **Kategori**: Eğitim
   - **Şiddet**: Yok
   - **Cinsel içerik**: Yok
   - **Uyuşturucu**: Yok
   - **Simülasyon**: Yok
   - **Sosyal özellikler**: Yok

### Beklenen Derecelendirme:
- **PEGI**: 3+ (Herkes için uygun)
- **ESRB**: E (Everyone)
- **USK**: 0+ (Yaş sınırı yok)

## 🌍 8. Adım: Hedef Kitle ve Ülkeler

### Hedef Yaş Grubu:
- **Birincil**: 13-65 yaş
- **İkincil**: Tüm yaşlar

### Ülke/Bölge Seçimi:
```
Önerilen Ülkeler:
🇹🇷 Türkiye (Ana pazar)
🇺🇸 Amerika Birleşik Devletleri
🇬🇧 Birleşik Krallık
🇩🇪 Almanya
🇫🇷 Fransa
🇨🇦 Kanada
🇦🇺 Avustralya
🇳🇱 Hollanda
🇧🇪 Belçika
🇦🇹 Avusturya
```

## 📋 9. Adım: Gizlilik Politikası

### Gizlilik Politikası URL'si:
Uygulamanızda mevcut gizlilik politikasını web'de yayınlayın:

```
Privacy Policy URL: https://wupani.github.io/hayatin-guncesi/privacy-policy.html
```

**Çok dilli erişim için:**
- Türkçe: https://wupani.github.io/hayatin-guncesi/privacy-policy.html#tr
- English: https://wupani.github.io/hayatin-guncesi/privacy-policy.html#en
- Deutsch: https://wupani.github.io/hayatin-guncesi/privacy-policy.html#de
- Français: https://wupani.github.io/hayatin-guncesi/privacy-policy.html#fr

### Gizlilik Politikası İçeriği:
Mevcut `PrivacyScreen.tsx` içeriğini HTML formatında web sayfası olarak yayınlayın.

## 🚀 10. Adım: Test ve Yayınlama

### İç Test (Internal Testing):
1. "Test" sekmesine gidin
2. "İç test" oluşturun
3. Test kullanıcıları ekleyin
4. AAB dosyasını yükleyin

### Test Senaryoları:
- [ ] Uygulama açılışı
- [ ] Dil değiştirme
- [ ] Tarih seçimi
- [ ] Kategori değiştirme
- [ ] Karanlık mod geçişi
- [ ] Gizlilik politikası görüntüleme

### Kapalı Test (Closed Testing):
1. İç test başarılı olduktan sonra
2. Daha geniş test grubu (20-100 kişi)
3. 14 gün test süresi

### Açık Test (Open Testing):
1. Kapalı test başarılı olduktan sonra
2. Herkese açık beta
3. Geri bildirim toplama

### Production Yayınlama:
1. Tüm testler başarılı olduktan sonra
2. "Production" sekmesine gidin
3. "Yeni sürüm oluştur"
4. Final kontrolü yapın
5. "Yayınla" butonuna tıklayın

## ⏱️ 11. Adım: Yayınlama Süreci ve Bekleme Süreleri

### Google Play İnceleme Süreci:
- **İlk inceleme**: 1-3 gün
- **Güncelleme incelemesi**: Birkaç saat - 1 gün
- **Reddedilme durumu**: Düzeltme + yeniden gönderim

### Yayınlama Sonrası:
- **Mağazada görünme**: 2-4 saat
- **Arama sonuçlarında**: 24-48 saat
- **Tam indeksleme**: 1 hafta

## 📊 12. Adım: Yayın Sonrası Takip

### Play Console Metrikleri:
- **İndirme sayıları**
- **Kullanıcı değerlendirmeleri**
- **Çökme raporları**
- **ANR (Application Not Responding) raporları**

### Önemli KPI'lar:
- **İndirme oranı**: %2-5 (görüntüleme/indirme)
- **Tutma oranı**: 1 gün, 7 gün, 30 gün
- **Ortalama değerlendirme**: 4.0+ hedef
- **Çökme oranı**: %1'in altında

### Optimizasyon Stratejileri:
1. **ASO (App Store Optimization)**:
   - Anahtar kelime optimizasyonu
   - Açıklama güncellemeleri
   - Görsel iyileştirmeleri

2. **Kullanıcı Geri Bildirimleri**:
   - Yorumları düzenli takip
   - Hızlı yanıt verme
   - Özellik isteklerini değerlendirme

3. **Güncelleme Stratejisi**:
   - Aylık küçük güncellemeler
   - Hata düzeltmeleri
   - Yeni özellik eklemeleri

## 🔧 13. Adım: Teknik Kontrol Listesi

### Son Kontroller:
- [ ] Uygulama adı ve açıklama kontrolü
- [ ] Tüm görseller yüklendi
- [ ] Gizlilik politikası linki çalışıyor
- [ ] İçerik derecelendirmesi tamamlandı
- [ ] Hedef ülkeler seçildi
- [ ] AAB dosyası yüklendi ve imzalandı
- [ ] Test kullanıcıları eklendi

### Yaygın Hatalar ve Çözümleri:

#### 1. "Uygulama imzalanmamış" Hatası:
```bash
# Keystore oluşturma
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. "Minimum SDK sürümü" Hatası:
`app.json` dosyasında `android.minSdkVersion` kontrolü

#### 3. "İzin eksikliği" Hatası:
`app.json` dosyasında gerekli izinlerin tanımlanması

## 📈 14. Adım: Pazarlama ve Tanıtım

### Organik Büyüme Stratejileri:
1. **Sosyal Medya Paylaşımı**:
   - Instagram hikayeler
   - Twitter duyuruları
   - LinkedIn profesyonel ağ

2. **İçerik Pazarlaması**:
   - Blog yazıları
   - YouTube tanıtım videosu
   - Podcast röportajları

3. **Influencer İşbirlikleri**:
   - Tarih bloggerları
   - Eğitim influencerları
   - Teknoloji yorumcuları

### Ücretli Tanıtım (Opsiyonel):
- **Google Ads**: Uygulama kurulum kampanyaları
- **Facebook/Instagram Ads**: Hedefli kitle reklamları
- **YouTube Ads**: Video tanıtım reklamları

## 🎯 15. Adım: Başarı Metrikleri ve Hedefler

### İlk Ay Hedefleri:
- **İndirme**: 1,000+ indirme
- **Değerlendirme**: 4.2+ ortalama puan
- **Tutma oranı**: %40+ (7 gün)
- **Çökme oranı**: %0.5'in altında

### 3 Aylık Hedefler:
- **İndirme**: 10,000+ indirme
- **Aktif kullanıcı**: 2,000+ aylık aktif
- **Değerlendirme**: 4.4+ ortalama puan
- **Yeni özellikler**: 2-3 güncelleme

### 1 Yıllık Hedefler:
- **İndirme**: 100,000+ indirme
- **Uluslararası büyüme**: 5+ ülkede top 100
- **Gelir modeli**: Premium özellikler
- **Platform genişleme**: iOS versiyonu

## 📞 Destek ve Kaynaklar

### Faydalı Linkler:
- [Google Play Console](https://play.google.com/console)
- [Android Developer Docs](https://developer.android.com)
- [Expo Documentation](https://docs.expo.dev)
- [Play Console Help](https://support.google.com/googleplay/android-developer)

### Acil Durum Kontakları:
- **Google Play Destek**: Play Console üzerinden
- **Expo Destek**: Discord/Forum
- **React Native Topluluk**: GitHub/Stack Overflow

---

## ✅ Özet Kontrol Listesi

### Yayınlama Öncesi:
- [ ] Production build oluşturuldu
- [ ] Tüm görseller hazırlandı
- [ ] Mağaza sayfası bilgileri tamamlandı
- [ ] Gizlilik politikası yayınlandı
- [ ] İç test tamamlandı

### Yayınlama Sırası:
- [ ] AAB dosyası yüklendi
- [ ] İçerik derecelendirmesi yapıldı
- [ ] Hedef ülkeler seçildi
- [ ] Son kontroller yapıldı
- [ ] Yayınlama onaylandı

### Yayınlama Sonrası:
- [ ] Metrikleri takip et
- [ ] Kullanıcı geri bildirimlerini yanıtla
- [ ] Güncelleme planını hazırla
- [ ] Pazarlama faaliyetlerini başlat

**🎉 Başarılar! Hayatın Güncesi Play Store'da yayınlanmaya hazır!** 