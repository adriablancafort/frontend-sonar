import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { getActivities, submitEssentialActivities } from '@/app/lib/api';
import { Activity } from '@/app/lib/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Walkthroughable components
const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchable = walkthroughable(TouchableOpacity);

function SelectActivitiesScreen(props) {
  const { start, copilotEvents } = props;
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstRender, setFirstRender] = useState(true);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (firstRender) {
      // Start animations
      headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
      contentOpacity.value = withTiming(1, { 
        duration: 800, 
        easing: Easing.out(Easing.cubic) 
      });
      setFirstRender(false);
    }
  }, [firstRender]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getActivities();
        setActivities(data);
        setLoading(false);
        
        // Start the tour after data is loaded and animations are complete
        setTimeout(() => {
          start();
        }, 1000);
      } catch (error) {
        console.error('Failed to load activities:', error);
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up copilot event listeners to handle scrolling
    copilotEvents.on('stepChange', handleStepChange);
    
    return () => {
      copilotEvents.off('stepChange', handleStepChange);
    };
  }, []);
  
  // Handle scrolling to the focused element during tutorial
  const handleStepChange = (step) => {
    if (step.name === 'activityStep' && scrollViewRef.current) {
      // Find the index of the activity being highlighted
      const activityIndex = filteredActivities.findIndex(
        activity => activity.id === parseInt(step.name.split('-')[1])
      );
      
      if (activityIndex !== -1) {
        // Calculate approximate position and scroll there
        scrollViewRef.current.scrollTo({ 
          y: activityIndex * 120, // Approximate height of each card
          animated: true 
        });
      }
    }
  };
  
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(normalizedQuery)
    );
  }, [activities, searchQuery]);
  
  const toggleActivitySelection = (activityId) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const handleNextStep = async () => {
    try {
      if (selectedActivities.length > 0) {
        await submitEssentialActivities(selectedActivities);
      }
      router.push('/swipes');
    } catch (error) {
      console.error('Error submitting activities:', error);
      // Handle error (show toast, etc)
    }
  };
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: withTiming(headerOpacity.value * 0, { duration: 600 }) }]
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: withTiming((1 - contentOpacity.value) * 20, { duration: 800 }) }]
    };
  });

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading activities...</Text>
            </View>
          ) : (
            <>
              <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <Text style={styles.title}>Essential Activities</Text>
                <Text style={styles.subtitle}>
                  Select activities you want to be included in your schedule no matter what.
                </Text>
                
                <CopilotStep
                  text="Search for specific activities using keywords"
                  order={1}
                  name="searchStep"
                >
                  <WalkthroughableView style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#CCC" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search activities..."
                      placeholderTextColor="#999"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => setSearchQuery('')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.clearButton}
                      >
                        <Feather name="x-circle" size={18} color="#AAA" />
                      </TouchableOpacity>
                    )}
                  </WalkthroughableView>
                </CopilotStep>
              </Animated.View>
              
              <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
                <ScrollView 
                  ref={scrollViewRef}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 160 }}
                >
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity, index) => (
                      <CopilotStep
                        text="Tap an activity card to mark it as essential for your schedule"
                        order={index === 0 ? 2 : null} // Only first card is part of the walkthrough
                        name={`activityStep-${activity.id}`}
                        key={activity.id}
                      >
                        <WalkthroughableTouchable
                          onPress={() => toggleActivitySelection(activity.id)}
                          style={[
                            styles.activityCard,
                            selectedActivities.includes(activity.id) && styles.selectedActivityCard
                          ]}
                          activeOpacity={0.7}
                        >
                          <View style={styles.activityContent}>
                            <View style={styles.activityTitleContainer}>
                              <Text style={styles.activityTitle}>{activity.title}</Text>
                              <Text style={styles.activityDescription} numberOfLines={2}>
                                {activity.description || "No description available"}
                              </Text>
                            </View>
                            
                            <View style={styles.selectionIndicator}>
                              {selectedActivities.includes(activity.id) ? (
                                <MaterialIcons name="check-circle" size={28} color="#FFD700" />
                              ) : (
                                <View style={styles.unselectedCircle} />
                              )}
                            </View>
                          </View>
                          
                          {activity.tags && activity.tags.length > 0 && (
                            <View style={styles.tagContainer}>
                              {activity.tags.map((tag, tagIndex) => (
                                <View key={tagIndex} style={styles.tag}>
                                  <Text style={styles.tagText}>{tag}</Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </WalkthroughableTouchable>
                      </CopilotStep>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <MaterialIcons name="search-off" size={48} color="#666" />
                      <Text style={styles.emptyText}>No activities found</Text>
                      <Text style={styles.emptySubtext}>Try a different search term</Text>
                    </View>
                  )}
                </ScrollView>
              </Animated.View>

              <View style={styles.bottomContainer}>
                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0.8)',
                    'rgba(0,0,0,0.95)',
                    'rgba(0,0,0,1)'
                  ]}
                  locations={[0, 0.3, 0.5, 0.8]}
                  style={styles.gradient}
                />
                
                <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom + 8, 20) }]}>
                  <View style={styles.selectionInfoContainer}>
                    <Text style={styles.selectionInfoText}>
                      {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
                    </Text>
                  </View>
                  
                  <CopilotStep
                    text="Tap Next when you've selected your essential activities"
                    order={3}
                    name="nextButtonStep"
                  >
                    <WalkthroughableTouchable 
                      style={[
                        styles.nextButton,
                        selectedActivities.length === 0 && styles.disabledButton
                      ]}
                      onPress={handleNextStep}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Feather name="chevron-right" size={20} color="black" />
                    </WalkthroughableTouchable>
                  </CopilotStep>
                </View>
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CCC',
    fontSize: 16,
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 20,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: 50,
  },
  clearButton: {
    padding: 4,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectedActivityCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  activityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityTitleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#AAA',
    lineHeight: 20,
  },
  selectionIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#CCC',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#CCC',
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    height: 160,
    width: '100%',
    bottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  selectionInfoContainer: {
    paddingVertical: 8,
  },
  selectionInfoText: {
    color: '#CCC',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  disabledButton: {
    backgroundColor: '#555',
    shadowColor: 'transparent',
  },
});

// Properly wrap the component with copilot HOC with correct options
export default copilot({
  animated: true, // enables animations
  overlay: 'svg', // use SVG for overlay
  tooltipStyle: {
    backgroundColor: '#F7D633',
    borderRadius: 10,
  },
  tooltipComponent: props => (
    <View style={{
      backgroundColor: '#F7D633',
      borderRadius: 10,
      padding: 16,
      maxWidth: 300,
    }}>
      <Text style={{
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
      }}>
        {props.currentStep.text}
      </Text>
    </View>
  ),
  stepNumberComponent: () => null, // Hide step numbers
  maskColor: 'rgba(0, 0, 0, 0.8)', // Overlay color
})(SelectActivitiesScreen);