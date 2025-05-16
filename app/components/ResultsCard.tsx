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
  Linking,
  ScrollView
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
        style={[
          styles.cardContainer,
          { 
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity
          }
        ]}
      >
        {/* Glow effect */}
        <Animated.View 
          style={[
            styles.glowEffect,
            { 
              backgroundColor: darkColor,
              opacity: glowOpacity,
              shadowColor: dominantColor
            }
          ]} 
        />
        
        {/* Card content with blur */}
        <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={toggleExpand}
            style={[
              styles.cardContent,
              { borderColor: `${dominantColor}40`, backgroundColor: `${darkColor}40` }
            ]}
          >
            {!expanded ? (
              // Collapsed view
              <View style={styles.rowContainer}>
                {/* Image */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={[
                      styles.image,
                      { borderColor: dominantColor, borderWidth: 0 }
                    ]}
                    resizeMode="cover"
                  />
                </View>
                
                {/* Content */}
                <View style={styles.contentContainer}>
                  <Text style={styles.title} numberOfLines={1}>{title}</Text>
                  <Text style={styles.description} numberOfLines={3}>{description}</Text>

                  
                  <View style={styles.scheduleRow}>
                    <View style={styles.scheduleCodeContainer}>
                      <View style={[styles.schedulePill, { borderColor: `${dominantColor}40`, backgroundColor: `${darkColor}BB` }]}>
                        <Text style={styles.dotsText}>{getDayDots(day).join(' ')}</Text>
                        
                        <View style={[styles.iconPill, { borderColor: `${dominantColor}40`, backgroundColor: `${darkColor}CC` }]}>
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
                      style={[styles.chevronButton, { backgroundColor: `${darkColor}BB`, borderColor: `${dominantColor}40` }]}
                    >
                      <Feather name="chevron-down" size={16} color="white" />
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            ) : (
              // Expanded view
              <View style={styles.expandedContainer}>
                {/* Full width image */}
                <Image
                  source={{ uri: imageUri }}
                  style={styles.expandedImage}
                  resizeMode="cover"
                />
                
                {/* Content overlay with gradient */}
                <View style={styles.expandedContentContainer}>
                  <View style={[styles.expandedTitleBar]}>
                    <Text style={styles.expandedTitle}>{title}</Text>
                    
                    <TouchableOpacity 
                      onPress={toggleExpand}
                      style={[styles.closeButton, { backgroundColor: dominantColor }]}
                    >
                      <Feather name="chevron-up" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Time and schedule badges */}
                  <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: `${dominantColor}CC` }]}>
                      <Feather name="clock" size={14} color="white" />
                      <Text style={styles.badgeText}>{timeInfo}</Text>
                    </View>
                    
                    <View style={[styles.badge, { backgroundColor: `${dominantColor}CC` }]}>
                      <Feather name="calendar" size={14} color="white" />
                      <Text style={styles.badgeText}>{schedule}</Text>
                    </View>
                  </View>
                  
                  {/* Full description */}
                  <View style={styles.expandedDescriptionContainer}>
                    <Text style={styles.expandedDescription}>{description}</Text>
                  </View>
                  
                  {/* Action buttons */}
                  <View
                    style={styles.actionButtonsContainer}
                  >
                    <TouchableOpacity 
                      onPress={() => Linking.openURL( activityUri )}
                      style={[styles.actionButton, { backgroundColor: darkColor }]}
                    >
                      <Feather name="info" size={16} color="white" />
                      <Text style={styles.actionButtonText}>More Info</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: dominantColor }]}
                    >
                      <Feather name="calendar" size={16} color="white" />
                      <Text style={styles.actionButtonText}>Add to Schedule</Text>
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
        <View className="mb-8 w-full">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="w-full"
            contentContainerStyle={{ 
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {tags.map((tag, index) => (
              <View 
                key={index} 
                className="py-1 px-3 rounded-full mr-2"
                style={{ 
                  backgroundColor: `${darkColor}CC`,
                  borderColor: `${dominantColor}40`, 
                  borderWidth: 2 
                }}
              >
                <Text className="text-white text-s">{tag}</Text>
              </View>
            ))}
          </ScrollView>
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
    fontSize: 14,
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