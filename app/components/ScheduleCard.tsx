import React, { useRef } from 'react';
import { Text, Pressable, Animated, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

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
  type, // day or night
  isSelected = false, 
  onPress 
}: ScheduleCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [day, timeOfDay] = title.split(' ');

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

  const getDayDots = (day: string) => {
    switch (day.toLowerCase()) {
      case 'thursday':
        return ['●', '○', '○'];
      case 'friday':
        return ['●', '●', '○'];
      case 'saturday':
        return ['●', '●', '●'];
      default:
        return ['○', '○', '○'];
    }
  };

  const getTimeIcon = (type: string) => {
    return type.toLowerCase() === 'night' ? 'moon' : 'sun';
  };

  const getBackgroundColor = () => {
    if (isSelected) {
      return type === 'day' ? 'bg-yellow-400' : 'bg-yellow-400';
    } else {
      return type === 'day' ? 'bg-blue-950' : 'bg-neutral-800';
    }
  };

  // Define border color and background colors dynamically
  const borderColor = isSelected ? 'border-black/20' : 'border-white/30';
  const textColor = isSelected ? 'text-black' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-1"
    >
      <Animated.View
        className={`w-full rounded-3xl overflow-hidden ${getBackgroundColor()}`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View className="flex-row justify-between items-start py-5 pl-2">
          <View className="flex-row items-center ml-3">
            {/* Schedule Pill Container */}
            <View className={`flex-row items-center rounded-full border ${borderColor} bg-black/10 py-1 pl-4`}>
              {/* Dots */}
              <Text className={`font-semibold text-lg ${textColor}`}>
                {getDayDots(day).join(' ')}
              </Text>
              
              {/* Icon Pill */}
              <View className={`h-8 w-8 rounded-full items-center justify-center border ${borderColor} bg-black/15 ml-2 mr-1`}>
                <FontAwesome5
                  name={getTimeIcon(type)}
                  size={12}
                  color={isSelected ? "black" : "white"}
                />
              </View>
            </View>
            
            {/* Day and Time text below the pill */}
            <View className="mt-1 ml-3">
              <Text className={`text-xs ${isSelected ? 'text-black/80' : 'text-white/70'}`}>
                {day} {timeOfDay}
              </Text>
            </View>
          </View>
          
          {/* Date on the right */}
          <Text className={`text-base pr-8 pt-3 ${textColor}`}>
            {date}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}