import axios from 'axios';

// Network warmup - çoklu server bağlantısını önceden hazırla
const warmupNetwork = async () => {
  const warmupUrls = [
    'https://tr.wikipedia.org/api/rest_v1/feed/onthisday/all/01/01',
    'https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/01/01',
  ];
  
  // Paralel warmup
  const promises = warmupUrls.map(async (url) => {
    try {
      await axios.head(url, {
        timeout: 800,
        headers: {
          'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
          'Accept': 'application/json',
        }
      });
      console.log(`Warmup başarılı: ${url.includes('tr.') ? 'TR' : 'EN'}`);
    } catch (error) {
      // Hata önemli değil
      console.log(`Warmup tamamlandı: ${url.includes('tr.') ? 'TR' : 'EN'}`);
    }
  });
  
  await Promise.all(promises);
  console.log('Network warmup tamamlandı - tüm serverlar hazır');
};

// Uygulama başladığında network'ü hazırla
warmupNetwork();

export interface WikiEvent {
  text: string;
  year: number;
  pages: {
    title: string;
    description?: string;
    extract?: string;
    thumbnail?: {
      source: string;
      width: number;
      height: number;
    };
  }[];
}

export interface WikiResponse {
  events: WikiEvent[];
  births: WikiEvent[];
  deaths: WikiEvent[];
  holidays: WikiEvent[];
  selected: WikiEvent[];
}

// Veriyi temizleme ve filtreleme fonksiyonu
const cleanAndFilterEvents = (events: WikiEvent[]): WikiEvent[] => {
  if (!events || !Array.isArray(events)) return [];
  
  return events.filter(event => {
    // Text alanı var mı ve en az 10 karakter mi kontrol et
    if (!event.text || typeof event.text !== 'string' || event.text.trim().length < 10) {
      return false;
    }
    
    // Sadece tek karakter veya çok kısa metinleri filtrele
    const cleanText = event.text.trim();
    if (cleanText.length <= 3 || /^[a-zA-Z]$/.test(cleanText)) {
      return false;
    }
    
    return true;
  });
};

// API yanıtını temizleme fonksiyonu
const cleanApiResponse = (data: any): WikiResponse => {
  return {
    events: cleanAndFilterEvents(data.events || []),
    births: cleanAndFilterEvents(data.births || []),
    deaths: cleanAndFilterEvents(data.deaths || []),
    holidays: cleanAndFilterEvents(data.holidays || []),
    selected: cleanAndFilterEvents(data.selected || []),
  };
};

