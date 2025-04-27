import React, { useRef } from 'react';
import { Text, Pressable, Animated } from 'react-native';

interface ScheduleCardProps {
  title: string;
  date: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function ScheduleCard({ 
  title, 
  date,
  isSelected = false, 
  onPress 
}: ScheduleCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
        className={`w-full h-16 rounded-lg justify-center items-center ${
          isSelected ? 'bg-yellow-400' : 'bg-gray-800'
        }`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Text 
          className={`font-bold ${
            isSelected ? 'text-black' : 'text-white'
          }`}
        >
          {title}
        </Text>
        <Text 
          className={`mt-1 ${
            isSelected ? 'text-black' : 'text-gray-400'
          }`}
        >
          {date}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
