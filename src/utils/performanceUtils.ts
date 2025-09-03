import { Dimensions, Platform } from 'react-native';

// Cache screen dimensions to avoid repeated calls
const screenDimensions = Dimensions.get('window');
export const { width: screenWidth, height: screenHeight } = screenDimensions;
export const isTablet = screenWidth >= 768;
export const isLargeScreen = screenWidth >= 1024;
export const isAndroid = Platform.OS === 'android';

// Android-specific performance optimizations
export const getAndroidOptimizedShadow = (elevation: number) => {
  if (isAndroid) {
    return {
      elevation,
      // Reduce shadow complexity on Android
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    };
  }
  
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevation / 2 },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    elevation,
  };
};

// Optimized style cache
const styleCache = new Map();

export const getCachedStyles = (key: string, styleFactory: () => any) => {
  if (!styleCache.has(key)) {
    styleCache.set(key, styleFactory());
  }
  return styleCache.get(key);
};

// Clear style cache when needed (e.g., theme change)
export const clearStyleCache = () => {
  styleCache.clear();
};

// Image optimization for Android
export const getOptimizedImageProps = (uri: string) => ({
  source: { uri },
  // Android-specific optimizations
  ...(isAndroid && {
    resizeMethod: 'resize' as const,
    fadeDuration: 200,
    progressiveRenderingEnabled: true,
    borderRadius: 0, // Avoid borderRadius on Android for better performance
  }),
  // iOS optimizations
  ...(!isAndroid && {
    resizeMode: 'cover' as const,
  }),
});

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memory management for images
export const createImageCache = () => {
  const cache = new Map<string, boolean>();
  
  return {
    has: (uri: string) => cache.has(uri),
    set: (uri: string) => cache.set(uri, true),
    clear: () => cache.clear(),
    size: () => cache.size,
  };
};

// FlatList optimization helpers
export const getFlatListOptimizations = (itemHeight: number) => ({
  // Android-specific optimizations
  removeClippedSubviews: true,
  maxToRenderPerBatch: isAndroid ? 4 : 6,
  windowSize: isAndroid ? 3 : 5,
  initialNumToRender: isAndroid ? 2 : 3,
  updateCellsBatchingPeriod: isAndroid ? 150 : 100,
  scrollEventThrottle: 16,
  disableIntervalMomentum: true,
  keyboardShouldPersistTaps: 'handled' as const,
  
  // Only use getItemLayout if items have consistent height
  ...(itemHeight > 0 && {
    getItemLayout: (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
  }),
});

// Enhanced scroll performance optimizations
export const getScrollOptimizations = () => ({
  // Reduce scroll lag
  scrollEventThrottle: 16,
  removeClippedSubviews: true,
  disableIntervalMomentum: true,
  
  // Android specific
  ...(isAndroid && {
    overScrollMode: 'never' as const,
    nestedScrollEnabled: false,
  }),
  
  // iOS specific
  ...(!isAndroid && {
    bounces: true,
    bouncesZoom: false,
    alwaysBounceVertical: false,
  }),
});

// Memory-efficient image loading
export const getImageLoadingOptimizations = () => ({
  // Reduce memory usage
  ...(isAndroid && {
    resizeMethod: 'resize' as const,
    fadeDuration: 150,
    progressiveRenderingEnabled: true,
  }),
  
  // iOS optimizations
  ...(!isAndroid && {
    resizeMode: 'cover' as const,
  }),
  
  // Use only defaultSource (not both)
  defaultSource: { 
    uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' 
  },
});

// Text optimization for Android
export const getOptimizedTextProps = () => ({
  ...(isAndroid && {
    textBreakStrategy: 'simple' as const,
    hyphenationFrequency: 'none' as const,
  }),
});

// Reduce re-renders with stable references
export const createStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  // This would typically use useCallback in a component
  // Here we provide the pattern for implementation
  return callback;
}; 