import React, { useState, useEffect, useRef } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ImageBackground,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import ResultsCard from '@/app/components/ResultsCard';
import { Result } from '@/app/lib/types';
import { getResults } from '@/app/lib/api';

export default function ViewResults() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');
  
  // Background parallax effect
  const backgroundTranslateY = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -100],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    (async () => {
      // Add small delay to show loading state
      const data = await getResults();
      setResults(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Animated.View
        style={[
          styles.backgroundContainer,
          { transform: [{ translateY: backgroundTranslateY }] },
        ]}
      >
        <ImageBackground
          source={require('./assets/fons_results.jpg')}
          style={styles.backgroundImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.backgroundGradient}
          />
        </ImageBackground>
      </Animated.View>
  
      {/* Main Content */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Results</Text>
          <BlurView intensity={30} tint="dark" style={styles.headerBlur}>
            <Text style={styles.headerSubtitle}>Your personalized recommendations</Text>
          </BlurView>
        </View>
  
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Finding perfect matches...</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Animated.ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            >
              {results.map((result) => (
                <ResultsCard
                  key={result.id}
                  title={result.title}
                  description={result.description}
                  schedule={result.schedules.title}
                  startTime={result.start_time}
                  endTime={result.end_time}
                  imageUri={result.image_uri}
                  dominantColor={result.dominant_color}
                  darkColor={result.dark_color}
                  pastelColor={result.pastel_color}
                  activityUri={result.activity_uri}
                  tags={result.tags}
                />
              ))}
              <View style={{ height: 120 }} />
            </Animated.ScrollView>
  
            {/* Bottom Bar */}
            <View style={styles.bottomBarContainer}>
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.7)',
                  'rgba(0,0,0,0.97)',
                  'rgba(0,0,0,1)',
                ]}
                locations={[0, 0.2, 0.4, 0.8]}
                style={styles.bottomGradient}
              />
              <BlurView intensity={40} tint="dark" style={styles.bottomBlur}>
                <Link href="/" asChild>
                  <TouchableOpacity style={styles.startAgainButton}>
                    <Feather name="refresh-cw" size={20} color="#000" style={{ marginRight: 8 }} />
                    <Text style={styles.startAgainText}>Start Again</Text>
                  </TouchableOpacity>
                </Link>
              </BlurView>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: Dimensions.get('window').height * 2,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerBlur: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bottomGradient: {
    position: 'absolute',
    height: 120,
    width: '100%',
  },
  bottomBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startAgainButton: {
    backgroundColor: '#FFD700', // Bright gold color for visibility
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  startAgainText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  }
});