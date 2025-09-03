# 🚀 GitHub Pages Kurulum Talimatları

## 📋 Adım Adım GitHub Pages Kurulumu

### 1. 🐙 GitHub Repository Oluşturma

1. **GitHub'a gidin:** https://github.com
2. **Yeni repository oluşturun:**
   - Repository name: `hayatin-guncesi`
   - Description: `🗓️ Hayatın Güncesi - Historical events app with Time Machine feature`
   - ✅ Public (GitHub Pages için gerekli)
   - ❌ Initialize with README (zaten var)

### 2. 📤 Kodu GitHub'a Yükleme

Terminal'de şu komutları çalıştırın:

```bash
# Remote repository ekleyin
git remote add origin https://github.com/Wupani/hayatin-guncesi.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# Kodu GitHub'a push edin
git push -u origin main
```

### 3. 🌐 GitHub Pages Aktifleştirme

1. **Repository Settings'e gidin:**
   - Repository sayfasında "Settings" tab'ına tıklayın

2. **Pages bölümünü bulun:**
   - Sol menüden "Pages" seçeneğini tıklayın

3. **Source ayarlarını yapın:**
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

4. **Save butonuna tıklayın**

### 4. 🔗 Gizlilik Politikası URL'si

GitHub Pages aktif olduktan sonra (2-3 dakika sürebilir):

```
https://wupani.github.io/hayatin-guncesi/privacy-policy.html
```

Bu URL'yi Google Play Console'da kullanabilirsiniz!

## 📱 Google Play Console'da Kullanım

### Privacy Policy URL'si:
```
https://wupani.github.io/hayatin-guncesi/privacy-policy.html
```

### Dil Seçenekleri:
- 🇹🇷 Türkçe: `#tr` (varsayılan)
- 🇺🇸 İngilizce: `#en`
- 🇩🇪 Almanca: `#de`
- 🇫🇷 Fransızca: `#fr`

### Örnek URL'ler:
```
https://wupani.github.io/hayatin-guncesi/privacy-policy.html#tr
https://wupani.github.io/hayatin-guncesi/privacy-policy.html#en
https://wupani.github.io/hayatin-guncesi/privacy-policy.html#de
https://wupani.github.io/hayatin-guncesi/privacy-policy.html#fr
```

## ✅ Kontrol Listesi

- [ ] GitHub repository oluşturuldu
- [ ] Kod GitHub'a yüklendi
- [ ] GitHub Pages aktifleştirildi
- [ ] Privacy policy URL'si test edildi
- [ ] Dil değiştirme çalışıyor
- [ ] Mobile responsive tasarım kontrol edildi

## 🔧 Sorun Giderme

### GitHub Pages çalışmıyor:
1. Repository'nin public olduğundan emin olun
2. Settings > Pages'de doğru branch seçildiğini kontrol edin
3. 5-10 dakika bekleyin (ilk deployment zaman alabilir)

### 404 Hatası:
1. Dosya adının doğru olduğunu kontrol edin: `privacy-policy.html`
2. URL'nin doğru olduğunu kontrol edin
3. Browser cache'ini temizleyin

### Dil değiştirme çalışmıyor:
1. JavaScript'in aktif olduğundan emin olun
2. URL hash'ini kontrol edin (#tr, #en, #de, #fr)

## 📞 Destek

Sorun yaşarsanız:
- GitHub Issues: Repository'nizde issue açın
- GitHub Docs: https://docs.github.com/en/pages

---

**Not:** Repository URL'si artık https://github.com/Wupani/hayatin-guncesi olarak güncellenmiştir. 