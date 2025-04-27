import React, { useState, useCallback, useEffect } from 'react'
import { View, Dimensions, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withTiming, WithTimingConfig, Easing, withSequence } from 'react-native-reanimated'
import ActivityCard from '@/app/components/ActivityCard'
import { Activity } from '@/app/lib/types'
import { getActivities, submitActivityResults } from '@/app/lib/api'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SWIPE_ANIMATION_CONFIG: WithTimingConfig = {
  duration: 400,
  easing: Easing.out(Easing.ease)
};

export default function SelectActivities() {
  const router = useRouter();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [rejectedIds, setRejectedIds] = useState<number[]>([]);
  const [hasPlayedAnimation, setHasPlayedAnimation] = useState(false);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const cardScale = useSharedValue(1);

  // Fetch activities data on component mount
  useEffect(() => {
    (async () => {
      const data = await getActivities();
      setActivities(data);
      setLoading(false);
    })();
  }, []);

  // Submit activity results when user has swiped all cards
  useEffect(() => {
    if (activities.length > 0 && currentIndex === activities.length && 
        (acceptedIds.length > 0 || rejectedIds.length > 0)) {
      (async () => {
        await submitActivityResults(acceptedIds, rejectedIds);
        router.push('/view-results');
      })();
    }
  }, [currentIndex, activities.length, acceptedIds, rejectedIds, router]);

  // Swipe hint animation
  useEffect(() => {
    if (!loading && activities.length > 0 && !hasPlayedAnimation) {
      setHasPlayedAnimation(true);
      
      setTimeout(() => {
        setIsAnimating(true);
        
        translateX.value = withSequence(
          withTiming(80, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          withTiming(-80, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withSpring(0, { damping: 15 }, () => {
            runOnJS(setIsAnimating)(false);
          })
        );
        
        rotation.value = withSequence(
          withTiming(3, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          withTiming(-3, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withSpring(0, { damping: 15 })
        );
      }, 3000);
    }
  }, [loading, activities, hasPlayedAnimation]);

  const nextCard = useCallback((swipedRight: boolean) => {
    // Record the swipe result for the current card
    if (currentIndex < activities.length) {
      const activityId = activities[currentIndex].id;
      if (swipedRight) {
        setAcceptedIds(prev => [...prev, activityId]);
      } else {
        setRejectedIds(prev => [...prev, activityId]);
      }
    }
    
    if (currentIndex < activities.length) {
      setCurrentIndex(currentIndex + 1);
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
      cardScale.value = 1;
    }
    setIsAnimating(false);
  }, [currentIndex, activities]);

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
    <GestureHandlerRootView className="flex-1 justify-center items-center"> 
      {loading || currentIndex === activities.length ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <GestureDetector gesture={panGesture}>
          <Animated.View className="w-full h-full" style={cardStyle}>
            <ActivityCard
              title={activities[currentIndex].title}
              description={activities[currentIndex].description}
              videoUri={activities[currentIndex].video_uri}
              genre={"Live"}
            />
          </Animated.View>
        </GestureDetector>
      )}
    </GestureHandlerRootView>
  );
}
