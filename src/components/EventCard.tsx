import React, { useState, useCallback, memo, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { 
  Calendar, 
  UserPlus, 
  UserMinus, 
  Gift, 
  Star
} from 'lucide-react-native';
import { WikiEvent, formatEventText, getEventImage } from '../services/wikiService';
import { 
  isTablet, 
  getAndroidOptimizedShadow, 
  getCachedStyles, 
  getOptimizedImageProps,
  getOptimizedTextProps 
} from '../utils/performanceUtils';

interface EventCardProps {
  event: WikiEvent;
  type: 'event' | 'birth' | 'death' | 'holiday' | 'selected';
  isDarkMode?: boolean;
  onPress?: (event: WikiEvent) => void;
}

const EventCard: React.FC<EventCardProps> = memo(({ event, type, isDarkMode = false, onPress }) => {
  const [imageError, setImageError] = useState(false);
  
  // Memoize expensive calculations
  const eventText = useMemo(() => formatEventText(event), [event]);
  const imageUrl = useMemo(() => getEventImage(event), [event]);

  const handleCardPress = useCallback(() => {
    if (onPress) {
      onPress(event);
    }
  }, [event, onPress]);

  const getTypeIcon = useCallback(() => {
    switch (type) {
      case 'birth':
        return UserPlus;
      case 'death':
        return UserMinus;
      case 'holiday':
        return Gift;
      case 'selected':
        return Star;
      default:
        return Calendar;
    }
  }, [type]);

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



  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Use cached styles for better performance
  const styles = useMemo(() => 
    getCachedStyles(`eventCard-${isDarkMode}`, () => getStyles(isDarkMode)), 
    [isDarkMode]
  );
  
  const typeColor = useMemo(() => getTypeColor(), [type]);
  const TypeIcon = useMemo(() => getTypeIcon(), [type]);
  const optimizedTextProps = useMemo(() => getOptimizedTextProps(), []);

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: typeColor }]}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TypeIcon
            size={isTablet ? 24 : 20}
            color={typeColor}
          />
        </View>
      </View>
      
      {imageUrl && !imageError && (
        <View style={styles.imageContainer}>
          <Image 
            {...getOptimizedImageProps(imageUrl)}
            style={styles.image}
            resizeMode="contain"
            onError={handleImageError}
            loadingIndicatorSource={{ uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }}
          />
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.year} {...optimizedTextProps}>{event.year}</Text>
        <Text style={styles.text} numberOfLines={3} {...optimizedTextProps}>{event.text}</Text>
        
        {event.pages && event.pages.length > 0 && event.pages[0].description && (
          <Text style={styles.description} numberOfLines={2} {...optimizedTextProps}>
            {event.pages[0].description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

EventCard.displayName = 'EventCard';

const getStyles = (isDarkMode: boolean) => {
  // Responsive values
  const cardPadding = isTablet ? 20 : 16;
  const cardMargin = isTablet ? 20 : 16;
  const fontSize = {
    year: isTablet ? 22 : 18,
    text: isTablet ? 18 : 16,
    description: isTablet ? 16 : 14,
  };
  const iconSize = isTablet ? 24 : 20;
  const iconContainerSize = isTablet ? 44 : 36;

  return StyleSheet.create({
  card: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: isTablet ? 16 : 12,
    marginHorizontal: cardMargin,
    marginVertical: isTablet ? 12 : 8,
    padding: cardPadding,
    ...getAndroidOptimizedShadow(5),
    borderLeftWidth: isTablet ? 6 : 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  iconContainer: {
    width: iconContainerSize,
    height: iconContainerSize,
    borderRadius: iconContainerSize / 2,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    width: '100%',
    minHeight: isTablet ? 220 : 200,
    maxHeight: isTablet ? 280 : 250,
    borderRadius: isTablet ? 12 : 10,
    marginBottom: isTablet ? 16 : 12,
    backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    overflow: 'hidden',
    ...getAndroidOptimizedShadow(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  year: {
    fontSize: fontSize.year,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: isTablet ? 6 : 4,
  },
  text: {
    fontSize: fontSize.text,
    color: isDarkMode ? '#CCCCCC' : '#444',
    lineHeight: isTablet ? 26 : 22,
    marginBottom: isTablet ? 12 : 8,
  },
  description: {
    fontSize: fontSize.description,
    color: isDarkMode ? '#AAAAAA' : '#666',
    lineHeight: isTablet ? 24 : 20,
    fontStyle: 'italic',
  },
  });
};

export default EventCard; 