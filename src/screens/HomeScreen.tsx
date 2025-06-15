import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { 
  Calendar, 
  UserPlus, 
  UserMinus, 
  Gift, 
  Star, 
  Search, 
  Info,
  CalendarDays,
  X,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react-native';
import EventCard from '../components/EventCard';
import CategorySelector from '../components/CategorySelector';
import SettingsScreen from './SettingsScreen';
import PrivacyScreen from './PrivacyScreen';
import { fetchHistoricalEvents, WikiResponse, WikiEvent } from '../services/wikiService';


// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

const HomeScreen: React.FC = () => {
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [events, setEvents] = useState<WikiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'births' | 'deaths' | 'holidays' | 'selected'>('events');
  const [modalVisible, setModalVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<WikiEvent | null>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [categorySelectionVisible, setCategorySelectionVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [introLoading, setIntroLoading] = useState(true);

  useEffect(() => {
    // Loading süresi sonunda direkt ana ekrana geç
    const loadingTimer = setTimeout(() => {
      setIntroLoading(false);
      setShowIntro(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearch = useCallback(async () => {
    if (!birthDay || !birthMonth) {
      Alert.alert('Hata', 'Lütfen doğum tarihinizi girin (gün/ay).');
      return;
    }

    const day = parseInt(birthDay);
    const month = parseInt(birthMonth);

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      Alert.alert('Hata', 'Lütfen geçerli bir tarih girin.');
      return;
    }

    setModalVisible(false);
    setCategorySelectionVisible(true);
  }, [birthDay, birthMonth]);

  const handleCategorySelection = useCallback(async (categories: string[]) => {
    setCategorySelectionVisible(false);
    setSelectedCategories(categories);
    setLoading(true);
    setEvents(null);
    
    try {
      const day = parseInt(birthDay);
      const month = parseInt(birthMonth);
      const data = await fetchHistoricalEvents(month, day);
      // Minimum loading süresi için küçük bir gecikme
      await new Promise(resolve => setTimeout(resolve, 500)); // Reduced from 800ms
      setEvents(data);
      
      // İlk kategoriyi aktif yap
      if (categories.length > 0) {
        setActiveTab(categories[0] as 'events' | 'births' | 'deaths' | 'holidays' | 'selected');
      }
    } catch (error) {
      Alert.alert('Hata', 'Tarihi olaylar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [birthDay, birthMonth]);

  // Memoized data for each tab to prevent unnecessary recalculations
  const tabData = useMemo(() => {
    if (!events) return {
      events: [],
      births: [],
      deaths: [],
      holidays: [],
      selected: []
    };
    
    return {
      events: events.events || [],
      births: events.births || [],
      deaths: events.deaths || [],
      holidays: events.holidays || [],
      selected: events.selected || []
    };
  }, [events]);

  const getCurrentData = useCallback((): WikiEvent[] => {
    return tabData[activeTab] || [];
  }, [tabData, activeTab]);

  const getTabColor = useCallback((tab: string) => {
    switch (tab) {
      case 'births':
        return '#81C784';
      case 'deaths':
        return '#F06292';
      case 'holidays':
        return '#FF9800';
      case 'selected':
        return '#9C27B0';
      default:
        return '#64B5F6';
    }
  }, []);

  // Optimized tab change handler with immediate state update
  const handleTabChange = useCallback((tab: 'events' | 'births' | 'deaths' | 'holidays' | 'selected') => {
    setActiveTab(tab);
  }, []);

  const handleEventPress = useCallback((event: WikiEvent) => {
    setSelectedEvent(event);
    setEventModalVisible(true);
  }, []);

  // Memoized event card renderer for FlatList
  const renderEventCard = useCallback(({ item }: { item: WikiEvent }) => {
    const getEventType = (tab: string): 'event' | 'birth' | 'death' | 'holiday' | 'selected' => {
      switch (tab) {
        case 'births':
          return 'birth';
        case 'deaths':
          return 'death';
        case 'holidays':
          return 'holiday';
        case 'selected':
          return 'selected';
        default:
          return 'event';
      }
    };

    return (
      <EventCard
        event={item}
        type={getEventType(activeTab)}
        isDarkMode={isDarkMode}
        onPress={handleEventPress}
      />
    );
  }, [activeTab, isDarkMode, handleEventPress]);

  // Memoized key extractor for FlatList
  const keyExtractor = useCallback((item: WikiEvent, index: number) => 
    `${item.year}-${index}-${item.text.substring(0, 20)}`, []
  );

  // Optimized getItemLayout for better performance
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200, // Approximate item height
    offset: 200 * index,
    index,
  }), []);

  // Memoized current data to prevent unnecessary recalculations
  const currentData = useMemo(() => getCurrentData(), [getCurrentData]);

  // Responsive values for component
  const iconSizes = {
    header: isTablet ? 40 : 32,
    tab: isTablet ? 18 : 14,
    loading: isTablet ? 56 : 48,
  };

  const styles = getStyles(isDarkMode);

  // Show loading screen first
  if (showIntro && introLoading) {
          return (
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.introLoadingContent}>
            <CalendarDays size={64} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
            <Text style={styles.introLoadingTitle}>Hayatın Güncesi</Text>
            <ActivityIndicator 
              size="large" 
              color={isDarkMode ? "#FFFFFF" : "#007AFF"} 
              style={{ marginVertical: 20 }}
            />
            <Text style={styles.introLoadingText}>Hazırlanıyor...</Text>
          </View>
        </SafeAreaView>
      );
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Doğum Tarihinizi Girin</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={isDarkMode ? "#FFFFFF" : "#666"} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalInputContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Gün</Text>
                  <TextInput
                    style={styles.input}
                    value={birthDay}
                    onChangeText={setBirthDay}
                    placeholder="01"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ay</Text>
                  <TextInput
                    style={styles.input}
                    value={birthMonth}
                    onChangeText={setBirthMonth}
                    placeholder="01"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.searchButton} 
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Search size={20} color="#FFFFFF" />
                    <Text style={styles.searchButtonText}>Keşfet</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <View style={styles.loadingIconContainer}>
                <CalendarDays size={iconSizes.loading} color="#007AFF" />
              </View>
              <Text style={styles.loadingText}>Tarihi olaylar yükleniyor...</Text>
              <Text style={styles.loadingSubtext}>
                {birthDay && birthMonth ? `${birthDay}/${birthMonth}` : ''} tarihine ait bilgiler getiriliyor
              </Text>
              <View style={styles.loadingIndicatorContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            </View>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <CalendarDays size={iconSizes.header} color={isDarkMode ? "#FFFFFF" : "#333"} />
            <Text style={styles.title}>Hayatın Güncesi</Text>
          </View>
          <Text style={styles.subtitle}>Doğum tarihinizle ilişkili tarihi olayları keşfedin!</Text>
          
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setShowSettings(true)}
          >
            <Settings size={isTablet ? 24 : 20} color={isDarkMode ? "#FFFFFF" : "#666"} />
          </TouchableOpacity>
        </View>

      {birthDay && birthMonth && (
        <View style={styles.selectedDateContainer}>
          <CalendarDays size={20} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
          <Text style={styles.selectedDateText}>
            {birthDay}/{birthMonth}
          </Text>
        </View>
      )}

      {events && (
        <View style={styles.tabContainer}>
          {selectedCategories.map((category) => {
            const tabKey = category as 'events' | 'births' | 'deaths' | 'holidays' | 'selected';
            const isActive = activeTab === tabKey;
            const count = tabData[tabKey]?.length || 0;
            
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.tab,
                  isActive && { backgroundColor: getTabColor(category) }
                ]}
                onPress={() => handleTabChange(tabKey)}
                activeOpacity={0.8}
              >
                {tabKey === 'events' && (
                  <>
                    <Calendar 
                      size={iconSizes.tab} 
                      color={isActive ? '#FFFFFF' : (isDarkMode ? '#CCCCCC' : '#666')} 
                    />
                    <Text style={[
                      styles.tabText,
                      isActive && styles.activeTabText
                    ]}>
                      Olaylar{'\n'}({count})
                    </Text>
                  </>
                )}
                {tabKey === 'births' && (
                  <>
                    <UserPlus 
                      size={iconSizes.tab} 
                      color={isActive ? '#FFFFFF' : (isDarkMode ? '#CCCCCC' : '#666')} 
                    />
                    <Text style={[
                      styles.tabText,
                      isActive && styles.activeTabText
                    ]}>
                      Doğumlar{'\n'}({count})
                    </Text>
                  </>
                )}
                {tabKey === 'deaths' && (
                  <>
                    <UserMinus 
                      size={iconSizes.tab} 
                      color={isActive ? '#FFFFFF' : (isDarkMode ? '#CCCCCC' : '#666')} 
                    />
                    <Text style={[
                      styles.tabText,
                      isActive && styles.activeTabText
                    ]}>
                      Vefatlar{'\n'}({count})
                    </Text>
                  </>
                )}
                {tabKey === 'holidays' && (
                  <>
                    <Gift 
                      size={iconSizes.tab} 
                      color={isActive ? '#FFFFFF' : (isDarkMode ? '#CCCCCC' : '#666')} 
                    />
                    <Text style={[
                      styles.tabText,
                      isActive && styles.activeTabText
                    ]}>
                      Tatiller{'\n'}({count})
                    </Text>
                  </>
                )}
                {tabKey === 'selected' && (
                  <>
                    <Star 
                      size={iconSizes.tab} 
                      color={isActive ? '#FFFFFF' : (isDarkMode ? '#CCCCCC' : '#666')} 
                    />
                    <Text style={[
                      styles.tabText,
                      isActive && styles.activeTabText
                    ]}>
                      Seçilmiş{'\n'}({count})
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingModal}>
            <View style={styles.loadingIconContainer}>
              <CalendarDays size={iconSizes.loading} color="#007AFF" />
            </View>
            <Text style={styles.loadingTitle}>Tarihi Olaylar Yükleniyor</Text>
            <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 16 }} />
            <Text style={styles.loadingText}>Lütfen bekleyin...</Text>
          </View>
        </View>
      ) : events ? (
                  <FlatList
            data={currentData}
            renderItem={renderEventCard}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={8}
            initialNumToRender={4}
            getItemLayout={getItemLayout}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
              ) : (
          <View style={styles.emptyState}>
            <CalendarDays size={64} color={isDarkMode ? "#666" : "#CCC"} />
            <Text style={styles.emptyStateText}>
              Doğum tarihinizi girerek tarihi olayları keşfedin
            </Text>
          </View>
        )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
        presentationStyle="fullScreen"
      >
        <SettingsScreen 
          onBack={() => setShowSettings(false)}
          onPrivacyPress={() => {
            setShowSettings(false);
            setShowPrivacy(true);
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPrivacy}
        onRequestClose={() => setShowPrivacy(false)}
        presentationStyle="fullScreen"
      >
        <PrivacyScreen 
          onBack={() => setShowPrivacy(false)} 
          isDarkMode={isDarkMode}
        />
      </Modal>
      
      {/* Global Event Modal */}
      {selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={eventModalVisible}
          onRequestClose={() => {
            setEventModalVisible(false);
            setSelectedEvent(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalOverlayTouchable}
              activeOpacity={1}
              onPress={() => {
                setEventModalVisible(false);
                setSelectedEvent(null);
              }}
            />
            <View style={styles.eventModalContent}>
              <View style={styles.eventModalHeader}>
                <View style={styles.modalTitleContainer}>
                  <View style={[styles.modalIconContainer, { 
                    backgroundColor: (activeTab === 'births' ? '#81C784' : 
                                    activeTab === 'deaths' ? '#F06292' : 
                                    activeTab === 'holidays' ? '#FF9800' : 
                                    activeTab === 'selected' ? '#9C27B0' : '#64B5F6') + '20' 
                  }]}>
                    {activeTab === 'births' ? <UserPlus size={20} color="#81C784" /> :
                     activeTab === 'deaths' ? <UserMinus size={20} color="#F06292" /> :
                     activeTab === 'holidays' ? <Gift size={20} color="#FF9800" /> :
                     activeTab === 'selected' ? <Star size={20} color="#9C27B0" /> :
                     <Calendar size={20} color="#64B5F6" />}
                  </View>
                  <Text style={styles.modalYear}>{selectedEvent.year}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.eventModalCloseButton}
                  onPress={() => {
                    setEventModalVisible(false);
                    setSelectedEvent(null);
                  }}
                >
                  <X size={20} color={isDarkMode ? "#CCCCCC" : "#666"} />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalBody} 
                showsVerticalScrollIndicator={true}
                bounces={true}
                contentContainerStyle={styles.modalScrollContent}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                                {selectedEvent.pages && selectedEvent.pages.length > 0 && selectedEvent.pages[0].thumbnail && (
                  <View style={styles.modalImageContainer}>
                    <Image 
                      source={{ uri: selectedEvent.pages[0].thumbnail.source }} 
                      style={styles.modalImage}
                      resizeMode="cover"
                      onError={() => console.log('Image load error')}
                    />
                  </View>
                )}
                
                <Text style={styles.modalText}>{selectedEvent.text}</Text>
                
                {selectedEvent.pages && selectedEvent.pages.length > 0 && (
                  <View style={styles.pagesContainer}>
                    {selectedEvent.pages.map((page, index) => (
                      <View key={index} style={styles.pageItem}>
                        <View style={styles.pageHeader}>
                          <ExternalLink size={16} color="#007AFF" />
                          <Text style={styles.pageTitle}>{page.title}</Text>
                        </View>
                        
                        {page.description && (
                          <Text style={styles.pageDescription}>{page.description}</Text>
                        )}
                        
                        {page.extract && (
                          <Text style={styles.pageExtract}>{page.extract}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
              

            </View>
          </View>
        </Modal>
      )}

      {/* Category Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categorySelectionVisible}
        onRequestClose={() => setCategorySelectionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hangi kategorileri görmek istiyorsunuz?</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setCategorySelectionVisible(false)}
              >
                <X size={24} color={isDarkMode ? "#FFFFFF" : "#666"} />
              </TouchableOpacity>
            </View>
            
            <CategorySelector 
              onSelectionComplete={handleCategorySelection}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </Modal>

      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
    </>
  );
};

const getStyles = (isDarkMode: boolean) => {
  // Responsive values
  const containerPadding = isTablet ? 40 : 20;
  const modalWidth = isLargeScreen ? '60%' : isTablet ? '80%' : '90%';
  const modalMaxWidth = isLargeScreen ? 600 : isTablet ? 500 : 350;
  const fontSize = {
    title: isTablet ? 36 : 28,
    subtitle: isTablet ? 18 : 14,
    cardTitle: isTablet ? 18 : 16,
    cardText: isTablet ? 16 : 14,
    tabText: isTablet ? 12 : 10,
    loadingTitle: isTablet ? 24 : 20,
    loadingSubtext: isTablet ? 17 : 15,
  };
  const iconSizes = {
    header: isTablet ? 40 : 32,
    tab: isTablet ? 18 : 14,
    loading: isTablet ? 56 : 48,
  };

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F8F9FA',
  },
  header: {
    padding: containerPadding,
    paddingTop: Platform.OS === 'ios' ? (isTablet ? 20 : 10) : (isTablet ? 50 : 40),
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: isTablet ? 12 : 8,
    paddingLeft: isTablet ? 15 : 10,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginLeft: isTablet ? 12 : 8,
  },
  subtitle: {
    fontSize: fontSize.subtitle,
    color: isDarkMode ? '#CCCCCC' : '#666',
    textAlign: 'left',
    paddingLeft: isTablet ? 15 : 10,
    lineHeight: isTablet ? 24 : 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 30 : 20,
    margin: isTablet ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: isTablet ? 400 : 300,
    maxWidth: modalMaxWidth,
    width: modalWidth,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalInputContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 8,
  },
  input: {
    width: 80,
    height: 50,
    borderWidth: 2,
    borderColor: isDarkMode ? '#444' : '#E0E0E0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    color: isDarkMode ? '#FFFFFF' : '#333',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    paddingHorizontal: isTablet ? 16 : 8,
    paddingVertical: isTablet ? 12 : 8,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
    flexWrap: 'wrap',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 8 : 4,
    borderRadius: isTablet ? 12 : 8,
    marginHorizontal: isTablet ? 4 : 2,
    marginVertical: isTablet ? 6 : 4,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    minWidth: isTablet ? 80 : 60,
  },
  tabText: {
    fontSize: fontSize.tabText,
    fontWeight: '600',
    color: isDarkMode ? '#CCCCCC' : '#666',
    marginTop: isTablet ? 6 : 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  eventsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: isDarkMode ? '#AAAAAA' : '#999',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 26,
  },
  emptyText: {
    fontSize: 16,
    color: isDarkMode ? '#AAAAAA' : '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: isTablet ? 32 : 24,
    padding: isTablet ? 50 : 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: isDarkMode ? 0.4 : 0.15,
    shadowRadius: 16,
    elevation: 12,
    minWidth: isTablet ? 350 : 280,
    maxWidth: isTablet ? 450 : 320,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#F0F0F0',
  },
  loadingIconContainer: {
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: isTablet ? 50 : 40,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 25 : 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  loadingText: {
    fontSize: fontSize.loadingTitle,
    fontWeight: '700',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: fontSize.loadingSubtext,
    color: isDarkMode ? '#CCCCCC' : '#666',
    marginBottom: isTablet ? 30 : 24,
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    fontWeight: '500',
  },
  loadingIndicatorContainer: {
    marginTop: 8,
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (isTablet ? 20 : 15) : (isTablet ? 60 : 50),
    right: isTablet ? 25 : 15,
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  selectedDateContainer: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  selectedDateText: {
    color: isDarkMode ? "#FFFFFF" : "#007AFF",
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  // Event Modal Styles
  eventModalContent: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    margin: 10,
    maxHeight: '95%',
    minHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    flex: 1,
  },
  eventModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  eventModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalYear: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  modalImageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    overflow: 'hidden',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalText: {
    fontSize: 17,
    lineHeight: 26,
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 18,
  },
  pagesContainer: {
    marginTop: 8,
  },
  pageItem: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
    flex: 1,
  },
  pageDescription: {
    fontSize: 14,
    color: isDarkMode ? '#CCCCCC' : '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  pageExtract: {
    fontSize: 15,
    lineHeight: 22,
    color: isDarkMode ? '#FFFFFF' : '#333',
  },

  // Category Selection Modal Styles
  categoryModalContent: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 300,
  },
  // Intro Loading styles
  introLoadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  introLoadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginTop: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  introLoadingText: {
    fontSize: 16,
    color: isDarkMode ? '#CCCCCC' : '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingModal: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: isTablet ? 32 : 24,
    padding: isTablet ? 50 : 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: isDarkMode ? 0.4 : 0.15,
    shadowRadius: 16,
    elevation: 12,
    minWidth: isTablet ? 350 : 280,
    maxWidth: isTablet ? 450 : 320,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#F0F0F0',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: isDarkMode ? '#AAAAAA' : '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  });
};

export default HomeScreen; 