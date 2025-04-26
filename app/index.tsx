import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function StartScreen() {
  return (
    <View className="flex-1 justify-center items-center px-14">
      <Image 
        source={require('../assets/images/route.png')}
        className="w-40 h-40 mb-14"
        resizeMode="contain"
      />
    
      <Text className="text-white text-3xl font-bold mb-6">
        Welcome to MySónar
      </Text>
      
      <Text className="text-center text-gray-300 text-lg mb-14">
        Complete a short interactive quiz to get a personalized schedule for Sónar 2025 tailored to your preferences!
      </Text>

      <Link href="/select-schedule" asChild>
        <TouchableOpacity className="bg-yellow-400 py-2 pl-6 pr-3 rounded-full flex-row items-center">
          <Text className=" font-semibold text-lg mr-1">Start Now</Text>
          <Feather name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
      </Link>
    </View>
  )
}
