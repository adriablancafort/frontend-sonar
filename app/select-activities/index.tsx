import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  withSequence, 
  runOnJS, 
  Easing,
  cancelAnimation,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import ActivityCard from '@/app/components/ActivityCard';
import { getSwipes, submitSwipesResults } from '@/app/lib/api';
import { Activity } from '@/app/lib/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SWIPE_ANIMATION_CONFIG = {
  duration: 400,
  easing: Easing.out(Easing.ease),
};

export default function SelectActivities() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [rejectedIds, setRejectedIds] = useState<number[]>([]);
  const [hintPlayed, setHintPlayed] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const isAnimating = useSharedValue(false);

  useEffect(() => {
    (async () => {
      const data = await getSwipes();
      setActivities(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (activities.length > 0 && currentIndex === activities.length) {
      (async () => {
        await submitSwipesResults(acceptedIds, rejectedIds);
        router.push('/view-results');
      })();
    }
  }, [activities.length, currentIndex, acceptedIds, rejectedIds, router]);

  // Swipe hint animation
  useEffect(() => {
    if (!loading && !hintPlayed) {
      setHintPlayed(true);

      setTimeout(() => {
        isAnimating.value = true;

        translateX.value = withSequence(
          withTiming(80, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          withTiming(-80, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withSpring(0, { damping: 15 }, () => {
            isAnimating.value = false;
          })
        );

        rotation.value = withSequence(
          withTiming(3, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          withTiming(-3, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withSpring(0, { damping: 15 })
        );
      }, 2000);
    }
  }, [loading, activities, hintPlayed]);

  const stopAnimations = () => {
    if (isAnimating.value) {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(rotation);
      isAnimating.value = false;
    }
  };

  const nextCard = useCallback((swipedRight: boolean) => {
    if (currentIndex < activities.length) {
      const activityId = activities[currentIndex].id;
      if (swipedRight) {
        setAcceptedIds(prev => [...prev, activityId]);
      } else {
        setRejectedIds(prev => [...prev, activityId]);
      }
      setCurrentIndex(currentIndex + 1);
    }

    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    cardScale.value = 1;
  }, [currentIndex, activities]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(stopAnimations)();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY / 3;
      rotation.value = event.translationX / 20;
    })
    .onEnd((event) => {
      const swipeThreshold = 150;
      const velocity = event.velocityX;
      const isSwipedLeft = translateX.value < -swipeThreshold || velocity < -800;
      const isSwipedRight = translateX.value > swipeThreshold || velocity > 800;

      if (isSwipedLeft || isSwipedRight) {
        isAnimating.value = true;

        const targetX = isSwipedLeft ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        const targetRotation = isSwipedLeft ? -30 : 30;

        translateY.value = withTiming(translateY.value + 50, SWIPE_ANIMATION_CONFIG);
        rotation.value = withTiming(targetRotation, SWIPE_ANIMATION_CONFIG);
        translateX.value = withTiming(targetX, SWIPE_ANIMATION_CONFIG, (finished) => {
          if (finished) {
            runOnJS(nextCard)(isSwipedRight);
          }
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        rotation.value = withSpring(0, { damping: 15 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: cardScale.value },
    ],
  }));

  // Add animated styles for the accept/reject buttons
  const rejectButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -50],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return { opacity };
  });

  const acceptButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return { opacity };
  });

  const activity = activities[currentIndex];

  return (
    <GestureHandlerRootView className="flex-1 justify-center items-center">
      {loading || currentIndex === activities.length ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <Animated.View 
            style={rejectButtonStyle}
            className="absolute left-3 z-10 bg-red-500 rounded-full p-4"
          >
            <Feather name="x" size={30} color="white" />
          </Animated.View>
          
          <Animated.View 
            style={acceptButtonStyle}
            className="absolute right-3 z-10 bg-green-500 rounded-full p-4"
          >
            <Feather name="check" size={30} color="white" />
          </Animated.View>

          <GestureDetector gesture={panGesture}>
            <Animated.View className="w-full h-full" style={cardStyle}>

              <ActivityCard
                title={activities[currentIndex].title}
                description={activities[currentIndex].description}
                videoUri={activities[currentIndex].video_uri}
                tags={activities[currentIndex].tags}
                imageUri={activities[currentIndex].image_uri}
                startTime={activities[currentIndex].start_time}
                endTime={activities[currentIndex].end_time}
                activityUri={activities[currentIndex].activity_uri}
                dominantColor={activities[currentIndex].dominant_color}
                darkColor={activities[currentIndex].dark_color}
                pastelColor={activities[currentIndex].pastel_color}
              />
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </GestureHandlerRootView>
  );
}
