import React, { useRef } from 'react';
import { Text, Pressable, Animated, ImageBackground, View } from 'react-native';

interface TagProps {
  title: string;
  image_uri: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function TagCard({ 
  title, 
  image_uri, 
  isSelected = false, 
  onPress 
}: TagProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        className={`h-28 w-28 rounded-full overflow-hidden ${
          isSelected ? 'border-4 border-yellow-400' : ''
        }`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <ImageBackground 
          source={{ uri: image_uri }} 
          className="h-full w-full"
          resizeMode="cover"
        >
          <View className={`h-full w-full justify-center items-center ${
            isSelected ? 'bg-yellow-400/30' : 'bg-neutral-800/60'
          }`}>
            <Text 
              className="text-center text-lg font-bold text-white"
            >
              {title}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}
