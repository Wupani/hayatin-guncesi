import React, { useState, useCallback, memo, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { 
  Calendar, 
  UserPlus, 
  UserMinus, 
  Gift, 
  Star
} from 'lucide-react-native';
import { WikiEvent, formatEventText, getEventImage } from '../services/wikiService';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

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

  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
  const typeColor = getTypeColor();
  const TypeIcon = getTypeIcon();

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
            source={{ uri: imageUrl }} 
            style={styles.image}
            onError={handleImageError}
            resizeMode="cover"
            loadingIndicatorSource={{ uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }}
          />
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.year}>{event.year}</Text>
        <Text style={styles.text} numberOfLines={3}>{event.text}</Text>
        
        {event.pages && event.pages.length > 0 && event.pages[0].description && (
          <Text style={styles.description} numberOfLines={2}>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    minHeight: 180,
    maxHeight: 220,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
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