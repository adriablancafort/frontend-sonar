import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import TagCard from '@/app/components/TagCard';
import { TagOption } from '@/app/lib/types';
import { getTagOptions, submitTagOptions } from '@/app/lib/api';

export default function SelectTags() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
  useEffect(() => {
    (async () => {
      const options = await getTagOptions();
      setTagOptions(options);
      setLoading(false);
    })();
  }, []);
  
  const selectTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleNextStep = async () => {
    await submitTagOptions(selectedTags);
    router.push('/select-activities');
  };
  
  return (
    <View className="flex-1 justify-center items-center px-10">
      <TouchableOpacity 
        className="absolute top-20 left-4 p-2 z-10"
        onPress={() => router.back()}
      >
        <Feather name="chevron-left" size={28} color="white" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <Text className="text-white text-3xl font-bold mb-1 mt-12">
            What defines you best?
          </Text>
          <Text className="text-white text-3x mb-9">
            Select as many as you want
          </Text>
          
          <View className="mb-12">
            {[0, 1, 2].map(rowIndex => (
              <View key={rowIndex} className="flex-row justify-between w-full mb-4">
                {tagOptions.slice(rowIndex * 3, (rowIndex + 1) * 3).map(tag => (
                  <TagCard
                    key={tag.id}
                    title={tag.title}
                    image_uri={tag.image_uri}
                    isSelected={selectedTags.includes(tag.id)}
                    onPress={() => selectTag(tag.id)}
                  />
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity 
            className="bg-yellow-400 disabled:bg-neutral-500 py-3 pl-8 pr-5 rounded-full flex-row items-center"
            disabled={selectedTags.length === 0}
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
