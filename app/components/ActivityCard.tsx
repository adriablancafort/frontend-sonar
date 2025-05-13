import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet, LayoutAnimation, Platform, UIManager, Animated, StatusBar, SafeAreaView } from 'react-native';
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
  activityUri: string;
  dominantColor?: string;
  darkColor?: string;
  pastelColor?: string;
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ActivityCard({
  title,
  description,
  videoUri,
  tags,
  imageUri = "https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/images//Arminvan.webp",
  startTime,
  endTime,
  activityUri = "https://sonar.es/es/actividad/armin-van-buuren-b2b-indira-paganotto",
  dominantColor = "#7a85ff",
  darkColor = "#4a5bff",
  pastelColor = "#a3b2ff",
}: ActivityCardProps) {
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showArtistCard, setShowArtistCard] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleArtistCard = () => {
    setShowArtistCard(!showArtistCard);
  };
  
  const handleLinkPress = () => {
    if (activityUri) {
      Linking.openURL(activityUri);
    }
  };
  
  const toggleDescription = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMoreDescription(!showMoreDescription);
  };

  const statusBarOffset = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View className="flex-1 relative w-full h-full bg-neutral-900">
      {/* Background Video */}
      <Video 
        source={{ uri: videoUri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        muted={isMuted}
        // resizeMode="cover"
      />
  
      {/* Video overlay gradient for better text visibility */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', darkColor]}
        locations={[0.5, 0.8, 1]}
        className="absolute bottom-0 left-0 right-0 h-2/5"
      />
  
      {/* Mute/Unmute button */}
      <TouchableOpacity 
        onPress={toggleMute}
        className="absolute right-4 rounded-full p-3"
        style={{ 
          top: statusBarOffset + 10,
          elevation: 3,
          backgroundColor: `${dominantColor}AA`,
        }}
      >
        <Feather name={isMuted ? "volume-x" : "volume-2"} size={22} color="white" />
      </TouchableOpacity>
      
  
      {/* Bottom content container */}
      <View className="absolute bottom-0 left-0 right-0 p-5">
        
        {/* Artist profile section */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={toggleArtistCard} style={styles.profileImageWrapper}>
            <Image 
              source={{ uri: imageUri }} 
              className="w-20 h-20 rounded-full"
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Text 
              style={styles.artistName}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>
  
        {/* Tags pill section */}
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tagPill, { backgroundColor: `${dominantColor}CC` }]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
  
        {/* Expandable artist card */}
        {showArtistCard && (
          <Animated.View style={[
            styles.bottomContainer,
            {
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              borderColor: pastelColor,
            },
          ]}>
            {showMoreDescription ? (
              // 🔹 Expanded View
              <View>
                {/* Horizontal Full-Width Image */}
                <Image
                  source={{ uri: imageUri }}
                  style={styles.expandedCardImage}
                  resizeMode="cover"
                />

                {/* Title and close button */}
                <View className="flex-row justify-between items-center mt-4 mb-2">
                  <Text style={styles.expandedTitle}>
                    {title}
                  </Text>
                  
                  <TouchableOpacity 
                    onPress={toggleArtistCard}
                    style={[styles.closeButton, { backgroundColor: `${dominantColor}99` }]}
                  >
                    <Feather name="x" size={18} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Time information if available */}
                {startTime && endTime && (
                  <View className="flex-row items-center mb-3" style={{ opacity: 0.9 }}>
                    <Feather name="clock" size={14} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.timeText}>
                      {startTime} - {endTime}
                    </Text>
                  </View>
                )}

                {/* Full Description */}
                <Text style={styles.expandedDescription}>{description}</Text>

                {/* Controls */}
                <View className="flex-row justify-between items-center mt-6">
                  <TouchableOpacity 
                    onPress={toggleDescription}
                    style={[styles.actionButton, { backgroundColor: `${dominantColor}99` }]}
                  >
                    <Feather name="chevron-up" size={16} color="white" />
                    <Text style={styles.actionButtonText}>Show less</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleLinkPress}
                    style={[styles.actionButton, { backgroundColor: `${dominantColor}` }]}
                  >
                    <Text style={styles.actionButtonText}>View details</Text>
                    <Feather name="arrow-up-right" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // 🔹 Collapsed View
              <View className="relative">
                <View className="flex-row space-x-4">
                  {/* Left Image */}
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />

                  {/* Right Content */}
                  <View style={{ flex: 1, paddingBottom: 48 }}> {/* reserve space for buttons */}
                    <View className="flex-row justify-between items-start mb-2">
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text
                          style={styles.aboutTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          About {title}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={toggleArtistCard}
                        style={styles.smallCloseButton}
                      >
                        <Feather name="x" size={16} color="white" />
                      </TouchableOpacity>
                    </View>

                    <View className="mb-3">
                      <Text
                        style={[styles.aboutText, { paddingRight: 4 }]} // small spacing from the image
                        numberOfLines={3}
                      >
                        {description.slice(0, 100)}
                        {description.length > 100 && '...'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 12,
                    paddingBottom: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={toggleDescription}
                    style={[styles.smallActionButton, { backgroundColor: `${dominantColor}80` }]}
                  >
                    <Text style={styles.smallActionText}>Read more</Text>
                    <Feather name="chevron-down" size={14} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleLinkPress}
                    style={[styles.smallActionButton, { backgroundColor: dominantColor }]}
                  >
                    <Text style={styles.smallActionText}>Details</Text>
                    <Feather name="arrow-up-right" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );    
}

const styles = StyleSheet.create({
  profileImageWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImage: {
    borderWidth: 2,
    borderColor: "white",
  },
  nameContainer: {
    flex: 1,
    marginLeft: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxHeight: 72,
    overflow: 'hidden',
    marginBottom: 10,
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 32,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 0
  },
  bottomContainer: {
    padding: 16,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  aboutTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 8
  },
  aboutText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8
  },
  expandedCardImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 0,
  },
  expandedTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  expandedDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  smallCloseButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  smallActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  smallActionText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  }
});
