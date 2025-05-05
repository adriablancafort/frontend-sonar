import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
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
  color?: string;
}

export default function ActivityCard({
  title,
  description,
  videoUri,
  tags,
  imageUri = "https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/images//Arminvan.webp",
  startTime,
  endTime,
  longText = "asdkjbaksfbkdjg",
  activityUri = "https://sonar.es/es/actividad/armin-van-buuren-b2b-indira-paganotto",
  color = "#7a85ff",
}: ActivityCardProps) {
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showArtistCard, setShowArtistCard] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // alert('Image URI: ' + imageUri);
  // alert('Video URI: ' + videoUri);
  // alert('Activity URI: ' + activityUri);
  // alert('Long Text: ' + longText);

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
        colors={['transparent', 'rgb(170, 83, 216)']}
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
              className="w-20 h-20 rounded-full border-2 border-orange-500" 
            />
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Text 
              style={styles.ArtistName}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
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
          showsHorizontalScrollIndicator={true}
          className="mb-3"
        >
          {tags.map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tagPill, { backgroundColor: color }]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
  
        {/* Expandable artist card */}
        {showArtistCard && (
          <View style={[styles.bottomContainer, {
            backgroundColor: color ?? 'rgba(38, 38, 38, 0.9)',
            borderColor: color ?? '#3f3f46', // update to secondary color when we have it :))
          }]}>
            {/* Left: Rounded Image */}
            <Image 
              source={{ uri: imageUri }} 
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
  
            {/* Right: LongText + link */}
            <View className="flex-1">
              <View className="flex-row justify-between items-start mb-1">
                <Text style={styles.About_title}>About {title}</Text>
                <TouchableOpacity onPress={toggleArtistCard}>
                  <Feather name="x" size={18} color="white" />
                </TouchableOpacity>
              </View>
  
              <Text style={styles.About_text}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameContainer: {
    flex: 1,           // allow it to shrink/grow properly
    marginRight: 16,   // optional: some spacing on the right
  },
  ArtistName: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'white',
    marginLeft: 15,
  },
  innerText: {
    color: 'red',
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3f3f46', // neutral-700
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  About_title :{
    color: 'white',
    fontSize: 16,
    marginLeft: 9,
    marginBottom: 4
  },
  About_text :{
    color: 'white',
    fontSize: 12,
    marginLeft: 9,
  },
  bottomContainer: {
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16, // Requires React Native >= 0.71
  },
});
