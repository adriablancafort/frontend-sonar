import React, { useState, useCallback, useEffect } from 'react'
import { View, SafeAreaView, Text, Dimensions, ActivityIndicator } from 'react-native'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withTiming, WithTimingConfig, Easing } from 'react-native-reanimated'
import ArtistCard from '@/app/components/Card'

// Get screen dimensions for better animation calculations
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animation config for smoother transitions
const SWIPE_ANIMATION_CONFIG: WithTimingConfig = {
  duration: 400,
  easing: Easing.out(Easing.ease)
};

export default function ArtistsScreen() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchArtists = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/activities`);      
      const data = await response.json();
      setArtists(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const nextCard = useCallback(() => {
    if (currentIndex < artists.length - 1) {
      setCurrentIndex(currentIndex + 1);
      
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
      cardScale.value = 1;
    }
    setIsAnimating(false);
  }, [currentIndex, artists.length]);

  const panGesture = Gesture.Pan()
    .enabled(!isAnimating)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY / 3;
      rotation.value = (event.translationX / 20);
    })
    .onEnd((event) => {
      const swipeThreshold = 150;
      const velocity = event.velocityX;
      const isSwipedLeft = translateX.value < -swipeThreshold || velocity < -800;
      const isSwipedRight = translateX.value > swipeThreshold || velocity > 800;
      
      if (isSwipedLeft || isSwipedRight) {
        // Set animating state to prevent additional gestures
        runOnJS(setIsAnimating)(true);
        
        // Determine the exit point based on swipe direction
        const targetX = isSwipedLeft ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        const targetRotation = isSwipedLeft ? -30 : 30;
        
        // First animate the Y position slightly for a more natural feel
        translateY.value = withTiming(translateY.value + 50, SWIPE_ANIMATION_CONFIG);
        
        // Animate rotation more dramatically for exit
        rotation.value = withTiming(targetRotation, SWIPE_ANIMATION_CONFIG);
        
        // Animate the X position to fully exit the screen
        translateX.value = withTiming(
          targetX, 
          SWIPE_ANIMATION_CONFIG,
          (finished) => {
            if (finished) {
              // Only advance to next card after animation completes
              runOnJS(nextCard)();
            }
          }
        );
      } else {
        // Not swiped far enough - return to center with spring for bounce effect
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        rotation.value = withSpring(0, { damping: 15 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { scale: cardScale.value }
      ]
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : currentIndex < artists.length ? (
            <GestureDetector gesture={panGesture}>
              <Animated.View className="w-full h-full" style={cardStyle}>
                <ArtistCard
                  artistName={artists[currentIndex].title}
                  videoUri={artists[currentIndex].video_uri}
                  description={artists[currentIndex].description}
                />
              </Animated.View>
            </GestureDetector>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-xl">No more artists</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}