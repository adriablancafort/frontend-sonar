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

  const borderColor = isSelected ? 'border-black/20' : 'border-white/30';
  const pillBgColor = isSelected ? 'bg-black/10' : 'bg-blue-900';
  const iconPillBgColor = isSelected ? 'bg-black/10' : 'bg-blue-900';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-3"
    >
      <Animated.View
        className={`w-full rounded-full overflow-hidden ${getBackgroundColor()}`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View className="flex-row justify-between items-center py-3">
          <View className="flex-row items-center pl-6">
            {/* Schedule Pill Container */}
            <View className={`flex-row items-center rounded-full border ${borderColor} ${pillBgColor} pl-4 pr-0`}>
              {/* Dots */}
              <Text className={`font-semibold text-lg ${isSelected ? 'text-black' : 'text-white'}`}>
                {getDayDots(day).join(' ')}
              </Text>
              
              {/* Icon Pill */}
              <View className={`h-8 w-8 rounded-full items-center justify-center border ${borderColor} ${iconPillBgColor} ml-3`}>
                <FontAwesome5
                  name={getTimeIcon(type)}
                  size={14}
                  color={isSelected ? "black" : "white"}
                />
              </View>
            </View>
            
            {/* Day and Time text below the pill */}
            <View className="ml-3">
              <Text className={`text-xs ${isSelected ? 'text-black' : 'text-white/70'}`}>
                {day} {timeOfDay}
              </Text>
            </View>
          </View>
          
          {/* Date on the right */}
          <Text className={`text-base pr-8 ${isSelected ? 'text-black' : 'text-white'}`}>
            {date}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}