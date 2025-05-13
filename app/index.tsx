import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { startQuiz } from '@/app/lib/api';

export default function StartScreen() {
  const router = useRouter();
  
  const handleStartQuiz = async () => {
      await startQuiz();
      router.push('/select-schedule');
  };

  return (
    <View className="flex-1 justify-center items-center px-12">
      <Image 
        source={require('@/assets/images/route.jpg')}
        className="w-52 h-52 mb-12"
        resizeMode="contain"
      />
    
      <Text className="text-white text-3xl font-bold mb-5">
        Welcome to MySónar
      </Text>
      
      <Text className="text-center text-neutral-300 text-xl mb-12">
        Discover Sónar Festival. Generate a custom schedule tailored to your preferences.
      </Text>

      <TouchableOpacity 
        className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center"
        onPress={handleStartQuiz}
      >
        <Text className="font-semibold text-xl mr-1">Start Now</Text>
        <Feather name="chevron-right" size={22} color="black" />
      </TouchableOpacity>
    </View>
  )
}
