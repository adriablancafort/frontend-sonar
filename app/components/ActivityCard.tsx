import React, { useRef } from 'react';
import { View, Text, Pressable, Animated, Image } from 'react-native';
import { Activity } from '@/app/lib/types';
import { FontAwesome5 } from '@expo/vector-icons';

interface ActivityCardProps {
  activity: Activity;
  selected: boolean;
  onPress: () => void;
}

const ActivityCard = ({ activity, selected, onPress }: ActivityCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [day, timeOfDay] = activity.title.split(' ');
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 10,
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
    return type?.toLowerCase() === 'night' ? 'moon' : 'sun';
  };

  const borderColor = selected ? 'border-black/20' : 'border-white/30';
  const textColor = selected ? 'text-black' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        className={`flex-row items-center p-4 mb-3 rounded-3xl`}
        style={{ 
          transform: [{ scale: scaleAnim }],
          backgroundColor: selected ? '#facc15' : activity.dark_color || '#1f2937'
        }}
      >
        {/* Activity Image */}
        <View className={`w-20 h-16 rounded-full overflow-hidden mr-3 border-2 ${borderColor}`}>
          <Image
            source={{ uri: activity.image_uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Activity Info */}
        <View className="flex-1">
          <Text 
            className={`text-lg font-medium ${textColor}`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activity.title}
          </Text>
          
          {/* Day/Night Indicator */}
          {day && (
            <View className="flex-row items-center mt-1">
              <View className={`flex-row items-center rounded-full border ${borderColor} bg-black/10 px-2 py-1`}>
                {/* Day Dots */}
                <Text className={`text-xs ${textColor} mr-1`}>
                  {getDayDots(day).join(' ')}
                </Text>
                
                {/* Time Icon */}
                <View className={`h-5 w-5 rounded-full items-center justify-center border ${borderColor} bg-black/15`}>
                  <FontAwesome5
                    name={getTimeIcon(activity.type)}
                    size={10}
                    color={selected ? "black" : "white"}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ActivityCard;