import React from 'react';
import { View, Text } from 'react-native';

interface ActivityCardProps {
    title: string;
    description: string;
    schedule: string;
}
  
const ActivityCard = ({ title, description, schedule }: ActivityCardProps) => {
    return (
      <View className="bg-white rounded-lg shadow-md p-4 mb-4">
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        <Text className="text-gray-600 mt-2">{description}</Text>
        <Text className="text-gray-500 mt-4 text-sm">Schedule: {schedule}</Text>
      </View>
    );
  };

  export default ActivityCard;