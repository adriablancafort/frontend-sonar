import React, { useRef } from 'react';
import { Text, Pressable, Animated } from 'react-native';

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
        className={`h-24 w-24 rounded-full justify-center items-center ${
          isSelected ? 'bg-yellow-400' : 'bg-gray-800'
        }`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Text 
          className={`text-center ${
            isSelected ? 'text-black font-medium' : 'text-white'
          }`}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
