import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function StartScreen() {
  const router = useRouter();
  
  const handleStartQuiz = async () => {
      router.push('/swipes');
  };

  return (
    <View className="flex-1 justify-center items-center px-12">
      <Text className="text-white text-3xl font-bold mb-5">
        Select Essential Activities
      </Text>

      <TouchableOpacity 
        className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center"
        onPress={handleStartQuiz}
      >
        <Text className="font-semibold text-xl mr-1">Next</Text>
        <Feather name="chevron-right" size={22} color="black" />
      </TouchableOpacity>
    </View>
  )
}
