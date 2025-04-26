import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function SelectTags() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const musicGenres = [
    { id: '1', name: 'Techno' },
    { id: '2', name: 'House' },
    { id: '3', name: 'Ambient' },
    { id: '4', name: 'Experimental' },
    { id: '5', name: 'Hip Hop' },
    { id: '6', name: 'IDM' },
    { id: '7', name: 'Bass' },
    { id: '8', name: 'Electronica' },
    { id: '9', name: 'Indie' },
  ];
  
  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <View className="flex-1 justify-center items-center px-14">
      <Text className="text-white text-3xl font-bold mb-14">
        What defines you best?
      </Text>
      
      <View className="mb-14">
        {[0, 1, 2].map(rowIndex => (
          <View key={rowIndex} className="flex-row justify-between w-full mb-6">
            {musicGenres.slice(rowIndex * 3, (rowIndex + 1) * 3).map(genre => (
              <TouchableOpacity
                key={genre.id}
                className={`h-24 w-24 rounded-full justify-center items-center ${
                  selectedGenres.includes(genre.id) ? 'bg-yellow-400' : 'bg-gray-800'
                }`}
                onPress={() => toggleGenre(genre.id)}
              >
                <Text 
                  className={`text-center ${
                    selectedGenres.includes(genre.id) ? 'text-black font-medium' : 'text-white'
                  }`}
                >
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Link href="/select-activities" asChild>
        <TouchableOpacity className="bg-yellow-400 py-2 pl-6 pr-3 rounded-full flex-row items-center">
          <Text className="font-semibold text-lg mr-1">Next</Text>
          <Feather name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
      </Link>
    </View>
  )
}
