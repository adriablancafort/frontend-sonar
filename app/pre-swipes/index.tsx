import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function StartScreen() {
  return (
    <View className="flex-1 justify-center items-center px-12">
      <Text className="text-white text-3xl font-bold mb-5">
        Swipe through Activities
      </Text>
      
      <Text className="text-center text-neutral-300 text-xl mb-12">
        Now we will show you a list of activity videos and you will have to swipe right if you like it or left if you don't.
      </Text>

        <Link href="/swipes" asChild>
            <TouchableOpacity
                className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center mb-4 shadow-lg"
            >
                <Text className="font-semibold text-xl mr-1 text-black">Swipe</Text>
                <Feather name="chevron-right" size={22} color="black" />
            </TouchableOpacity>
        </Link>
    </View>
  )
}
