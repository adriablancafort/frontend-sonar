import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getActivities, submitEssentialActivities } from '@/app/lib/api';
import { Activity } from '@/app/lib/types';
import ActivityCard from '@/app/components/ActivityCard';

export default function SelectActivitiesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    (async () => {
      const data = await getActivities();
      setActivities(data);
      setLoading(false);
    })();
  }, []);
  
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(normalizedQuery)
    );
  }, [activities, searchQuery]);
  
  const toggleActivitySelection = (activityId: number) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const handleNextStep = async () => {
    if (selectedActivities.length > 0) {
      await submitEssentialActivities(selectedActivities);
    }
    router.push('/swipes');
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        ) : (
          <>
            <View className='px-8'>
              <Text className="text-neutral-300 text-xl mb-4">
                Select if there are activities you want to be included in your schedule no matter what.
              </Text>
              
              <View className="bg-gray-800 rounded-xl flex-row items-center h-16 px-4 mb-4">
                <Feather name="search" size={22} color="white" style={{ marginRight: 10 }} />
                <TextInput
                  className="flex-1 text-white text-xl"
                  placeholder="Search activities..."
                  placeholderTextColor="white"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ 
                    height: 50,
                    textAlignVertical: 'center',
                    lineHeight: 22,
                    includeFontPadding: false,
                    paddingTop: 0,
                    paddingBottom: 0
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSearchQuery('')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="x" size={22} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <ScrollView 
              className="flex-1 px-8"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 160 }}
            >
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    selected={selectedActivities.includes(activity.id)}
                    onPress={() => toggleActivitySelection(activity.id)}
                  />
                ))
              ) : (
                <View className="flex-1 items-center justify-center py-10">
                  <Text className="text-gray-300 text-lg">No activities found</Text>
                </View>
              )}
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0">
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.7)',
                  'rgba(0,0,0,0.97)',
                  'rgba(0,0,0,1)'
                ]}
                locations={[0, 0.2, 0.4, 0.8]}
                style={{
                  position: 'absolute',
                  height: 160,
                  width: '100%',
                  bottom: 0
                }}
              />
              
              <View className="items-center pb-20 pt-4">
                <TouchableOpacity 
                  className="bg-yellow-400 disabled:bg-neutral-500 py-3 pl-8 pr-5 rounded-full flex-row items-center"
                  onPress={handleNextStep}
                >
                  <Text className="font-semibold text-xl mr-1">Next</Text>
                  <Feather name="chevron-right" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
