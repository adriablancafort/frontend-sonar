import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Animated, 
  StyleSheet, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  Linking
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
// or FontAwesome5 for more refined icons
import { FontAwesome5 } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface ResultsCardProps {
  title: string;
  description: string;
  imageUri: string;
  startTime: string;
  endTime: string;
  schedule: string;
  dominantColor?: string;
  darkColor?: string;
  pastelColor?: string;
  activityUri: string;
  tags: string[];
}

export default function ResultsCard({
  title,
  description,
  imageUri,
  startTime,
  endTime,
  schedule,
  dominantColor = "#7a85ff", 
  darkColor = "#282850",
  pastelColor = "#b4b8ff",
  activityUri = "https://sonar.es/es/actividad/alizzz-presents-conduccion-temeraria",
  tags = ['ballena', 'música', 'intercon'],
}: ResultsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [day, timeOfDay] = schedule.split(' ');

  // Map day to dot pattern
  const getDayDots = (day: string) => {
    switch (day.toLowerCase()) {
      case 'thursday':
        return ['●', '○', '○'];
      case 'friday':
        return ['●', '●', '○'];
      case 'saturday':
        return ['●', '●', '●'];
      default:
        return ['○', '○', '○'];
    }
  };

  // Map time to icon
  const getTimeIcon = (time: string) => {
    return time.toLowerCase() === 'night' ? 'moon' : 'sun';
  };
  
  const formatTimeDisplay = () => {
    let timeDisplay = '';
    if (startTime) {
      const formattedStartTime = startTime.substring(0, 5);
      timeDisplay = formattedStartTime;
      if (endTime) {
        const formattedEndTime = endTime.substring(0, 5);
        timeDisplay += ` - ${formattedEndTime}`;
      }
    }
    return timeDisplay;
  };

  const toggleExpand = () => {
    // Card press animation
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    // Configure layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const timeInfo = formatTimeDisplay();

  // For the glowing effect
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  React.useEffect(() => {
    // Create pulsing glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in card when mounted
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <>
      <Animated.View 
        className="mx-4 my-2 shadow-lg rounded-xl"
        style={{ 
          transform: [{ scale: animatedScale }],
          opacity: animatedOpacity
        }}
      >
        {/* Glow effect */}
        <Animated.View 
          className="absolute inset-0 rounded-xl"
          style={{ 
            backgroundColor: darkColor,
            opacity: glowOpacity,
            shadowColor: dominantColor,
            shadowRadius: 20,
            shadowOpacity: 0.8
          }} 
        />
        
        {/* Card content with blur */}
        <BlurView intensity={40} tint="dark" className="overflow-hidden rounded-3xl">
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={toggleExpand}
            className="overflow-hidden"
            style={{ 
              borderColor: `${dominantColor}40`, 
              backgroundColor: `${darkColor}40`,
              borderWidth: 1
            }}
          >
            {!expanded ? (
              // Collapsed view
              <View className="flex-row p-3">
                {/* Image */}
                <View className="w-20 h-20 mr-3 justify-center">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full rounded-2xl"
                    style={{ 
                      borderColor: dominantColor, 
                      borderWidth: 0 
                    }}
                    resizeMode="cover"
                  />
                </View>
                
                {/* Content */}
                <View className="flex-1">
                  <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>{title}</Text>
                  <Text className="text-gray-300 text-sm mb-2" numberOfLines={3}>{description}</Text>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <View 
                        className="flex-row items-center py-1 px-2 rounded-full"
                        style={{ 
                          borderColor: `${dominantColor}40`, 
                          backgroundColor: `${darkColor}BB`,
                          borderWidth: 1
                        }}
                      >
                        <Text className="text-white text-xs mr-2">{getDayDots(day).join(' ')}</Text>
                        
                        <View 
                          className="w-5 h-5 rounded-full items-center justify-center ml-auto"
                          style={{ 
                            borderColor: `${dominantColor}40`, 
                            backgroundColor: `${darkColor}CC`,
                            borderWidth: 1
                          }}
                        >
                          <FontAwesome5
                            name={getTimeIcon(timeOfDay)}
                            size={12}
                            color="white"
                          />
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity 
                      onPress={toggleExpand}
                      className="w-7 h-7 rounded-full items-center justify-center ml-2"
                      style={{ 
                        backgroundColor: `${darkColor}BB`, 
                        borderColor: `${dominantColor}40`,
                        borderWidth: 1
                      }}
                    >
                      <Feather name="chevron-down" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              // Expanded view
              <View className="w-full">
                {/* Full width image */}
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                
                {/* Content overlay with gradient */}
                <View className="p-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white font-bold text-lg">{title}</Text>
                    
                    <TouchableOpacity 
                      onPress={toggleExpand}
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ backgroundColor: dominantColor }}
                    >
                      <Feather name="chevron-up" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Time and schedule badges */}
                  <View className="flex-row mb-3">
                    <View className="flex-row items-center py-1 px-3 rounded-full mr-2" style={{ backgroundColor: `${dominantColor}CC` }}>
                      <Feather name="clock" size={14} color="white" />
                      <Text className="text-white text-xs ml-1">{timeInfo}</Text>
                    </View>
                    
                    <View className="flex-row items-center py-1 px-3 rounded-full" style={{ backgroundColor: `${dominantColor}CC` }}>
                      <Feather name="calendar" size={14} color="white" />
                      <Text className="text-white text-xs ml-1">{schedule}</Text>
                    </View>
                  </View>
                  
                  {/* Full description */}
                  <View className="mb-4">
                    <Text className="text-gray-300 text-sm">{description}</Text>
                  </View>
                  
                  {/* Action buttons */}
                  <View className="flex-row justify-between">
                    <TouchableOpacity 
                      onPress={() => Linking.openURL(activityUri)}
                      className="flex-row items-center py-2 px-4 rounded-full mr-2 flex-1 justify-center"
                      style={{ backgroundColor: darkColor }}
                    >
                      <Feather name="info" size={16} color="white" />
                      <Text className="text-white text-sm ml-2">More Info</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className="flex-row items-center py-2 px-4 rounded-full ml-2 flex-1 justify-center"
                      style={{ backgroundColor: dominantColor }}
                    >
                      <Feather name="calendar" size={16} color="white" />
                      <Text className="text-white text-sm ml-2">Add to Schedule</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      {/* Tags below the card */}
      {tags.length > 0 && (
        <View style={styles.tagContainerWrapper}>
          <View style={styles.tagContainer}>
            {tags.map((tag, index) => (
              <View 
                key={index} 
                style={[styles.tagPill, { backgroundColor: `${darkColor}CC` }, { borderColor: `${dominantColor}40`, borderWidth: 2 }]}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    transform: [{ scale: 1.02 }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  cardContent: {
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    // backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 100,
    marginRight: 14,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  expandIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 4,
  },
  
  // Expanded styles
  expandedContainer: {
    position: 'relative',
  },
  expandedImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  expandedContentContainer: {
    padding: 0,
  },
  expandedTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  expandedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  expandedDescriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  expandedDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 0,
    // borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, 
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 0
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxHeight: 72,
    overflow: 'hidden',
    marginBottom: 0,
  },
  tagContainerWrapper: {
    marginTop: -3,
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
    maxWidth: '90%',
    marginBottom: 20,
  },
  scheduleCodeContainer: {
    marginTop: 6,
    alignItems: 'flex-start',
  },
  
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    paddingRight: 0,
    paddingLeft: 15,
    // paddingHorizontal: 15,
    borderRadius: 100,
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.3)',
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dotsText: {
    color: 'white',
    fontSize: 14,
    letterSpacing: 2,
    marginRight: 10,
  },
  iconPill: {
    width: 30,
    height: 30,
    borderRadius: 100,
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  chevronButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  
});