import React from 'react'
import { Text, View } from 'react-native'
import Video from '@/app/components/Video'
import { LinearGradient } from 'expo-linear-gradient'

interface ActivityCardProps {
  title: string;
  description: string;
  videoUri: string;
  tags: string[];
}

export default function ActivityCard ({ 
  title, 
  description, 
  videoUri, 
  tags = [] 
}: ActivityCardProps) {
  return (
    <View className="relative w-full h-full rounded-3xl overflow-hidden">
      <Video 
        source={{ uri: videoUri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      
      <View className="absolute bottom-0 left-0 right-0 pb-14 px-6">
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,1)'
          ]}
          locations={[0, 0.3, 0.8]}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        
        <Text className="text-white text-3xl mb-3 font-bold">{title}</Text>
        
        <Text className="text-neutral-300 mb-4 leading-6 text-lg">{description}</Text>

        {tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <View 
                key={index} 
                className="bg-yellow-400 rounded-full px-3 py-1"
              >
                <Text className="text-black font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
