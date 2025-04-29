import React from 'react';
import { View, Text, Image } from 'react-native';

interface ResultsCardProps {
  title: string;
  description: string;
  imageUri: string;
  startTime: string;
  endTime: string;
  schedule: string;
  bgColor?: string;
}

export default function ResultsCard({ 
  title, 
  description, 
  imageUri, 
  startTime, 
  endTime, 
  schedule,
  bgColor = "bg-neutral-800"
}: ResultsCardProps) {
  
  const formatTimeDisplay = () => {
    let timeDisplay = '';
    
    if (startTime) {
      const formattedStartTime = startTime.substring(0, 5);
      timeDisplay = formattedStartTime;
      
      if (endTime) {
        const formattedEndTime = endTime.substring(0, 5);
        timeDisplay += ` - ${formattedEndTime}`;
      }
    }
    
    return timeDisplay;
  };
  
  const timeInfo = formatTimeDisplay();

  return (
    <View className={`${bgColor} rounded-xl shadow-lg p-4 mb-4 flex-row`}>
      <View className="w-1/4 mr-4">
        <Image 
          source={{ uri: imageUri }} 
          className="aspect-square rounded-lg" 
          resizeMode="cover" 
        />
      </View>
      
      <View className="flex-1">
        <Text className="text-xl font-semibold text-white">{title}</Text>
        <Text className="text-neutral-300 mt-2" numberOfLines={3}>{description}</Text>
        
        <View className="flex flex-row gap-3 mt-4">
          <Text className="text-white text-sm font-medium">{timeInfo}</Text>
          <Text className="text-white text-sm font-medium">-</Text>
          <Text className="text-white text-sm font-medium">{schedule}</Text>
        </View>
      </View>
    </View>
  );
};
