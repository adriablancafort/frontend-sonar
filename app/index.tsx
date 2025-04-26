import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

export default function StartScreen() {
  return (
    <View className="flex-1 justify-center items-center px-14">
      <Text className="text-white text-3xl font-bold mb-6">
        Welcome to MySónar
      </Text>
      
      <Text className="text-center text-gray-300 text-lg mb-12">
        Complete this short interactive quiz to get a personalized activity schedule for Sónar 2025 tailored to your preferences!
      </Text>

      <Link href="/select-schedule" asChild>
        <TouchableOpacity className="bg-yellow-400 py-2 px-8 rounded-full">
          <Text className="text-white font-semibold text-lg">Start Now</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}
