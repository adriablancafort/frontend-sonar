import React from 'react'
import { Text, View } from 'react-native'
import Video from '@/app/components/Video'

interface ArtistCardProps {
  artistName: string;
  videoUri: string;
  description?: string;
}

const ArtistCard = ({ artistName, videoUri, description }: ArtistCardProps) => {
  return (
    <View className="relative w-full h-full rounded-xl overflow-hidden">
      <Video 
        source={{ uri: videoUri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/40">
        <Text className="text-white text-3xl font-bold">{artistName}</Text>
        {description && (
          <Text className="text-white/70 mt-3">{description}</Text>
        )}
      </View>
    </View>
  )
}

export default ArtistCard