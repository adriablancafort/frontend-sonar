import React, { useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import ArtistCard from './components/Card';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler
} from 'react-native-reanimated';

type ContextType = {
  startX: number;
  startY: number;
};

export default function ArtistsScreen() {
  const artistsData = [
    {
      id: '1',
      artistName: "Charlotte de White",
      videoSource: { 
        uri: 'https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/MySonar%20Videos/charlotte_de_white.mp4' 
      },
      description: "Electronic music producer and DJ based in Berlin",
      genre: "Techno / House"
    },
    {
      id: '2',
      artistName: "Max Klein",
      videoSource: { 
        uri: 'https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/MySonar%20Videos/charlotte_de_white.mp4' 
      },
      description: "Innovative producer blending ambient and breakbeat elements",
      genre: "Ambient / Breakbeat"
    },
    {
      id: '3',
      artistName: "Sophia Rodriguez",
      videoSource: { 
        uri: 'https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/MySonar%20Videos/charlotte_de_white.mp4' 
      },
      description: "Detroit-inspired techno artist with a focus on rhythmic patterns",
      genre: "Detroit Techno"
    },
    {
      id: '4',
      artistName: "Akira Tanaka",
      videoSource: { 
        uri: 'https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/MySonar%20Videos/charlotte_de_white.mp4' 
      },
      description: "Experimental producer combining traditional Japanese instruments with modern electronic sounds",
      genre: "Experimental / Fusion"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const cardScale = useSharedValue(1);

  // Handle next card
  const nextCard = () => {
    if (currentIndex < artistsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      
      // Reset values for the next card
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
      cardScale.value = 1;
    }
  };

  // Handle swipe gesture with proper typing
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: ContextType) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context: ContextType) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
      
      // Calculate rotation based on horizontal movement
      rotation.value = (translateX.value / 10); 
    },
    onEnd: () => {
      // Swipe threshold
      const swipeThreshold = 100;
      
      if (Math.abs(translateX.value) > swipeThreshold) {
        // Swiped far enough - fly the card out
        translateX.value = withSpring(translateX.value > 0 ? 500 : -500);
        translateY.value = withSpring(0);
        cardScale.value = withSpring(0.8);
        
        // Move to next card after animation
        runOnJS(nextCard)();
      } else {
        // Not swiped far enough - return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    }
  });

  // Animated styles for the card
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
          {currentIndex < artistsData.length ? (
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View className="w-full h-full" style={cardStyle}>
                <ArtistCard 
                  artistName={artistsData[currentIndex].artistName}
                  videoSource={artistsData[currentIndex].videoSource}
                  description={artistsData[currentIndex].description}
                  genre={artistsData[currentIndex].genre}
                />
              </Animated.View>
            </PanGestureHandler>
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