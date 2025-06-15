import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
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
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react-native';
import EventCard from '../components/EventCard';
import CategorySelector from '../components/CategorySelector';
import SettingsScreen from './SettingsScreen';
import PrivacyScreen from './PrivacyScreen';
import { fetchHistoricalEvents, fetchHistoricalEventsByYear, WikiResponse, WikiEvent } from '../services/wikiService';


import { 
  screenWidth, 
  screenHeight, 
  isTablet, 
  isLargeScreen, 
  getFlatListOptimizations,
  getAndroidOptimizedShadow,
  getCachedStyles,
  clearStyleCache
} from '../utils/performanceUtils';

const HomeScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchMode, setSearchMode] = useState<'birthdate' | 'timemachine'>('birthdate');
  const [events, setEvents] = useState<WikiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'births' | 'deaths' | 'holidays' | 'selected'>('events');
  const [modalVisible, setModalVisible] = useState(false);
  const [optionSelectionVisible, setOptionSelectionVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<WikiEvent | null>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [categorySelectionVisible, setCategorySelectionVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [introLoading, setIntroLoading] = useState(true);

  // Refs for input fields
  const dayInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Loading süresi sonunda direkt ana ekrana geç
    const loadingTimer = setTimeout(() => {
      setIntroLoading(false);
      setShowIntro(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Dil değiştiğinde mevcut verileri temizle ve style cache'i temizle
  useEffect(() => {
    if (events) {
      setEvents(null);
    }
    clearStyleCache(); // Clear style cache when language changes
  }, [i18n.language]);

  // Modal açıldığında uygun input'a odaklan
  useEffect(() => {
    if (modalVisible) {
      const timer = setTimeout(() => {
        if (searchMode === 'birthdate') {
          dayInputRef.current?.focus();
        } else {
          yearInputRef.current?.focus();
        }
      }, 300); // Modal animasyonu tamamlandıktan sonra
      return () => clearTimeout(timer);
    }
  }, [modalVisible, searchMode]);

  // Handle day input change
  const handleDayChange = useCallback((text: string) => {
    setBirthDay(text);
    // Eğer 2 karakter girildiyse ve geçerli bir gün ise ay input'una geç
    if (text.length === 2) {
      const day = parseInt(text);
      if (day >= 1 && day <= 31) {
        monthInputRef.current?.focus();
      }
    }
  }, []);

  // Handle month input change
  const handleMonthChange = useCallback((text: string) => {
    setBirthMonth(text);
  }, []);

  // Handle year input change
  const handleYearChange = useCallback((text: string) => {
    setSelectedYear(text);
  }, []);

  // Handle option selection
  const handleOptionSelection = useCallback((option: 'birthdate' | 'timemachine') => {
    setSearchMode(option);
    setOptionSelectionVisible(false);
    setModalVisible(true);
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearch = useCallback(async () => {
    if (searchMode === 'birthdate') {
      if (!birthDay || !birthMonth) {
        Alert.alert(t('common.error'), t('home.missingDate'));
        return;
      }

      const day = parseInt(birthDay);
      const month = parseInt(birthMonth);

      if (day < 1 || day > 31 || month < 1 || month > 12) {
        Alert.alert(t('common.error'), t('home.invalidDate'));
        return;
      }
    } else {
      if (!selectedYear) {
        Alert.alert(t('common.error'), t('home.missingYear'));
        return;
      }

      const year = parseInt(selectedYear);
      const currentYear = new Date().getFullYear();

      if (year < 1 || year > currentYear) {
        Alert.alert(t('common.error'), t('home.invalidYear'));
        return;
      }
    }

    setModalVisible(false);
    setCategorySelectionVisible(true);
  }, [birthDay, birthMonth, selectedYear, searchMode, t]);

  const handleCategorySelection = useCallback(async (categories: string[]) => {
    setCategorySelectionVisible(false);
    setSelectedCategories(categories);
    setLoading(true);
    setEvents(null);
    
    try {
      let data: WikiResponse;
      
      if (searchMode === 'birthdate') {
        const day = parseInt(birthDay);
        const month = parseInt(birthMonth);
        data = await fetchHistoricalEvents(month, day, i18n.language);
      } else {
        const year = parseInt(selectedYear);
        data = await fetchHistoricalEventsByYear(year, i18n.language);
      }
      
      // Minimum loading süresi için küçük bir gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(data);
      
      // İlk kategoriyi aktif yap
      if (categories.length > 0) {
        setActiveTab(categories[0] as 'events' | 'births' | 'deaths' | 'holidays' | 'selected');
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('home.loadingError'));
    } finally {
      setLoading(false);
    }
  }, [birthDay, birthMonth, selectedYear, searchMode, i18n.language, t]);

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

  // Memoized current data to prevent unnecessary recalculations
  const currentData = useMemo(() => getCurrentData(), [getCurrentData]);

  // Optimized FlatList props for Android performance
  const flatListOptimizations = useMemo(() => getFlatListOptimizations(200), []);

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
            <Text style={styles.introLoadingTitle}>{t('app.title')}</Text>
            <ActivityIndicator 
              size="large" 
              color={isDarkMode ? "#FFFFFF" : "#007AFF"} 
              style={{ marginVertical: 20 }}
            />
            <Text style={styles.introLoadingText}>{t('app.preparing')}</Text>
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
              <Text style={styles.modalTitle}>
                {searchMode === 'birthdate' ? t('home.enterBirthDate') : t('home.timeMachine')}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={isDarkMode ? "#FFFFFF" : "#666"} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalSubtitle}>
                {searchMode === 'birthdate' ? t('home.enterBirthDateSubtitle') : t('home.timeMachineSubtitle')}
              </Text>
              
              {searchMode === 'birthdate' ? (
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('home.day')}</Text>
                    <TextInput
                      ref={dayInputRef}
                      style={[
                        styles.input,
                        birthDay && styles.inputFilled
                      ]}
                      value={birthDay}
                      onChangeText={handleDayChange}
                      placeholder="01"
                      placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
                      keyboardType="numeric"
                      maxLength={2}
                      onSubmitEditing={() => monthInputRef.current?.focus()}
                      selectTextOnFocus={true}
                    />
                  </View>
                  <View style={styles.separatorContainer}>
                    <Text style={styles.separator}>/</Text>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('home.month')}</Text>
                    <TextInput
                      ref={monthInputRef}
                      style={[
                        styles.input,
                        birthMonth && styles.inputFilled
                      ]}
                      value={birthMonth}
                      onChangeText={handleMonthChange}
                      placeholder="01"
                      placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
                      keyboardType="numeric"
                      maxLength={2}
                      onSubmitEditing={handleSearch}
                      selectTextOnFocus={true}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>{t('home.year')}</Text>
                    <TextInput
                      ref={yearInputRef}
                      style={[
                        styles.input,
                        selectedYear && styles.inputFilled
                      ]}
                      value={selectedYear}
                      onChangeText={handleYearChange}
                      placeholder="2000"
                      placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
                      keyboardType="numeric"
                      maxLength={4}
                      onSubmitEditing={handleSearch}
                      selectTextOnFocus={true}
                    />
                  </View>
                </View>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.searchButton,
                  ((searchMode === 'birthdate' && birthDay && birthMonth) || 
                   (searchMode === 'timemachine' && selectedYear)) && styles.searchButtonActive
                ]} 
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    {searchMode === 'birthdate' ? (
                      <Search size={20} color="#FFFFFF" />
                    ) : (
                      <Clock size={20} color="#FFFFFF" />
                    )}
                    <Text style={styles.searchButtonText}>{t('home.discover')}</Text>
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
              <Text style={styles.loadingText}>{t('home.loadingEvents')}</Text>
                              <Text style={styles.loadingSubtext}>
                  {searchMode === 'birthdate' 
                    ? (birthDay && birthMonth ? `${birthDay}/${birthMonth} ` : '') + t('home.loadingSubtext')
                    : (selectedYear ? `${selectedYear} ` : '') + t('home.loadingYearSubtext')
                  }
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
            <Text style={styles.title}>{t('app.title')}</Text>
          </View>
          <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
          
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setShowSettings(true)}
          >
            <Settings size={isTablet ? 24 : 20} color={isDarkMode ? "#FFFFFF" : "#666"} />
          </TouchableOpacity>
        </View>

      {((searchMode === 'birthdate' && birthDay && birthMonth) || (searchMode === 'timemachine' && selectedYear)) && (
        <View style={styles.selectedDateContainer}>
          {searchMode === 'birthdate' ? (
            <>
              <CalendarDays size={20} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
              <Text style={styles.selectedDateText}>
                {birthDay}/{birthMonth}
              </Text>
            </>
          ) : (
            <>
              <Clock size={20} color={isDarkMode ? "#FFFFFF" : "#FF6B35"} />
              <Text style={styles.selectedDateText}>
                {selectedYear}
              </Text>
            </>
          )}
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
                      {t('tabs.events')}{'\n'}({count})
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
                      {t('tabs.births')}{'\n'}({count})
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
                      {t('tabs.deaths')}{'\n'}({count})
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
                      {t('tabs.holidays')}{'\n'}({count})
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
                      {t('tabs.selected')}{'\n'}({count})
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
            <Text style={styles.loadingTitle}>{t('home.loadingTitle')}</Text>
            <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 16 }} />
            <Text style={styles.loadingText}>{t('home.loadingWait')}</Text>
          </View>
        </View>
      ) : events ? (
        <FlatList
          data={currentData}
          renderItem={renderEventCard}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          {...flatListOptimizations}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
          <View style={styles.emptyState}>
            <CalendarDays size={64} color={isDarkMode ? "#666" : "#CCC"} />
            <Text style={styles.emptyStateText}>
              {t('home.emptyState')}
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
          onToggleDarkMode={() => {
            setIsDarkMode(!isDarkMode);
            clearStyleCache(); // Clear style cache when theme changes
          }}
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
                      resizeMode="contain"
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
            <View style={styles.categoryModalHeader}>
              <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryModalTitle}>{t('categories.title')}</Text>
              </View>
              <TouchableOpacity 
                style={styles.categoryCloseButton}
                onPress={() => setCategorySelectionVisible(false)}
              >
                <X size={20} color={isDarkMode ? "#FFFFFF" : "#666"} />
              </TouchableOpacity>
            </View>
            
            <CategorySelector 
              onSelectionComplete={handleCategorySelection}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </Modal>

      
      {/* Option Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={optionSelectionVisible}
        onRequestClose={() => setOptionSelectionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionModalContent}>
            <View style={styles.optionModalHeader}>
              <Text style={styles.optionModalTitle}>{t('home.chooseOption')}</Text>
              <TouchableOpacity 
                style={styles.optionCloseButton}
                onPress={() => setOptionSelectionVisible(false)}
              >
                <X size={20} color={isDarkMode ? "#FFFFFF" : "#666"} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionContainer}>
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => handleOptionSelection('birthdate')}
                activeOpacity={0.8}
              >
                <View style={styles.optionIconContainer}>
                  <CalendarDays size={isTablet ? 36 : 32} color="#007AFF" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{t('home.birthDateOption')}</Text>
                  <Text style={styles.optionDescription}>{t('home.birthDateOptionDesc')}</Text>
                </View>
                <ArrowRight size={20} color={isDarkMode ? "#CCCCCC" : "#666"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => handleOptionSelection('timemachine')}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: '#FF6B3520' }]}>
                  <Clock size={isTablet ? 36 : 32} color="#FF6B35" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{t('home.timeMachineOption')}</Text>
                  <Text style={styles.optionDescription}>{t('home.timeMachineOptionDesc')}</Text>
                </View>
                <ArrowRight size={20} color={isDarkMode ? "#CCCCCC" : "#666"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setOptionSelectionVisible(true)}
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
    padding: isTablet ? 30 : 24,
    margin: isTablet ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: isTablet ? 400 : 320,
    maxWidth: modalMaxWidth,
    width: modalWidth,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalInputContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#CCCCCC' : '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  inputGroup: {
    alignItems: 'center',
    minWidth: 80,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    width: 80,
    height: 56,
    borderWidth: 2,
    borderColor: isDarkMode ? '#555' : '#E0E0E0',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    color: isDarkMode ? '#FFFFFF' : '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFilled: {
    borderColor: '#007AFF',
    backgroundColor: isDarkMode ? '#1E3A8A' : '#E3F2FD',
  },
  separatorContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  separator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#AAAAAA' : '#666',
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
    borderRadius: 16,
    padding: 0,
    margin: 20,
    maxHeight: '85%',
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  eventModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  eventModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  modalImageContainer: {
    width: '100%',
    height: isTablet ? 280 : 240,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: 14,
  },
  pagesContainer: {
    marginTop: 6,
  },
  pageItem: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
    flex: 1,
  },
  pageDescription: {
    fontSize: 13,
    color: isDarkMode ? '#CCCCCC' : '#666',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  pageExtract: {
    fontSize: 14,
    lineHeight: 20,
    color: isDarkMode ? '#FFFFFF' : '#333',
  },

  // Category Selection Modal Styles
  categoryModalContent: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    margin: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  categoryTitleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    lineHeight: 24,
  },
  categoryCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
    minWidth: 140,
  },
  searchButtonActive: {
    backgroundColor: '#007AFF',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Option Selection Modal Styles
  optionModalContent: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    margin: isTablet ? 30 : 15,
    maxHeight: '90%',
    minHeight: isTablet ? 500 : 400,
    width: isTablet ? '80%' : '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  optionModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isTablet ? 24 : 20,
    paddingBottom: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#E0E0E0',
  },
  optionModalTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333',
    lineHeight: isTablet ? 28 : 24,
  },
  optionCloseButton: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    padding: isTablet ? 30 : 24,
    paddingTop: isTablet ? 24 : 20,
    flex: 1,
    justifyContent: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 28 : 24,
    marginBottom: isTablet ? 24 : 20,
    minHeight: isTablet ? 120 : 100,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  optionIconContainer: {
    width: isTablet ? 72 : 64,
    height: isTablet ? 72 : 64,
    borderRadius: isTablet ? 36 : 32,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 24 : 20,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: isTablet ? 16 : 12,
    paddingVertical: 4,
  },
  optionTitle: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#333',
    marginBottom: isTablet ? 8 : 6,
    lineHeight: isTablet ? 26 : 24,
  },
  optionDescription: {
    fontSize: isTablet ? 17 : 16,
    color: isDarkMode ? '#CCCCCC' : '#666',
    lineHeight: isTablet ? 24 : 22,
    flexWrap: 'wrap',
  },
  });
};

export default HomeScreen; 