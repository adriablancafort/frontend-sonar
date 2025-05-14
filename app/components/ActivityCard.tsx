import React, { useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Activity } from '@/app/lib/types';

interface ActivityCardProps {
  activity: Activity;
  selected: boolean;
  onPress: () => void;
}

const ActivityCard = ({ activity, selected, onPress }: ActivityCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
        className={`p-4 mb-3 rounded-xl ${selected ? 'bg-yellow-400' : 'bg-gray-800'}`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Text 
          className={`text-lg font-medium ${selected ? 'text-black' : 'text-white'}`}
        >
          {activity.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default ActivityCard;
