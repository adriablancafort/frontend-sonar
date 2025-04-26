import React from 'react'
import { Text, View } from 'react-native'
import Video from '@/app/components/Video'
import { LinearGradient } from 'expo-linear-gradient'

interface ArtistCardProps {
  artistName: string;
  videoUri: string;
  description: string;
  genre: string;
}

const ArtistCard = ({ artistName, videoUri, description, genre }: ArtistCardProps) => {
  return (
    <View className="relative w-full h-full rounded-3xl overflow-hidden">
      <Video 
        source={{ uri: videoUri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      
      <View className="absolute bottom-0 left-0 right-0 py-14 px-6">
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,1)'
          ]}
          locations={[0, 0.3, 0.8]}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        
        <Text className="text-white text-3xl mb-3 font-bold">{artistName}</Text>
        
        <Text className="text-gray-300 mb-4 leading-6 text-lg">{description}</Text>

        <View className="bg-yellow-400 self-start rounded-full px-3 py-1">
          <Text className="text-black text-xs font-semibold">{genre}</Text>
        </View>
      </View>
    </View>
  )
}

export default ArtistCard