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

export const fetchHistoricalEvents = async (month: number, day: number): Promise<WikiResponse> => {
  try {
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    
    // Önce Türkçe Wikipedia'dan deneyelim
    try {
      const turkishResponse = await axios.get(
        `https://tr.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`,
        {
          headers: {
            'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
          },
        }
      );
      
      const cleanedTurkishData = cleanApiResponse(turkishResponse.data);
      
      // Türkçe veri varsa ve temizlendikten sonra içerik varsa onu döndür
      if (cleanedTurkishData && (
        cleanedTurkishData.events.length > 0 ||
        cleanedTurkishData.births.length > 0 ||
        cleanedTurkishData.deaths.length > 0 ||
        cleanedTurkishData.holidays.length > 0 ||
        cleanedTurkishData.selected.length > 0
      )) {
        return cleanedTurkishData;
      }
    } catch (turkishError) {
      console.log('Türkçe Wikipedia\'dan veri alınamadı, İngilizce deneniyor...');
    }
    
    // Türkçe veri yoksa veya hata varsa İngilizce Wikipedia'dan al
    const englishResponse = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${formattedMonth}/${formattedDay}`,
      {
        headers: {
          'User-Agent': 'HayatinGuncesi/1.0 (https://example.com/contact)',
        },
      }
    );

    return cleanApiResponse(englishResponse.data);
  } catch (error) {
    console.error('Wikipedia API hatası:', error);
    throw new Error('Tarihi olaylar yüklenemedi');
  }
};

export const formatEventText = (event: WikiEvent): string => {
  return `${event.year} - ${event.text}`;
};

export const getEventImage = (event: WikiEvent): string | null => {
  if (event.pages && event.pages.length > 0 && event.pages[0].thumbnail) {
    return event.pages[0].thumbnail.source;
  }
  return null;
}; 