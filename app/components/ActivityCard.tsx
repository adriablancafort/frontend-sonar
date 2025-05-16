import React, { useRef } from 'react';
import { View, Text, Pressable, Animated, Image } from 'react-native';
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
        className={`flex-row p-4 mb-3 rounded-2xl ${selected ? 'bg-yellow-400' : 'bg-gray-800'}`}
        style={{ 
          transform: [{ scale: scaleAnim }],
          backgroundColor: selected ? '#facc15' : activity.dark_color || '#1f2937'
        }}
      >
        <View className={`w-16 h-16 rounded-full overflow-hidden mr-3 border-2 ${selected ? 'border-black' : 'border-white'}`}>
          <Image
            source={{ uri: activity.image_uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1 justify-center">
          <Text 
            className={`text-lg font-medium ${selected ? 'text-black' : 'text-white'}`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activity.title}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ActivityCard;