export const fetchHistoricalEvents = async (month: number, day: number, language: string = 'tr', onRetry?: (attempt: number) => void): Promise<WikiResponse> => {
  try {
    // Dil kodunu Wikipedia dil koduna çevir
    const getWikipediaLanguageCode = (lang: string): string => {
      switch (lang) {
        case 'tr': return 'tr';
        case 'en': return 'en';
        case 'de': return 'de';
        case 'fr': return 'fr';
        default: return 'en';
      }
    };
    
    const wikiLang = getWikipediaLanguageCode(language);
    
    // Ana tarihi önce dene - daha güvenilir sonuçlar için
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    
    // Güçlü retry mekanizması ile API çağrısı
    const makeApiCall = async (url: string, retries: number = 3): Promise<any> => {
      const timeouts = [1500, 2500, 4000]; // Artan timeout süresi
      
      for (let i = 0; i <= retries; i++) {
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
            },
            timeout: timeouts[i] || 4000,
            // Axios retry config
            validateStatus: function (status) {
              return status >= 200 && status < 300;
            },
          });
          
          if (response.data) {
            console.log(`API başarılı (${i + 1}. deneme): ${response.data.events?.length || 0} event`);
            return response.data;
          }
          throw new Error('Boş response');
          
        } catch (error: any) {
          const errorMsg = error?.message || 'Bilinmeyen hata';
          console.log(`API hatası (${i + 1}. deneme): ${errorMsg}`);
          
          // Retry callback'ini çağır
          if (onRetry && i < retries) {
            onRetry(i + 1);
          }
          
          if (i === retries) {
            console.log(`Tüm denemeler başarısız: ${errorMsg}`);
            throw error;
          }
          
          // Progressive backoff - her denemede biraz daha bekle
          const delay = Math.min(300 * (i + 1), 1000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };
    
    let allEvents: WikiEvent[] = [];
    let allBirths: WikiEvent[] = [];
    let allDeaths: WikiEvent[] = [];
    let allHolidays: WikiEvent[] = [];
    let allSelected: WikiEvent[] = [];
    
    // Güçlü strategi: Ana dil + fallback dilleri
    const fallbackLanguages = wikiLang === 'en' ? ['en'] : [wikiLang, 'en'];
    let dataFetched = false;
    
    for (const langCode of fallbackLanguages) {
      if (dataFetched) break;
      
      try {
        console.log(`${langCode.toUpperCase()} - Ana tarih aranıyor: ${formattedMonth}/${formattedDay}`);
        const mainData = await makeApiCall(
          `https://${langCode}.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`
        );
        
        if (mainData.events) allEvents.push(...mainData.events);
        if (mainData.births) allBirths.push(...mainData.births);
        if (mainData.deaths) allDeaths.push(...mainData.deaths);
        if (mainData.holidays) allHolidays.push(...mainData.holidays);
        if (mainData.selected) allSelected.push(...mainData.selected);
        
        const totalFound = (mainData.events?.length || 0) + (mainData.births?.length || 0) + (mainData.deaths?.length || 0) + (mainData.holidays?.length || 0) + (mainData.selected?.length || 0);
        console.log(`${langCode.toUpperCase()} - Ana tarih sonuçları: ${totalFound} olay`);
        
        if (totalFound > 0) {
          dataFetched = true;
          console.log(`${langCode.toUpperCase()} dilinde başarılı!`);
        }
        
      } catch (mainError: any) {
        console.log(`${langCode.toUpperCase()} - Ana tarih ${formattedMonth}/${formattedDay} için veri alınamadı:`, mainError?.message);
        // Devam et, diğer dili dene
      }
    }
    
    // Ek tarih stratejisi - veri yetersizse fallback tarihler dene
    const mainTotal = allEvents.length + allBirths.length + allDeaths.length + allHolidays.length + allSelected.length;
    
    if (mainTotal < 5) {
      console.log(`Ana tarihten az veri (${mainTotal}), ek tarihler deneniyor...`);
      
      // Çoklu fallback tarihler
      const fallbackDates = [
        { month, day: day + 1 },    // 1 gün sonra
        { month, day: day - 1 },    // 1 gün önce
        { month: month === 12 ? 1 : month + 1, day }, // 1 ay sonra aynı gün
      ];
      
      for (const dateToTry of fallbackDates) {
        if (mainTotal >= 5) break; // Yeterli veri bulundu
        
        const adjustedDate = new Date(2024, dateToTry.month - 1, dateToTry.day);
        const fMonth = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
        const fDay = adjustedDate.getDate().toString().padStart(2, '0');
        
        // En güçlü dil ile dene (İngilizce öncelikli)
        const fallbackLang = wikiLang === 'en' ? 'en' : 'en';
        
        try {
          console.log(`Ek tarih deneniyor: ${fMonth}/${fDay} (${fallbackLang})`);
          const additionalData = await makeApiCall(
            `https://${fallbackLang}.wikipedia.org/api/rest_v1/feed/onthisday/all/${fMonth}/${fDay}`
          );
          
          if (additionalData.events) allEvents.push(...additionalData.events);
          if (additionalData.births) allBirths.push(...additionalData.births);
          if (additionalData.deaths) allDeaths.push(...additionalData.deaths);
          if (additionalData.holidays) allHolidays.push(...additionalData.holidays);
          if (additionalData.selected) allSelected.push(...additionalData.selected);
          
          const additionalTotal = (additionalData.events?.length || 0) + (additionalData.births?.length || 0) + (additionalData.deaths?.length || 0) + (additionalData.holidays?.length || 0) + (additionalData.selected?.length || 0);
          if (additionalTotal > 0) {
            console.log(`Ek tarih ${fMonth}/${fDay} başarılı: ${additionalTotal} olay`);
          }
          
        } catch (error: any) {
          console.log(`Ek tarih ${fMonth}/${fDay} başarısız: ${error?.message}`);
        }
      }
    }
    
    // Tekrarlanan olayları kaldır
    const removeDuplicates = (events: WikiEvent[]): WikiEvent[] => {
      const seen = new Set();
      return events.filter(event => {
        const key = event.text.trim().toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    };
    
    const cleanedData = {
      events: cleanAndFilterEvents(removeDuplicates(allEvents)),
      births: cleanAndFilterEvents(removeDuplicates(allBirths)),
      deaths: cleanAndFilterEvents(removeDuplicates(allDeaths)),
      holidays: cleanAndFilterEvents(removeDuplicates(allHolidays)),
      selected: cleanAndFilterEvents(removeDuplicates(allSelected)),
    };
    
    // Eğer hala yeterli veri yoksa İngilizce'den de dene
    const totalEvents = cleanedData.events.length + cleanedData.births.length + 
                       cleanedData.deaths.length + cleanedData.holidays.length + 
                       cleanedData.selected.length;
    
    if (totalEvents < 3 && wikiLang !== 'en') {
      console.log(`${wikiLang} dilinde çok az veri (${totalEvents} olay), İngilizce'den ana tarih aranıyor...`);
      
      try {
        const englishData = await makeApiCall(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`
        );
        
        if (englishData.events) allEvents.push(...englishData.events);
        if (englishData.births) allBirths.push(...englishData.births);
        if (englishData.deaths) allDeaths.push(...englishData.deaths);
        if (englishData.holidays) allHolidays.push(...englishData.holidays);
        if (englishData.selected) allSelected.push(...englishData.selected);
        
        console.log(`İngilizce'den ek veri: ${(englishData.events?.length || 0) + (englishData.births?.length || 0) + (englishData.deaths?.length || 0) + (englishData.holidays?.length || 0) + (englishData.selected?.length || 0)} olay`);
        
      } catch (fallbackError) {
        console.log(`İngilizce ${formattedMonth}/${formattedDay} tarihi için veri alınamadı:`, (fallbackError as any).message);
      }
      
      // Tüm verileri tekrar temizle ve birleştir
      const finalData = {
        events: cleanAndFilterEvents(removeDuplicates(allEvents)),
        births: cleanAndFilterEvents(removeDuplicates(allBirths)),
        deaths: cleanAndFilterEvents(removeDuplicates(allDeaths)),
        holidays: cleanAndFilterEvents(removeDuplicates(allHolidays)),
        selected: cleanAndFilterEvents(removeDuplicates(allSelected)),
      };
      
      const finalTotal = finalData.events.length + finalData.births.length + 
                        finalData.deaths.length + finalData.holidays.length + 
                        finalData.selected.length;
      
      console.log(`${wikiLang} + İngilizce toplam: ${finalTotal} olay`);
      return finalData;
    }
    
    const finalTotal = cleanedData.events.length + cleanedData.births.length + 
                      cleanedData.deaths.length + cleanedData.holidays.length + 
                      cleanedData.selected.length;
    
    console.log(`${wikiLang} dilinde toplam: ${finalTotal} olay`);
    return cleanedData;
    
  } catch (error) {
    console.error('Tarihi olaylar alınırken hata:', error);
    throw error;
  }
};

export const formatEventText = (event: WikiEvent): string => {
  return event.text;
};

export const fetchHistoricalEventsByYear = async (year: number, language: string = 'tr'): Promise<WikiResponse> => {
  try {
    // Dil kodunu Wikipedia dil koduna çevir
    const getWikipediaLanguageCode = (lang: string): string => {
      switch (lang) {
        case 'tr': return 'tr';
        case 'en': return 'en';
        case 'de': return 'de';
        case 'fr': return 'fr';
        default: return 'en';
      }
    };
    
    const wikiLang = getWikipediaLanguageCode(language);
    
    // Retry mekanizması ile API çağrısı
    const makeApiCall = async (url: string, retries: number = 2): Promise<any> => {
      for (let i = 0; i <= retries; i++) {
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
            },
            timeout: 5000, // 5 saniye timeout - daha güvenilir
          });
          return response.data;
        } catch (error) {
          if (i === retries) throw error;
          // Kısa bir bekleme süresi
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };
    
    // Çok daha kapsamlı tarih listesi - tüm yıl boyunca önemli günler
    const importantDates: { month: number; day: number }[] = [
      // Ocak
      { month: 1, day: 1 },   // Yılbaşı
      { month: 1, day: 15 },  // Ayın ortası
      { month: 1, day: 20 },  // MLK günü
      { month: 1, day: 26 },  // Avustralya günü
      
      // Şubat
      { month: 2, day: 1 },   // Ayın başı
      { month: 2, day: 14 },  // Sevgililer günü
      { month: 2, day: 28 },  // Ayın sonu
      
      // Mart
      { month: 3, day: 1 },   // Ayın başı
      { month: 3, day: 8 },   // Kadınlar günü
      { month: 3, day: 15 },  // İdus Martiae
      { month: 3, day: 21 },  // İlkbahar ekinoksu
      { month: 3, day: 31 },  // Ayın sonu
      
      // Nisan
      { month: 4, day: 1 },   // 1 Nisan
      { month: 4, day: 14 },  // Titanic
      { month: 4, day: 22 },  // Dünya günü
      { month: 4, day: 23 },  // Ulusal egemenlik
      { month: 4, day: 30 },  // Ayın sonu
      
      // Mayıs
      { month: 5, day: 1 },   // İşçi bayramı
      { month: 5, day: 8 },   // Zafer günü (Avrupa)
      { month: 5, day: 15 },  // Ayın ortası
      { month: 5, day: 19 },  // Atatürk'ü anma
      { month: 5, day: 29 },  // İstanbul'un fethi
      
      // Haziran
      { month: 6, day: 1 },   // Çocuklar günü
      { month: 6, day: 6 },   // D-Day
      { month: 6, day: 15 },  // Magna Carta
      { month: 6, day: 21 },  // Yaz gündönümü
      { month: 6, day: 28 },  // Saraybosna suikastı
      
      // Temmuz
      { month: 7, day: 4 },   // ABD bağımsızlık
      { month: 7, day: 14 },  // Bastille günü
      { month: 7, day: 20 },  // Ay'a iniş
      { month: 7, day: 31 },  // Ayın sonu
      
      // Ağustos
      { month: 8, day: 1 },   // Ayın başı
      { month: 8, day: 6 },   // Hiroşima
      { month: 8, day: 9 },   // Nagazaki
      { month: 8, day: 15 },  // Japonya teslim
      { month: 8, day: 24 },  // Pompeii
      { month: 8, day: 30 },  // Zafer bayramı
      
      // Eylül
      { month: 9, day: 1 },   // 2. Dünya Savaşı başlangıcı
      { month: 9, day: 11 },  // 11 Eylül
      { month: 9, day: 21 },  // Sonbahar ekinoksu
      { month: 9, day: 30 },  // Ayın sonu
      
      // Ekim
      { month: 10, day: 1 },  // Çin Cumhuriyeti
      { month: 10, day: 12 }, // Kolomb günü
      { month: 10, day: 14 }, // Hastings savaşı
      { month: 10, day: 24 }, // BM günü
      { month: 10, day: 29 }, // Cumhuriyet bayramı
      { month: 10, day: 31 }, // Halloween
      
      // Kasım
      { month: 11, day: 1 },  // Ölüler günü
      { month: 11, day: 9 },  // Berlin duvarı
      { month: 11, day: 10 }, // Atatürk'ün ölümü
      { month: 11, day: 11 }, // Ateşkes günü
      { month: 11, day: 22 }, // Kennedy suikastı
      { month: 11, day: 30 }, // Ayın sonu
      
      // Aralık
      { month: 12, day: 1 },  // AIDS günü
      { month: 12, day: 7 },  // Pearl Harbor
      { month: 12, day: 10 }, // İnsan hakları
      { month: 12, day: 21 }, // Kış gündönümü
      { month: 12, day: 25 }, // Noel
      { month: 12, day: 31 }, // Yılbaşı arifesi
    ];
    
    let allEvents: WikiEvent[] = [];
    let allBirths: WikiEvent[] = [];
    let allDeaths: WikiEvent[] = [];
    let allHolidays: WikiEvent[] = [];
    let allSelected: WikiEvent[] = [];
    
    console.log(`${year} yılı için ${wikiLang} dilinde arama başlıyor...`);
    
    // API çağrılarını batch'ler halinde yap - performans için
    const batchSize = 10; // Aynı anda maksimum 10 API çağrısı
    const batches = [];
    
    for (let i = 0; i < importantDates.length; i += batchSize) {
      batches.push(importantDates.slice(i, i + batchSize));
    }
    
    // Her batch'i sırayla işle
    for (const batch of batches) {
      const batchPromises = batch.map(async (date) => {
        try {
          const formattedMonth = date.month.toString().padStart(2, '0');
          const formattedDay = date.day.toString().padStart(2, '0');
          
          const data = await makeApiCall(
            `https://${wikiLang}.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`
          );
          
          return {
            events: data.events ? data.events.filter((event: WikiEvent) => event.year === year) : [],
            births: data.births ? data.births.filter((event: WikiEvent) => event.year === year) : [],
            deaths: data.deaths ? data.deaths.filter((event: WikiEvent) => event.year === year) : [],
            holidays: data.holidays ? data.holidays.filter((event: WikiEvent) => event.year === year) : [],
            selected: data.selected ? data.selected.filter((event: WikiEvent) => event.year === year) : [],
          };
          
        } catch (dateError) {
          console.log(`${date.month}/${date.day} tarihi için veri alınamadı`);
          return {
            events: [],
            births: [],
            deaths: [],
            holidays: [],
            selected: [],
          };
        }
      });
      
      // Bu batch'in tamamlanmasını bekle
      const batchResults = await Promise.all(batchPromises);
      
      // Sonuçları birleştir
      batchResults.forEach(result => {
        allEvents.push(...result.events);
        allBirths.push(...result.births);
        allDeaths.push(...result.deaths);
        allHolidays.push(...result.holidays);
        allSelected.push(...result.selected);
      });
      
      // Batch'ler arası kısa bekleme - API rate limiting için
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Tekrarlanan olayları kaldır (text bazında)
    const removeDuplicates = (events: WikiEvent[]): WikiEvent[] => {
      const seen = new Set();
      return events.filter(event => {
        const key = event.text.trim().toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    };
    
    const cleanedData = {
      events: cleanAndFilterEvents(removeDuplicates(allEvents)),
      births: cleanAndFilterEvents(removeDuplicates(allBirths)),
      deaths: cleanAndFilterEvents(removeDuplicates(allDeaths)),
      holidays: cleanAndFilterEvents(removeDuplicates(allHolidays)),
      selected: cleanAndFilterEvents(removeDuplicates(allSelected)),
    };
    
    // Eğer seçilen dilde yeterli veri yoksa İngilizce'den de dene
    const totalEvents = cleanedData.events.length + cleanedData.births.length + 
                       cleanedData.deaths.length + cleanedData.holidays.length + 
                       cleanedData.selected.length;
    
    if (totalEvents < 20 && wikiLang !== 'en') {
      console.log(`${wikiLang} dilinde ${year} yılı için az veri (${totalEvents} olay), İngilizce'den de aranıyor...`);
      
      // Daha fazla tarih için İngilizce'den veri al - kapsamlı arama
      const criticalDates = [
        // En önemli tarihi olaylar
        { month: 1, day: 1 },   // Yılbaşı
        { month: 2, day: 14 },  // Sevgililer günü
        { month: 3, day: 15 },  // İdus Martiae
        { month: 3, day: 21 },  // İlkbahar
        { month: 4, day: 14 },  // Titanic
        { month: 4, day: 23 },  // Ulusal egemenlik
        { month: 5, day: 1 },   // İşçi bayramı
        { month: 5, day: 8 },   // Zafer günü
        { month: 5, day: 19 },  // Atatürk'ü anma
        { month: 6, day: 6 },   // D-Day
        { month: 6, day: 28 },  // Saraybosna suikastı
        { month: 7, day: 4 },   // ABD bağımsızlık
        { month: 7, day: 14 },  // Bastille günü
        { month: 7, day: 20 },  // Ay'a iniş
        { month: 8, day: 6 },   // Hiroşima
        { month: 8, day: 30 },  // Zafer bayramı
        { month: 9, day: 1 },   // 2. Dünya Savaşı
        { month: 9, day: 11 },  // 11 Eylül
        { month: 10, day: 12 }, // Kolomb günü
        { month: 10, day: 29 }, // Cumhuriyet bayramı
        { month: 11, day: 9 },  // Berlin duvarı
        { month: 11, day: 10 }, // Atatürk'ün ölümü
        { month: 11, day: 22 }, // Kennedy suikastı
        { month: 12, day: 7 },  // Pearl Harbor
        { month: 12, day: 25 }, // Noel
      ];
      
      const englishPromises = criticalDates.map(async (date) => {
        try {
          const formattedMonth = date.month.toString().padStart(2, '0');
          const formattedDay = date.day.toString().padStart(2, '0');
          
          const data = await makeApiCall(
            `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`
          );
          
          return {
            events: data.events ? data.events.filter((event: WikiEvent) => event.year === year) : [],
            births: data.births ? data.births.filter((event: WikiEvent) => event.year === year) : [],
            deaths: data.deaths ? data.deaths.filter((event: WikiEvent) => event.year === year) : [],
            holidays: data.holidays ? data.holidays.filter((event: WikiEvent) => event.year === year) : [],
            selected: data.selected ? data.selected.filter((event: WikiEvent) => event.year === year) : [],
          };
          
        } catch (error) {
          return {
            events: [],
            births: [],
            deaths: [],
            holidays: [],
            selected: [],
          };
        }
      });
      
      // Tüm İngilizce API çağrılarını paralel olarak bekle
      const englishResults = await Promise.all(englishPromises);
      
      // İngilizce sonuçları birleştir
      englishResults.forEach(result => {
        allEvents.push(...result.events);
        allBirths.push(...result.births);
        allDeaths.push(...result.deaths);
        allHolidays.push(...result.holidays);
        allSelected.push(...result.selected);
      });
      
      // Tüm verileri tekrar temizle ve birleştir
      const finalData = {
        events: cleanAndFilterEvents(removeDuplicates(allEvents)),
        births: cleanAndFilterEvents(removeDuplicates(allBirths)),
        deaths: cleanAndFilterEvents(removeDuplicates(allDeaths)),
        holidays: cleanAndFilterEvents(removeDuplicates(allHolidays)),
        selected: cleanAndFilterEvents(removeDuplicates(allSelected)),
      };
      
      const finalTotal = finalData.events.length + finalData.births.length + 
                        finalData.deaths.length + finalData.holidays.length + 
                        finalData.selected.length;
      
      console.log(`${wikiLang} + İngilizce ${year} yılı toplam: ${finalTotal} olay`);
      return finalData;
    }
    
    const finalTotal = cleanedData.events.length + cleanedData.births.length + 
                      cleanedData.deaths.length + cleanedData.holidays.length + 
                      cleanedData.selected.length;
    
    console.log(`${wikiLang} dilinde ${year} yılı toplam: ${finalTotal} olay`);
    return cleanedData;
    
  } catch (error) {
    console.error(`${year} yılı için tarihi olaylar alınırken hata:`, error);
    throw error;
  }
};

export const getEventImage = (event: WikiEvent): string | null => {
  if (event.pages && event.pages.length > 0 && event.pages[0].thumbnail) {
    return event.pages[0].thumbnail.source;
  }
  return null;
}; 