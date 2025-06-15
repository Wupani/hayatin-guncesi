# 📱 Play Store Yayınlama Rehberi - Hayatın Güncesi

## 🔐 Gizlilik Politikası Gereksinimleri

### 1. **Gizlilik Politikası URL'si**
Play Store Console'da zorunlu alan:
```
https://yourdomain.com/privacy-policy.html
```
*(privacy-policy.html dosyasını web sitenizde yayınlayın)*

### 2. **Veri Güvenliği Bölümü**
Play Store Console → App Content → Data Safety bölümünde:

#### ✅ **Toplanan Veriler: YOK**
- ❌ Kişisel bilgiler toplanmaz
- ❌ Mali ve ödeme bilgileri toplanmaz  
- ❌ Sağlık ve fitness bilgileri toplanmaz
- ❌ Mesajlar toplanmaz
- ❌ Fotoğraflar ve videolar toplanmaz
- ❌ Ses dosyaları toplanmaz
- ❌ Dosyalar ve dokümanlar toplanmaz
- ❌ Takvim etkinlikleri toplanmaz
- ❌ Kişiler toplanmaz
- ❌ Uygulama etkinliği toplanmaz
- ❌ Web tarama toplanmaz
- ❌ Uygulama bilgileri ve performansı toplanmaz
- ❌ Cihaz veya diğer kimlikler toplanmaz

#### ✅ **Veri Paylaşımı: YOK**
- Hiçbir veri üçüncü taraflarla paylaşılmaz

#### ✅ **Güvenlik Uygulamaları**
- ✅ Veriler aktarım sırasında şifrelenir
- ✅ Kullanıcılar veri silinmesini talep edebilir (geçici veri)

### 3. **İzinler Açıklaması**
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
```

**Açıklama:** "Wikipedia API'sine bağlanmak için internet erişimi gereklidir. Hiçbir kişisel veri sunucuya gönderilmez."

## 📝 Uygulama Açıklaması Örnekleri

### **Kısa Açıklama (80 karakter)**
```
Doğum tarihinizle ilişkili tarihi olayları keşfedin! 🗓️✨
```

### **Uzun Açıklama**
```
🗓️ Hayatın Güncesi - Tarihi Olayları Keşfedin!

Doğum tarihinizle aynı gün ve ayda gerçekleşen tarihi olayları, ünlü doğumları, önemli vefatları ve özel günleri keşfedin!

✨ ÖZELLİKLER:
• 📅 5 farklı kategori: Olaylar, Doğumlar, Vefatlar, Tatiller, Seçilmiş
• 🌍 Türkçe ve İngilizce Wikipedia entegrasyonu
• 📱 Modern ve kullanıcı dostu arayüz
• 🔒 %100 gizlilik koruması
• 📤 Sosyal medyada paylaşım özelliği

🔐 GİZLİLİK GARANTİSİ:
• Hiçbir kişisel veri toplanmaz
• Veriler sadece cihazınızda işlenir
• Sunucuya veri gönderimi yoktur
• Reklam takibi bulunmaz

🌟 NASIL KULLANILIR:
1. Doğum gününüzü ve ayınızı girin
2. Tarihi olayları kategorilere göre inceleyin
3. İlginizi çeken olayları sosyal medyada paylaşın

Wikipedia'nın Creative Commons lisanslı içeriğini kullanarak, geçmişin kapılarını aralayın!

#TarihiOlaylar #Wikipedia #DoğumTarihi #Tarih #Keşfet
```

### **Anahtar Kelimeler**
```
tarihi olaylar, wikipedia, doğum tarihi, tarih, keşfet, olaylar, doğumlar, vefatlar, tatiller, gizlilik
```

## 🖼️ Görsel Gereksinimler

### **Uygulama İkonu**
- **Boyut:** 512x512 px
- **Format:** PNG (şeffaf arka plan)
- **Tasarım:** Takvim + tarih teması

### **Ekran Görüntüleri**
1. **Ana Ekran** - Doğum tarihi girişi
2. **Olaylar Listesi** - Tarihi olaylar
3. **Detay Ekranı** - Olay detayları
4. **Kategoriler** - 5 farklı tab
5. **Gizlilik Ekranı** - Gizlilik politikası

### **Feature Graphic**
- **Boyut:** 1024x500 px
- **İçerik:** Uygulama adı + ana özellikler

## 🏷️ Kategori ve Etiketler

### **Ana Kategori**
- Education (Eğitim)

### **Alt Kategori**
- Reference (Referans)

### **Hedef Kitle**
- **Yaş:** 13+ (Teen)
- **İçerik Derecelendirmesi:** Everyone

## 📊 Play Store Console Ayarları

### **App Content Checklist**
- ✅ Privacy Policy: Eklendi
- ✅ Data Safety: Tamamlandı
- ✅ Content Rating: Everyone
- ✅ Target Audience: 13+
- ✅ News Apps: Hayır
- ✅ COVID-19 Contact Tracing: Hayır
- ✅ Data Safety Form: Tamamlandı

### **Store Listing**
- ✅ App Name: Hayatın Güncesi
- ✅ Short Description: Eklendi
- ✅ Full Description: Eklendi
- ✅ App Icon: Yüklendi
- ✅ Feature Graphic: Yüklendi
- ✅ Screenshots: Yüklendi (en az 2 adet)

### **Release**
- ✅ App Bundle: Yüklendi (.aab dosyası)
- ✅ Release Notes: Eklendi
- ✅ Country/Region: Türkiye + diğer ülkeler

## 🚀 Yayınlama Adımları

### 1. **Hazırlık**
```bash
# APK/AAB oluştur
npx expo build:android --type app-bundle

# Test et
npx expo start --android
```

### 2. **Play Store Console**
1. Google Play Console'a giriş yap
2. "Create App" butonuna tıkla
3. Uygulama bilgilerini doldur
4. Store listing'i tamamla
5. App content'i doldur
6. Pricing & distribution ayarla

### 3. **İnceleme Süreci**
- **Süre:** 1-3 gün
- **Durum:** Play Console'dan takip et
- **Red durumu:** Geri bildirimler doğrultusunda düzelt

## ⚠️ Önemli Notlar

### **Gizlilik Politikası**
- Web sitenizde yayınlanmalı
- Erişilebilir URL olmalı
- Güncel tutulmalı

### **Veri Güvenliği**
- Hiçbir veri toplamadığınızı belirtin
- "No data collected" seçeneğini işaretleyin
- Şeffaf olun

### **İçerik Politikası**
- Wikipedia içeriği Creative Commons
- Telif hakkı sorunu yok
- Eğitici içerik

### **Güncelleme Politikası**
- Düzenli güncellemeler yapın
- Kullanıcı geri bildirimlerini değerlendirin
- Yeni özellikler ekleyin

## 📞 Destek

Yayınlama sürecinde sorun yaşarsanız:
- Google Play Console Help Center
- Stack Overflow
- React Native Community

---

**Son Güncelleme:** 25 Aralık 2024  
**Versiyon:** 1.0.0 