import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Video from '@/app/components/Video';

interface ActivityCardProps {
  title: string;
  description: string;
  videoUri: string;
  tags: string[];
  imageUri: string;
  startTime?: string;
  endTime?: string;
  longText: string;
  activityUri: string;
}

export default function ActivityCard({
  title,
  description,
  videoUri,
  tags,
  imageUri,
  startTime,
  endTime,
  longText,
  activityUri
}: ActivityCardProps) {
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showArtistCard, setShowArtistCard] = useState(false);
  const [expanded, setExpanded] = useState(false);

  alert('Image URI: ' + imageUri);
  alert('Video URI: ' + videoUri);
  alert('Activity URI: ' + activityUri);
  alert('Long Text: ' + longText);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleArtistCard = () => {
    setShowArtistCard(!showArtistCard);
  };

  // Truncate description if it's too long
  const shortDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;
  
  const handleLinkPress = () => {
    if (activityUri) {
      Linking.openURL(activityUri);
    }
  };
  
  const toggleExpanded = () => setExpanded(!expanded);

  const previewText = longText.length > 120 && !expanded
    ? longText.slice(0, 120).trim() + "..."
    : longText;

  return (
    <View className="flex-1 relative w-full h-full bg-neutral-900">
      {/* Background Video */}
      <Video 
        source={{ uri: videoUri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        muted={isMuted}
        // repeat
      />
  
      {/* Video overlay gradient for better text visibility */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        className="absolute bottom-0 left-0 right-0 h-1/3"
      />
  
      {/* Mute/Unmute button */}
      <TouchableOpacity 
        onPress={toggleMute}
        className="absolute top-10 right-4 bg-black/50 rounded-full p-2"
      >
        <Feather name={isMuted ? "volume-x" : "volume-2"} size={24} color="white" />
      </TouchableOpacity>
  
      {/* Bottom content container */}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        
        {/* Artist profile section */}
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={toggleArtistCard}>
            <Image 
              source={{ uri: imageUri }} 
              className="w-12 h-12 rounded-full border-2 border-orange-500" 
            />
          </TouchableOpacity>
          <View className="ml-3 flex-1">
            <Text className="text-white font-bold text-lg">{title}</Text>
          </View>
        </View>
  
        {/* Description */}
        <TouchableOpacity onPress={() => setShowMoreDescription(!showMoreDescription)}>
          <Text className="text-white mb-3">
            {showMoreDescription ? description : description.slice(0, 100) + (description.length > 100 ? "..." : "")}
            {description.length > 100 && !showMoreDescription && (
              <Text className="text-neutral-400"> See more</Text>
            )}
          </Text>
        </TouchableOpacity>
  
        {/* Tags pill section */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {tags.map((tag, index) => (
            <View 
              key={index} 
              className="bg-neutral-800/80 px-3 py-1 rounded-full mr-2 border border-neutral-700"
            >
              <Text className="text-white text-sm">{tag}</Text>
            </View>
          ))}
        </ScrollView>
  
        {/* Expandable artist card */}
        {showArtistCard && (
          <View className="bg-neutral-800/90 p-4 rounded-xl mt-2 border border-neutral-700 flex-row space-x-4 items-start">
            {/* Left: Rounded Image */}
            <Image 
              source={{ uri: imageUri }} 
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
  
            {/* Right: LongText + link */}
            <View className="flex-1">
              <View className="flex-row justify-between items-start mb-1">
                <Text className="text-white font-bold text-base mb-1">About {title}</Text>
                <TouchableOpacity onPress={toggleArtistCard}>
                  <Feather name="x" size={18} color="white" />
                </TouchableOpacity>
              </View>
  
              <Text className="text-white text-sm mb-1">
                {expanded ? longText : longText.slice(0, 120) + (longText.length > 120 ? "..." : "")}
                {longText.length > 120 && (
                  <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text className="text-blue-400"> {expanded ? "See less" : "See more"}</Text>
                  </TouchableOpacity>
                )}
              </Text>
  
              <TouchableOpacity 
                onPress={() => Linking.openURL(activityUri)} 
                className="self-end mt-1"
              >
                <Feather name="arrow-up-right" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );    
}