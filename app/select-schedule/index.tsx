import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function SelectSchedule() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const scheduleOptions = [
    { id: '1', day: 'Thursday', date: 'June 12' },
    { id: '2', day: 'Friday', date: 'June 13' },
    { id: '3', day: 'Saturday', date: 'June 14' },
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  return (
    <View className="flex-1 justify-center items-center px-14">
      <Text className="text-white text-3xl font-bold mb-14">
        When will you assist?
      </Text>
      
      <View className="mb-12 w-full">
        {scheduleOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            className={`w-full h-16 rounded-lg justify-center items-center ${
              selectedDays.includes(option.id) ? 'bg-yellow-400' : 'bg-gray-800'
            } ${index < scheduleOptions.length - 1 ? 'mb-4' : ''}`}
            onPress={() => toggleDay(option.id)}
          >
            <Text className={`font-bold ${selectedDays.includes(option.id) ? 'text-black' : 'text-white'}`}>
              {option.day}
            </Text>
            <Text className={`mt-1 ${selectedDays.includes(option.id) ? 'text-black' : 'text-gray-400'}`}>
              {option.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Link href="/select-tags" asChild>
        <TouchableOpacity 
          className={`py-2 pl-6 pr-3 rounded-full flex-row items-center ${
            selectedDays.length > 0 ? 'bg-yellow-400' : 'bg-gray-600'
          }`}
          disabled={selectedDays.length === 0}
        >
          <Text className={`font-semibold text-lg mr-1 ${
            selectedDays.length > 0 ? 'text-black' : 'text-gray-400'
          }`}>Next</Text>
          <Feather name="chevron-right" size={20} color={selectedDays.length > 0 ? 'black' : '#777'} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}
