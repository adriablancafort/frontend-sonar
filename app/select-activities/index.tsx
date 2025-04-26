import React, { useState, useCallback, useEffect } from 'react'
import { View, Dimensions, ActivityIndicator } from 'react-native'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withTiming, WithTimingConfig, Easing } from 'react-native-reanimated'
import VideoCard from '@/app/components/VideoCard'
import { Redirect } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SWIPE_ANIMATION_CONFIG: WithTimingConfig = {
  duration: 400,
  easing: Easing.out(Easing.ease)
};

type SwipeResult = {
  id: number | string;
  swipe_right: boolean;
};

export default function SelectActivities() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeResults, setSwipeResults] = useState<SwipeResult[]>([]);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const cardScale = useSharedValue(1);

  const submitSwipes = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      await fetch(`${apiUrl}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swipeResults),
      });
    } catch (error) {
      console.error('Error posting activity data:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/activities`);      
      const data = await response.json();
      setActivity(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Submit swipe results when user has swiped all cards
  useEffect(() => {
    if (activity.length > 0 && currentIndex === activity.length && swipeResults.length > 0) {
      submitSwipes();
    }
  }, [currentIndex, activity.length]);

  const nextCard = useCallback((swipedRight) => {
    // Record the swipe result for the current card
    if (currentIndex < activity.length) {
      setSwipeResults(prev => [
        ...prev, 
        {
          id: activity[currentIndex].id,
          swipe_right: swipedRight
        }
      ]);
    }
    
    if (currentIndex < activity.length) {
      setCurrentIndex(currentIndex + 1);
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
      cardScale.value = 1;
    }
    setIsAnimating(false);
  }, [currentIndex, activity.length]);

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
              // Pass the swipe direction to nextCard
              runOnJS(nextCard)(isSwipedRight);
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
    <GestureHandlerRootView> 
      <View className="flex-1 justify-center items-center">
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : currentIndex < activity.length ? (
          <GestureDetector gesture={panGesture}>
            <Animated.View className="w-full h-full" style={cardStyle}>
              <VideoCard
                artistName={activity[currentIndex].title}
                videoUri={activity[currentIndex].video_uri}
                description={activity[currentIndex].description}
                genre={"Live"}
              />
            </Animated.View>
          </GestureDetector>
        ) : (
          <Redirect href="/view-results" />
        )}
      </View>
    </GestureHandlerRootView>
  );
}
