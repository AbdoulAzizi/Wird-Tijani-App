import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  PanResponder,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronLeft, 
  Heart, 
  BookOpen, 
  Pause, 
  Play,
  SkipBack,
  SkipForward,
  Star,
  Quote,
  Globe,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Search,
  Filter,
  Settings,
  Moon,
  Sun,
  Repeat,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { asmaAlHusna, AsmaAlHusnaItem } from '../../data/asmaAlHusna';
import { useApp } from '../../contexts/AppContext';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export default function NamesScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState<'english' | 'french' | 'arabic'>('english');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false
  });
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);
  const { state, dispatch, isWirdComplete, getWirdProgress, getCurrentSalawatFormula } = useApp();

  // Vitesses disponibles (en secondes par nom)
  const speedOptions = [
    { label: '0.5x', value: 0.5, duration: 20000 }, // 20 secondes
    { label: '1x', value: 1.0, duration: 10000 },   // 10 secondes
    { label: '1.5x', value: 1.5, duration: 6600 },  // 6.6 secondes
    { label: '2x', value: 2.0, duration: 5000 },    // 5 secondes
    { label: '3x', value: 3.0, duration: 3300 },    // 3.3 secondes
    { label: '5x', value: 5.0, duration: 2000 },    // 2 secondes
  ];
  
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Animation de pulsation améliorée
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Animation de progression
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / asmaAlHusna.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  // Auto-play functionality avec vitesse variable
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoPlay && playbackState.isPlaying) {
      const currentSpeedOption = speedOptions.find(option => option.value === playbackSpeed);
      const duration = currentSpeedOption?.duration || 10000;
      
      interval = setInterval(() => {
        if (currentIndex < asmaAlHusna.length - 1) {
          goToNext();
        } else {
          setPlaybackState(prev => ({ ...prev, isPlaying: false }));
          setAutoPlay(false);
        }
      }, duration);
    }
    return () => clearInterval(interval);
  }, [autoPlay, playbackState.isPlaying, currentIndex, playbackSpeed]);

  // Gesture handling for swipe
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Visual feedback during swipe
      const scale = 1 - Math.abs(gestureState.dx) / (width * 2);
      scaleAnim.setValue(Math.max(0.9, scale));
    },
    onPanResponderRelease: (evt, gestureState) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      if (gestureState.dx > 50 && currentIndex > 0) {
        goToPrevious();
      } else if (gestureState.dx < -50 && currentIndex < asmaAlHusna.length - 1) {
        goToNext();
      }
    },
  });

  const toggleFavorite = useCallback((id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animation de coeur
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  }, [favorites]);

  const toggleBookmark = useCallback((id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarks(newBookmarks);
  }, [bookmarks]);

  const goToNext = useCallback(() => {
    if (currentIndex < asmaAlHusna.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  }, [currentIndex]);

  const togglePlay = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlaybackState(prev => {
      const newIsPlaying = !prev.isPlaying;
      // Active/désactive aussi l'autoplay quand on clique sur play
      setAutoPlay(newIsPlaying);
      return { ...prev, isPlaying: newIsPlaying };
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setPlaybackState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [autoPlay]);

  const shareCurrentName = useCallback(async () => {
    const currentName = asmaAlHusna[currentIndex];
    const shareContent = `${currentName.arabic} - ${currentName.transliteration}\n${language === 'english' ? currentName.english : currentName.french}\n\n${currentName.verse.arabic}\n${language === 'english' ? currentName.verse.english : currentName.verse.french}\n${currentName.verse.reference}`;
    
    // Implement share functionality
    console.log('Sharing:', shareContent);
  }, [currentIndex, language]);

  const changePlaybackSpeed = useCallback((newSpeed: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlaybackSpeed(newSpeed);
    setShowSpeedMenu(false);
  }, []);

  const resetToBeginning = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentIndex(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    setShowResetMenu(false);
  }, []);

  const resetProgress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Réinitialiser les données",
      "Voulez-vous vraiment réinitialiser tous vos favoris et signets ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            setFavorites(new Set());
            setBookmarks(new Set());
            setCurrentIndex(0);
            flatListRef.current?.scrollToIndex({ index: 0, animated: true });
            setShowResetMenu(false);
          }
        }
      ]
    );
  }, []);

  const goToRandomName = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const randomIndex = Math.floor(Math.random() * asmaAlHusna.length);
    setCurrentIndex(randomIndex);
    flatListRef.current?.scrollToIndex({ index: randomIndex, animated: true });
    setShowResetMenu(false);
  }, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        if (index !== currentIndex && index >= 0 && index < asmaAlHusna.length) {
          setCurrentIndex(index);
        }
      }
    }
  );

  // Theme colors
  const theme = {
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    cardBackground: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    gradient: isDarkMode ? ['#0f172a' as const, '#1e293b' as const] : ['#065f46' as const, '#047857' as const, '#059669' as const],
  };

  const renderNameCard = ({ item, index }: { item: AsmaAlHusnaItem; index: number }) => {
    const isFavorite = favorites.has(item.id);
    const isBookmarked = bookmarks.has(item.id);

    return (
      <Animated.View 
        style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}
        {...panResponder.panHandlers}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header avec nom principal */}
          <View style={styles.mainHeader}>
            <LinearGradient
              // colors={theme.gradient}
              colors={isDarkMode ? ['#0f172a' as const, '#1e293b' as const] : ['#064e3b' as const, '#065f46' as const]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerTop}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{item.id}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, isBookmarked && styles.bookmarkActive]}
                    onPress={() => toggleBookmark(item.id)}
                  >
                    <Bookmark 
                      color={isBookmarked ? "#f59e0b" : "#ffffff"} 
                      size={18} 
                      fill={isBookmarked ? "#f59e0b" : "transparent"}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionBtn, isFavorite && styles.favoriteActive]}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Heart 
                      color={isFavorite ? "#ef4444" : "#ffffff"} 
                      size={18} 
                      fill={isFavorite ? "#ef4444" : "transparent"}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={shareCurrentName}
                  >
                    <Share2 color="#ffffff" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Animated.View style={[styles.nameContainer, { opacity: fadeAnim }]}>
                <Text style={styles.arabicName}>{item.arabic}</Text>
                <Text style={styles.transliteration}>{item.transliteration}</Text>
              </Animated.View>

              <View style={styles.languageSelector}>
                <TouchableOpacity
                  style={[styles.langBtn, language === 'english' && styles.langBtnActive]}
                  onPress={() => setLanguage('english')}
                >
                  <Text style={[styles.langText, language === 'english' && styles.langTextActive]}>
                    EN
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.langBtn, language === 'french' && styles.langBtnActive]}
                  onPress={() => setLanguage('french')}
                >
                  <Text style={[styles.langText, language === 'french' && styles.langTextActive]}>
                    FR
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.langBtn, language === 'arabic' && styles.langBtnActive]}
                  onPress={() => setLanguage('arabic')}
                >
                  <Text style={[styles.langText, language === 'arabic' && styles.langTextActive]}>
                    العربية
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.mainTranslation}>
                {language === 'english' ? item.english : 
                 language === 'french' ? item.french : item.arabic}
              </Text>

              {/* Audio controls */}
              <View style={styles.audioControls}>
                <TouchableOpacity 
                  style={styles.audioBtn}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? 
                    <VolumeX color="#ffffff" size={16} /> : 
                    <Volume2 color="#ffffff" size={16} />
                  }
                </TouchableOpacity>
                
                <View style={styles.audioProgress}>
                  <View style={styles.audioProgressBar}>
                    <Animated.View 
                      style={[
                        styles.audioProgressFill, 
                        { width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        })}
                      ]} 
                    />
                  </View>
                </View>
                
                <Text style={styles.audioTime}>
                  {Math.floor(playbackState.currentTime / 60)}:
                  {String(Math.floor(playbackState.currentTime % 60)).padStart(2, '0')}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Section Référence Coranique */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <BookOpen color="#059669" size={20} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Référence Coranique</Text>
            </View>
            
            <View style={styles.verseContainer}>
              <Text style={[styles.arabicVerse, { color: theme.text }]}>{item.verse.arabic}</Text>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={[styles.verseTranslation, { color: theme.textSecondary }]}>
                {language === 'english' ? item.verse.english : 
                 language === 'french' ? item.verse.french : item.verse.arabic}
              </Text>
              <Text style={styles.verseReference}>{item.verse.reference}</Text>
            </View>
          </View>

          {/* Section Réflexion */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Quote color="#059669" size={20} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Réflexion Spirituelle</Text>
            </View>
            
            <View style={styles.meditationContainer}>
              <Text style={[styles.meditationText, { color: theme.textSecondary }]}>
                {language === 'english' ? item.meditation.english : 
                 language === 'french' ? item.meditation.french : item.meditation.english}
              </Text>
            </View>
          </View>

          {/* Section Invocation */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Star color="#059669" size={20} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Invocation Suggérée</Text>
            </View>
            
            <View style={styles.invocationContainer}>
              <Text style={[styles.invocationText, { color: theme.text }]}>
                اللهم إنك {item.arabic} أسألك بهذا الاسم العظيم
              </Text>
              <Text style={[styles.invocationTranslation, { color: theme.textSecondary }]}>
                "Ô Allah, Tu es {item.transliteration}, je Te demande par ce nom magnifique..."
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#0f172a" : "#064e3b"} /> */}
      <StatusBar  />
      {/* Header fixe avec plus d'options */}
      {/* <LinearGradient
        colors={isDarkMode ? ['#0f172a' as const, '#1e293b' as const] : ['#064e3b' as const, '#065f46' as const]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>أسماء الله الحسنى</Text>
          <Text style={styles.headerSubtitle}>The Beautiful Names of Allah</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowResetMenu(!showResetMenu)}
          >
            <Settings color="#ffffff" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? 
              <Sun color="#ffffff" size={20} /> : 
              <Moon color="#ffffff" size={20} />
            }
          </TouchableOpacity>
          
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{currentIndex + 1}</Text>
            <Text style={styles.counterTotal}>/{asmaAlHusna.length}</Text>
          </View>
        </View>
      </LinearGradient> */}

        <View style={[
        styles.progressContainer,
        state.settings.darkMode && styles.progressContainerDark
      ]}>
        <Text style={[
          styles.progressText,
          state.settings.darkMode && styles.progressTextDark
        ]}>
          {currentIndex + 1} / {asmaAlHusna.length} Names
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setIsDarkMode(!isDarkMode)}
            style={styles.infoButton}
          >
             {isDarkMode ? 
              <Sun color="#6B7280" size={20} /> : 
              <Moon color="#6B7280" size={20} />
            }
          </TouchableOpacity>
          <TouchableOpacity 
            // onPress={() => setIsDarkMode(!isDarkMode)}
            onPress={() => setShowResetMenu(!showResetMenu)}
            style={styles.settingsButton}
          >
            <Settings color="#6B7280" size={16} />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetToBeginning} style={styles.resetAllButton}>
            <Repeat color="#6B7280" size={16} />
            <Text style={[
              styles.resetAllText,
              state.settings.darkMode && styles.resetAllTextDark
            ]}>
              Reset All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      

      {/* Menu Reset/Options */}
      {showResetMenu && (
        <View style={styles.menuOverlay}>
          <View style={[styles.menuContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Options</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={resetToBeginning}
            >
              <SkipBack color="#059669" size={20} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Retour au début
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={goToRandomName}
            >
              <Star color="#059669" size={20} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Nom aléatoire
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={resetProgress}
            >
              <Settings color="#ef4444" size={20} />
              <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
                Réinitialiser tout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCloseBtn}
              onPress={() => setShowResetMenu(false)}
            >
              <Text style={styles.menuCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contenu principal */}
      <FlatList
        ref={flatListRef}
        data={asmaAlHusna}
        renderItem={renderNameCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Contrôles fixes en bas améliorés */}
      <View style={styles.controlsWrapper}>
        <LinearGradient
          colors={isDarkMode ? ['rgba(15, 23, 42, 0.95)' as const, 'rgba(15, 23, 42, 1)' as const] : ['rgba(255,255,255,0.95)' as const, 'rgba(255,255,255,1)' as const]}
          style={styles.controlsContainer}
        >
          {/* Barre de progression améliorée */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <Animated.View style={[
                styles.progressFill,
                { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]} />
            </View>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                {Math.round(((currentIndex + 1) / asmaAlHusna.length) * 100)}% complété
              </Text>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                {asmaAlHusna.length - (currentIndex + 1)} restants
              </Text>
            </View>
          </View>

          {/* Contrôles de lecture étendus */}
          <View style={styles.extendedControls}>
            <TouchableOpacity 
              style={[styles.smallControlBtn, autoPlay && styles.activeControlBtn]}
              onPress={toggleAutoPlay}
            >
              <Text style={[styles.controlBtnText, autoPlay && styles.activeControlBtnText]}>
                AUTO
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, currentIndex === 0 && styles.disabledButton]}
              onPress={goToPrevious}
              disabled={currentIndex === 0}
            >
              <SkipBack 
                color={currentIndex === 0 ? "#9ca3af" : "#059669"} 
                size={24} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.playButton, playbackState.isLoading && styles.loadingButton]}
              onPress={togglePlay}
            >
              <LinearGradient
                colors={['#10b981' as const, '#059669' as const]}
                style={styles.playButtonGradient}
              >
                {playbackState.isLoading ? (
                  <Animated.View style={{ transform: [{ rotate: '45deg' }] }}>
                    <Play color="#ffffff" size={28} />
                  </Animated.View>
                ) : playbackState.isPlaying ? (
                  <Pause color="#ffffff" size={28} />
                ) : (
                  <Play color="#ffffff" size={28} />
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                currentIndex === asmaAlHusna.length - 1 && styles.disabledButton
              ]}
              onPress={goToNext}
              disabled={currentIndex === asmaAlHusna.length - 1}
            >
              <SkipForward 
                color={currentIndex === asmaAlHusna.length - 1 ? "#9ca3af" : "#059669"} 
                size={24} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.smallControlBtn, showSpeedMenu && styles.activeControlBtn]}
              onPress={() => setShowSpeedMenu(!showSpeedMenu)}
            >
              <Text style={[styles.controlBtnText, showSpeedMenu && styles.activeControlBtnText]}>
                {playbackSpeed}x
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu de vitesse */}
          {showSpeedMenu && (
            <View style={styles.speedMenu}>
              <Text style={[styles.speedMenuTitle, { color: theme.text }]}>
                Vitesse de lecture
              </Text>
              <View style={styles.speedOptions}>
                {speedOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.speedOption,
                      playbackSpeed === option.value && styles.activeSpeedOption,
                      { backgroundColor: theme.cardBackground, borderColor: theme.border }
                    ]}
                    onPress={() => changePlaybackSpeed(option.value)}
                  >
                    <Text style={[
                      styles.speedOptionText,
                      playbackSpeed === option.value && styles.activeSpeedOptionText,
                      { color: theme.text }
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.speedDuration, { color: theme.textSecondary }]}>
                      {Math.round(option.duration / 1000)}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  counterTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardContainer: {
    width: width,
    flex: 1,
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  mainHeader: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  headerGradient: {
    padding: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  numberBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  numberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  bookmarkActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  arabicName: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  transliteration: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  languageSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
    alignSelf: 'center',
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  langTextActive: {
    color: '#ffffff',
  },
  mainTranslation: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 20,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 12,
    gap: 12,
  },
  audioBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioProgress: {
    flex: 1,
  },
  audioProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  audioTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  verseContainer: {
    padding: 20,
    paddingTop: 16,
  },
  arabicVerse: {
    fontSize: 20,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  verseTranslation: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '600',
  },
  meditationContainer: {
    padding: 20,
    paddingTop: 16,
  },
  meditationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    textAlign: 'justify',
  },
  invocationContainer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
  },
  invocationText: {
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
    fontWeight: '600',
  },
  invocationTranslation: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 140,
  },
  controlsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  controlsContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    // color: '#6b7280',
    color: '#FFFFFF',

  },
  extendedControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  loadingButton: {
    transform: [{ scale: 0.95 }],
  },
  playButtonGradient: {
    flex: 1,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallControlBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 50,
    alignItems: 'center',
  },
  activeControlBtn: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  activeControlBtnText: {
    color: '#10b981',
  },
  // Menu styles
  menuOverlay: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 1000,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    color: '#374151',
  },
  menuCloseBtn: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  menuCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  // Speed menu styles
  speedMenu: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  speedMenuTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  speedOption: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '32%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeSpeedOption: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  speedOptionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  activeSpeedOptionText: {
    color: '#059669',
  },
  speedDuration: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },

   progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainerDark: {
    backgroundColor: '#1F2937',
  },
  // progressText: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#FFFFFF',
  // },
  progressTextDark: {
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  infoButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  resetAllText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  resetAllTextDark: {
    color: '#D1D5DB',
  },
});