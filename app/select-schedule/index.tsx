import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ScheduleCard from '@/app/components/ScheduleCard';
import { ScheduleOption } from '@/app/lib/types';
import { getScheduleOptions, submitScheduleOptions } from '@/app/lib/api';

export default function SelectSchedule() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [scheduleOptions, setScheduleOptions] = useState<ScheduleOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  
  useEffect(() => {
    (async () => {
      const options = await getScheduleOptions();
      setScheduleOptions(options);
      setLoading(false);
    })();
  }, []);

  const toggleOption = (optionId: number) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleNextStep = async () => {
    await submitScheduleOptions(selectedOptions);
    router.push('/select-tags');
  };

  return (
    <View className="flex-1 justify-center items-center px-14">
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <Text className="text-white text-3xl font-bold mb-14">
            When will you assist?
          </Text>
          
          <View className="mb-12 w-full gap-4">
            {scheduleOptions.map((option) => (
              <ScheduleCard
                key={option.id}
                title={option.title}
                date={option.date}
                type={option.type}
                isSelected={selectedOptions.includes(option.id)}
                onPress={() => toggleOption(option.id)}
              />
            ))}
          </View>

          <TouchableOpacity 
            className="bg-yellow-400 disabled:bg-neutral-500 py-3 pl-8 pr-5 rounded-full flex-row items-center"
            disabled={selectedOptions.length === 0}
            onPress={handleNextStep}
          >
            <Text className="font-semibold text-xl mr-1">Next</Text>
            <Feather name="chevron-right" size={22} color="black" />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
