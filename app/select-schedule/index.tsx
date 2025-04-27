import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ScheduleCard from '@/app/components/ScheduleCard';

export default function SelectSchedule() {
  const router = useRouter();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const scheduleOptions = [
    { id: '1', day: 'Thursday', date: 'June 12' },
    { id: '2', day: 'Friday', date: 'June 13' },
    { id: '3', day: 'Saturday', date: 'June 14' },
  ];

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleNextStep = async () => {
      router.push('/select-tags');
  };

  return (
    <View className="flex-1 justify-center items-center px-14">
      <Text className="text-white text-3xl font-bold mb-14">
        When will you assist?
      </Text>
      
      <View className="mb-12 w-full gap-4">
        {scheduleOptions.map((option) => (
          <ScheduleCard
            key={option.id}
            day={option.day}
            date={option.date}
            isSelected={selectedOptions.includes(option.id)}
            onPress={() => toggleOption(option.id)}
          />
        ))}
      </View>

      <TouchableOpacity 
        className="py-2 pl-6 pr-3 rounded-full flex-row items-center bg-yellow-400 disabled:bg-gray-600"
        disabled={selectedOptions.length === 0}
        onPress={handleNextStep}
      >
        <Text className="font-semibold text-lg mr-1">Next</Text>
        <Feather name="chevron-right" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}
