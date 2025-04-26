import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import ResultsCard from '@/app/components/ResultsCard';
import { Link } from 'expo-router';

export default function ViewResults() {
  const mockData = [
    {
      title: 'Yoga Class',
      description: 'A relaxing yoga session to improve flexibility and reduce stress.',
      schedule: 'Monday, 7:00 AM - 8:00 AM',
    },
    {
      title: 'Cooking Workshop',
      description: 'Learn to cook delicious meals with professional chefs.',
      schedule: 'Wednesday, 5:00 PM - 7:00 PM',
    },
    {
      title: 'Art Class',
      description: 'Explore your creativity with painting and drawing lessons.',
      schedule: 'Friday, 3:00 PM - 5:00 PM',
    },
    {
      title: 'Fitness Bootcamp',
      description: 'An intense workout session to boost your strength and stamina.',
      schedule: 'Saturday, 6:00 AM - 7:30 AM',
    },
  ];

  return (
    <View className="flex-1 bg-black items-center">
      <ScrollView className="flex-1 px-4 pt-24">
        {mockData.map((activity, index) => (
          <ResultsCard
            key={index}
            title={activity.title}
            description={activity.description}
            schedule={activity.schedule}
          />
        ))}
      </ScrollView>
      
      <Link href="/" asChild>
        <TouchableOpacity className="bg-yellow-400 py-2 px-6 mb-20 rounded-full flex-row items-center">
          <Text className="font-semibold text-lg">Start Again</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
