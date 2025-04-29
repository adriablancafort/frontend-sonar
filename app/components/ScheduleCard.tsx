import React, { useRef } from 'react';
import { Text, Pressable, Animated } from 'react-native';

interface ScheduleCardProps {
  title: string;
  date: string;
  type: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function ScheduleCard({ 
  title, 
  date,
  type,
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

  const getBackgroundColor = () => {
    if (isSelected) {
      return type === 'day' ? 'bg-yellow-400' : 'bg-yellow-400';
    } else {
      return type === 'day' ? 'bg-blue-950' : 'bg-neutral-800';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        className={`w-full h-20 rounded-lg px-8 flex-row justify-between items-center ${getBackgroundColor()}`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Text 
          className={`font-semibold text-xl ${
            isSelected ? 'text-black' : 'text-white'
          }`}
        >
          {title}
        </Text>
        <Text 
          className={`text-xl ${
            isSelected ? 'text-black' : 'text-white'
          }`}
        >
          {date}
        </Text>
      </Animated.View>
    </Pressable>
  );
}