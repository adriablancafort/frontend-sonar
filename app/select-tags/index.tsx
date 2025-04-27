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
    <View className="flex-1 justify-center items-center px-14">
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <Text className="text-white text-3xl font-bold mb-14">
            What defines you best?
          </Text>
          
          <View className="mb-14">
            {[0, 1, 2].map(rowIndex => (
              <View key={rowIndex} className="flex-row justify-between w-full mb-6">
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
            className="py-2 pl-6 pr-3 rounded-full flex-row items-center bg-yellow-400 disabled:bg-gray-600"
            disabled={selectedTags.length === 0}
            onPress={handleNextStep}
          >
            <Text className="font-semibold text-lg mr-1">Next</Text>
            <Feather name="chevron-right" size={20} color="black" />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
