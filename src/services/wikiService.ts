import axios from 'axios';

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

export const fetchHistoricalEvents = async (month: number, day: number, language: string = 'tr'): Promise<WikiResponse> => {
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
    
    // Daha az tarih kontrol edelim - hız için optimize edildi
    const datesToCheck = [];
    
    // Ana tarihi ekle
    datesToCheck.push({ month, day });
    
    // Sadece 1 gün öncesi ve sonrası
    for (let offset = -1; offset <= 1; offset++) {
      if (offset === 0) continue; // Ana tarih zaten eklendi
      
      const newDate = new Date(2024, month - 1, day + offset);
      datesToCheck.push({
        month: newDate.getMonth() + 1,
        day: newDate.getDate()
      });
    }
    
    // Sadece ayın ortasını ekle (eğer ana tarih değilse)
    if (day !== 15) {
      datesToCheck.push({ month, day: 15 });
    }
    
    let allEvents: WikiEvent[] = [];
    let allBirths: WikiEvent[] = [];
    let allDeaths: WikiEvent[] = [];
    let allHolidays: WikiEvent[] = [];
    let allSelected: WikiEvent[] = [];
    
    // Paralel API çağrıları için promise'ları topla
    const apiPromises = datesToCheck.map(async (dateToCheck) => {
      const formattedMonth = dateToCheck.month.toString().padStart(2, '0');
      const formattedDay = dateToCheck.day.toString().padStart(2, '0');
      
      try {
        const response = await axios.get(
          `https://${wikiLang}.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`,
          {
            headers: {
              'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
            },
            timeout: 2000, // 2 saniye timeout - daha hızlı
          }
        );
        
        const data = response.data;
        
        return {
          events: data.events || [],
          births: data.births || [],
          deaths: data.deaths || [],
          holidays: data.holidays || [],
          selected: data.selected || [],
        };
        
      } catch (dateError) {
        console.log(`${formattedMonth}/${formattedDay} tarihi için veri alınamadı`);
        return {
          events: [],
          births: [],
          deaths: [],
          holidays: [],
          selected: [],
        };
      }
    });
    
    // Tüm API çağrılarını paralel olarak bekle
    const results = await Promise.all(apiPromises);
    
    // Sonuçları birleştir
    results.forEach(result => {
      allEvents.push(...result.events);
      allBirths.push(...result.births);
      allDeaths.push(...result.deaths);
      allHolidays.push(...result.holidays);
      allSelected.push(...result.selected);
    });
    
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
    
    // Eğer yeterli veri yoksa İngilizce'den de dene (sadece ana tarih için)
    const totalEvents = cleanedData.events.length + cleanedData.births.length + 
                       cleanedData.deaths.length + cleanedData.holidays.length + 
                       cleanedData.selected.length;
    
    if (totalEvents < 10 && wikiLang !== 'en') {
      console.log(`${wikiLang} dilinde yeterli veri yok (${totalEvents} olay), İngilizce'den ana tarih aranıyor...`);
      
      // Sadece ana tarih için İngilizce Wikipedia'dan veri al
      const formattedMonth = month.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      
      try {
        const englishResponse = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`,
          {
            headers: {
              'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
            },
            timeout: 2000, // 2 saniye timeout
          }
        );

        const data = englishResponse.data;
        
        if (data.events) allEvents.push(...data.events);
        if (data.births) allBirths.push(...data.births);
        if (data.deaths) allDeaths.push(...data.deaths);
        if (data.holidays) allHolidays.push(...data.holidays);
        if (data.selected) allSelected.push(...data.selected);
        
      } catch (fallbackError) {
        console.log(`İngilizce ${formattedMonth}/${formattedDay} tarihi için veri alınamadı`);
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
  return `${event.year} - ${event.text}`;
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
    
    // Hız için optimize edilmiş tarih listesi - 18 stratejik tarih
    const importantDates: { month: number; day: number }[] = [
      // En önemli tarihi günler - daha az ama etkili
      { month: 1, day: 1 },   // Yılbaşı
      { month: 2, day: 14 },  // Sevgililer günü
      { month: 3, day: 21 },  // İlkbahar
      { month: 4, day: 23 },  // Ulusal egemenlik
      { month: 5, day: 1 },   // İşçi bayramı
      { month: 5, day: 19 },  // Atatürk'ü anma
      { month: 6, day: 21 },  // Yaz başlangıcı
      { month: 7, day: 4 },   // Bağımsızlık günü
      { month: 8, day: 30 },  // Zafer bayramı
      { month: 9, day: 11 },  // 11 Eylül
      { month: 9, day: 21 },  // Sonbahar
      { month: 10, day: 12 }, // Kolomb günü
      { month: 10, day: 29 }, // Cumhuriyet bayramı
      { month: 11, day: 9 },  // Berlin duvarı
      { month: 11, day: 10 }, // Atatürk'ün ölümü
      { month: 11, day: 22 }, // Kennedy suikastı
      { month: 12, day: 7 },  // Pearl Harbor
      { month: 12, day: 25 }, // Noel
    ];
    
    let allEvents: WikiEvent[] = [];
    let allBirths: WikiEvent[] = [];
    let allDeaths: WikiEvent[] = [];
    let allHolidays: WikiEvent[] = [];
    let allSelected: WikiEvent[] = [];
    
    // Paralel API çağrıları için promise'ları topla
    const apiPromises = importantDates.map(async (date) => {
      try {
        const formattedMonth = date.month.toString().padStart(2, '0');
        const formattedDay = date.day.toString().padStart(2, '0');
        
        const response = await axios.get(
          `https://${wikiLang}.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`,
          {
            headers: {
              'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
            },
            timeout: 2000, // 2 saniye timeout - hızlı yükleme
          }
        );
        
        const data = response.data;
        
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
    
    // Tüm API çağrılarını paralel olarak bekle
    const results = await Promise.all(apiPromises);
    
    // Sonuçları birleştir
    results.forEach(result => {
      allEvents.push(...result.events);
      allBirths.push(...result.births);
      allDeaths.push(...result.deaths);
      allHolidays.push(...result.holidays);
      allSelected.push(...result.selected);
    });
    
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
    
    if (totalEvents < 15 && wikiLang !== 'en') {
      console.log(`${wikiLang} dilinde ${year} yılı için yeterli veri yok (${totalEvents} olay), İngilizce'den de aranıyor...`);
      
      // Sadece en önemli 8 tarih için İngilizce'den veri al - hız için
      const criticalDates = [
        { month: 1, day: 1 },   // Yılbaşı
        { month: 4, day: 23 },  // Ulusal egemenlik
        { month: 5, day: 19 },  // Atatürk'ü anma
        { month: 8, day: 30 },  // Zafer bayramı
        { month: 9, day: 11 },  // 11 Eylül
        { month: 10, day: 29 }, // Cumhuriyet bayramı
        { month: 11, day: 10 }, // Atatürk'ün ölümü
        { month: 12, day: 7 },  // Pearl Harbor
      ];
      
      const englishPromises = criticalDates.map(async (date) => {
        try {
          const formattedMonth = date.month.toString().padStart(2, '0');
          const formattedDay = date.day.toString().padStart(2, '0');
          
          const response = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`,
            {
              headers: {
                'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
              },
              timeout: 2000, // 2 saniye timeout
            }
          );
          
          const data = response.data;
          
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
      
      console.log(`${year} yılı için toplam ${finalTotal} olay bulundu (${wikiLang} + İngilizce)`);
      return finalData;
    }
    
    return cleanedData;
    
  } catch (error) {
    console.error('Wikipedia API hatası (yıl bazlı):', error);
    return {
      events: [],
      births: [],
      deaths: [],
      holidays: [],
      selected: []
    };
  }
};

export const getEventImage = (event: WikiEvent): string | null => {
  if (event.pages && event.pages.length > 0 && event.pages[0].thumbnail) {
    return event.pages[0].thumbnail.source;
  }
  return null;
}; 