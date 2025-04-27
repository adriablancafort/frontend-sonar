import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Tag from '@/app/components/Tag';

export default function SelectTags() {
  const router = useRouter();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const tags = [
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
  
  const selectTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleNextStep = async () => {
    router.push('/select-activities');
  };
  
  return (
    <View className="flex-1 justify-center items-center px-14">
      <Text className="text-white text-3xl font-bold mb-14">
        What defines you best?
      </Text>
      
      <View className="mb-14">
        {[0, 1, 2].map(rowIndex => (
          <View key={rowIndex} className="flex-row justify-between w-full mb-6">
            {tags.slice(rowIndex * 3, (rowIndex + 1) * 3).map(tag => (
              <Tag
                key={tag.id}
                title={tag.name}
                isSelected={selectedTags.includes(tag.id)}
                onPress={() => selectTag(tag.id)}
              />
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity 
        className="py-2 pl-6 pr-3 rounded-full flex-row items-center bg-yellow-400 disabled:bg-gray-600"
        disabled={selectedTags.length === 0}
        onPress={handleNextStep}
      >
        <Text className="font-semibold text-lg mr-1">Next</Text>
        <Feather name="chevron-right" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}
