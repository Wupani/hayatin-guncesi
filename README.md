# 📅 Hayatın Güncesi

**Doğum tarihinizle ilişkili tarihi olayları keşfedin!**

Hayatın Güncesi, doğum gününüzde (gün/ay) tarih boyunca yaşanan önemli olayları, doğumları, vefatları ve tatilleri keşfetmenizi sağlayan React Native/Expo uygulamasıdır.

## ✨ Özellikler

- 🎂 **Doğum Tarihi Bazlı Keşif**: Sadece gün ve ay girerek o tarihe ait tarihi olayları görün
- 📚 **Çoklu Kategori**: Olaylar, Doğumlar, Vefatlar, Tatiller ve Seçilmiş İçerik
- 🌙 **Karanlık Mod**: Göz dostu karanlık tema desteği
- 📱 **Responsive Tasarım**: Telefon, tablet ve büyük ekranlar için optimize edilmiş
- 🖼️ **Görsel İçerik**: Wikipedia'dan gelen görseller ile zenginleştirilmiş içerik
- 🔒 **Gizlilik Odaklı**: Hiçbir kişisel veri toplanmaz veya saklanmaz
- ⚡ **Yüksek Performans**: Optimize edilmiş FlatList ve memoization ile hızlı deneyim

## 🛡️ Gizlilik

- ✅ **Yerel İşlem**: Tüm veriler cihazınızda işlenir
- ✅ **Veri Toplama Yok**: Hiçbir kişisel bilgi toplanmaz
- ✅ **Sunucuya Gönderim Yok**: Verileriniz hiçbir yere gönderilmez
- ✅ **Üçüncü Taraf Yok**: Reklam veya analitik servisleri kullanılmaz

**[Detaylı Gizlilik Politikası](https://wupaniyazilim.github.io/hayatin-guncesi/)**

## 🚀 Teknolojiler

- **React Native** 0.79.3
- **Expo SDK** 53
- **TypeScript** - Tip güvenliği için
- **Wikipedia API** - Tarihi veri kaynağı
- **Lucide React Native** - Modern ikonlar
- **Responsive Design** - Tüm cihaz boyutları için

## 📱 Ekran Görüntüleri

### Ana Ekran
- Temiz ve modern arayüz
- Doğum tarihi girişi (gün/ay)
- Kategori seçimi

### Tarihi Olaylar
- Kartlar halinde düzenlenmiş içerik
- Görseller ile desteklenmiş bilgiler
- Detaylı modal görünümler

### Ayarlar
- Karanlık/Açık mod geçişi
- Gizlilik politikası erişimi

## 🔧 Kurulum ve Geliştirme

### Gereksinimler
- Node.js 18+
- Expo CLI
- React Native geliştirme ortamı

### Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/wupaniyazilim/hayatin-guncesi.git

# Proje dizinine gidin
cd hayatin-guncesi

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

### Geliştirme Komutları
```bash
# Expo development server'ı başlat
npm start

# iOS simulator'da çalıştır
npm run ios

# Android emulator'da çalıştır
npm run android

# Web'de çalıştır
npm run web
```

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── EventCard.tsx   # Olay kartı bileşeni
│   └── CategorySelector.tsx # Kategori seçici
├── screens/            # Ana ekranlar
│   ├── HomeScreen.tsx  # Ana ekran
│   ├── SettingsScreen.tsx # Ayarlar ekranı
│   └── PrivacyScreen.tsx # Gizlilik politikası
├── services/           # API servisleri
│   └── wikiService.ts  # Wikipedia API entegrasyonu
└── types/              # TypeScript tip tanımları
```

## 🎯 Performans Optimizasyonları

- **React.memo** ile gereksiz re-render'ların önlenmesi
- **useCallback** ve **useMemo** ile memoization
- **FlatList** ile büyük listelerin optimize edilmesi
- **removeClippedSubviews** ile bellek optimizasyonu
- **getItemLayout** ile scroll performansı artırımı

## 🌐 Veri Kaynağı

Uygulama, [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) kullanarak tarihi verileri çeker:
- Tüm içerik Creative Commons lisansı altındadır
- Halka açık ve ücretsiz veriler kullanılır
- Görseller Wikipedia Commons'tan gelir

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Email**: [wupaniyazilim@gmail.com](mailto:wupaniyazilim@gmail.com)
- **GitHub**: [@wupaniyazilim](https://github.com/wupaniyazilim)

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 🙏 Teşekkürler

- [Wikipedia](https://www.wikipedia.org/) - Tarihi veri kaynağı için
- [Expo](https://expo.dev/) - Harika geliştirme platformu için
- [Lucide](https://lucide.dev/) - Güzel ikonlar için

---

**Hayatın Güncesi** ile tarihin derinliklerini keşfedin! 🚀 