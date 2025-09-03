import React, { useCallback, memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WikiEvent, formatEventText } from '../services/wikiService';
import { 
  isTablet, 
  getAndroidOptimizedShadow, 
  getCachedStyles, 
  getOptimizedTextProps
} from '../utils/performanceUtils';

interface EventCardProps {
  event: WikiEvent;
  type: 'event' | 'birth' | 'death' | 'holiday' | 'selected';
  isDarkMode?: boolean;
  isListView?: boolean;
  onPress?: (event: WikiEvent) => void;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = memo(({ event, type, isDarkMode = false, isListView = false, onPress, index }) => {
  // Memoize expensive calculations
  const eventText = useMemo(() => formatEventText(event), [event]);

  const handleCardPress = useCallback(() => {
    if (onPress) {
      onPress(event);
    }
  }, [event, onPress]);

  const getTypeColor = useCallback(() => {
    switch (type) {
      case 'birth':
        return '#81C784';
      case 'death':
        return '#F06292';
      case 'holiday':
        return '#FF9800';
      case 'selected':
        return '#9C27B0';
      default:
        return '#64B5F6';
    }
  }, [type]);

  // Use cached styles for better performance
  const styles = useMemo(() => 
    getCachedStyles(`eventCard-${isDarkMode}-${isListView}`, () => getStyles(isDarkMode, isListView)), 
    [isDarkMode, isListView]
  );
  
  const typeColor = useMemo(() => getTypeColor(), [type]);
  const optimizedTextProps = useMemo(() => getOptimizedTextProps(), []);
  
  // Liste numarası (1'den başlayarak)
  const displayNumber = (index !== undefined) ? index + 1 : 1;

  if (isListView) {
    // Kompakt liste görünümü
    return (
      <TouchableOpacity 
        style={[styles.listCard, { borderLeftColor: typeColor }]}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        <View style={styles.listContent}>
          <View style={[styles.listNumberContainer, { backgroundColor: typeColor }]}>
            <Text style={styles.listNumber}>{displayNumber}</Text>
          </View>
          <View style={styles.listTextContainer}>
            <View style={styles.listHeader}>
              {event.year && (
                <Text style={styles.listYear}>{event.year}</Text>
              )}
              <Text style={styles.listText} numberOfLines={1} ellipsizeMode="tail">
                {eventText}
              </Text>
            </View>
            {event.pages && event.pages.length > 0 && event.pages[0].description && (
              <Text style={styles.listDescription} numberOfLines={1} ellipsizeMode="tail">
                {event.pages[0].description}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Normal kart görünümü
  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: typeColor }]}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.numberContainer, { backgroundColor: typeColor }]}>
            <Text style={styles.number}>{displayNumber}</Text>
          </View>
          {event.year && (
            <Text 
              style={styles.year} 
              {...optimizedTextProps}
              maxFontSizeMultiplier={1.2}
            >
              {event.year}
            </Text>
          )}
        </View>
        
        <Text 
          style={styles.text} 
          numberOfLines={2} 
          {...optimizedTextProps}
          maxFontSizeMultiplier={1.2}
          ellipsizeMode="tail"
        >
          {eventText}
        </Text>
        
        {event.pages && event.pages.length > 0 && event.pages[0].description && (
          <Text 
            style={styles.description} 
            numberOfLines={1} 
            {...optimizedTextProps}
            maxFontSizeMultiplier={1.2}
            ellipsizeMode="tail"
          >
            {event.pages[0].description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

EventCard.displayName = 'EventCard';

const getStyles = (isDarkMode: boolean, isListView: boolean) => {
  // Responsive values
  const cardPadding = isTablet ? 16 : 12;
  const cardMargin = isTablet ? 16 : 12;
  const fontSize = {
    year: isTablet ? 18 : 16,
    text: isTablet ? 16 : 14,
    description: isTablet ? 14 : 12,
  };
  const iconContainerSize = isTablet ? 36 : 32;

  return StyleSheet.create({
    // Normal kart stilleri
    card: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: isTablet ? 12 : 10,
      marginHorizontal: cardMargin,
      marginVertical: isTablet ? 8 : 6,
      padding: cardPadding,
      ...getAndroidOptimizedShadow(2),
      borderLeftWidth: isTablet ? 4 : 3,
      minHeight: isTablet ? 80 : 70,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isTablet ? 8 : 6,
    },
    numberContainer: {
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: iconContainerSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isTablet ? 12 : 10,
    },
    number: {
      fontSize: isTablet ? 16 : 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    year: {
      fontSize: fontSize.year,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#333',
      flex: 1,
    },
    text: {
      fontSize: fontSize.text,
      color: isDarkMode ? '#CCCCCC' : '#444',
      lineHeight: isTablet ? 22 : 20,
      marginBottom: isTablet ? 6 : 4,
    },
    description: {
      fontSize: fontSize.description,
      color: isDarkMode ? '#AAAAAA' : '#666',
      lineHeight: isTablet ? 18 : 16,
      fontStyle: 'italic',
    },

    // Liste görünümü stilleri
    listCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: isTablet ? 8 : 6,
      marginHorizontal: cardMargin,
      marginVertical: isTablet ? 4 : 3,
      padding: isTablet ? 12 : 10,
      ...getAndroidOptimizedShadow(1),
      borderLeftWidth: isTablet ? 3 : 2,
      minHeight: isTablet ? 60 : 50,
    },
    listContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    listNumberContainer: {
      width: isTablet ? 28 : 24,
      height: isTablet ? 28 : 24,
      borderRadius: isTablet ? 14 : 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isTablet ? 12 : 10,
      flexShrink: 0,
    },
    listNumber: {
      fontSize: isTablet ? 12 : 11,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    listTextContainer: {
      flex: 1,
    },
    listHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isTablet ? 4 : 2,
    },
    listYear: {
      fontSize: isTablet ? 14 : 12,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#333',
      marginRight: isTablet ? 8 : 6,
      minWidth: isTablet ? 40 : 35,
    },
    listText: {
      fontSize: isTablet ? 14 : 13,
      color: isDarkMode ? '#CCCCCC' : '#444',
      flex: 1,
      lineHeight: isTablet ? 18 : 16,
    },
    listDescription: {
      fontSize: isTablet ? 12 : 11,
      color: isDarkMode ? '#AAAAAA' : '#666',
      lineHeight: isTablet ? 16 : 14,
      fontStyle: 'italic',
    },
  });
};

export default EventCard; 