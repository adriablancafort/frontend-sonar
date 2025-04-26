import React from 'react';
import { View, Text } from 'react-native';

interface ActivityCardProps {
  title: string;
  description: string;
  schedule: string;
}

export default function ActivityCard({ title, description, schedule }: ActivityCardProps) {
  return (
    <View className="bg-gray-800 rounded-xl shadow-lg p-5 mb-4 border border-gray-700">
      <Text className="text-xl font-bold text-white">{title}</Text>
      <Text className="text-gray-300 mt-2">{description}</Text>
      <View className="mt-4 bg-gray-700/50 px-3 py-2 rounded-lg self-start">
        <Text className="text-yellow-400 text-sm font-medium">{schedule}</Text>
      </View>
    </View>
  );
};