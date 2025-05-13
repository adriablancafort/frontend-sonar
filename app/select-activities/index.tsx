import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { getActivities, submitEssentialActivities } from '@/app/lib/api';
import { Activity } from '@/app/lib/types';
import ActivityCard from '@/app/components/ActivityCard';

export default function SelectActivitiesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  
  useEffect(() => {
    (async () => {
      const data = await getActivities();
      setActivities(data);
      setLoading(false);
    })();
  }, []);
  
  const toggleActivitySelection = (activityId: number) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const handleNextPress = async () => {
    try {
      if (selectedActivities.length > 0) {
        await submitEssentialActivities(selectedActivities);
      }
      router.push('/swipes');
    } catch (error) {
      console.error('Error submitting activities:', error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View className="px-5 pt-12 pb-4">
        <Text className="text-white text-3xl font-bold mb-2">
          Essential Activities
        </Text>
        <Text className="text-[rgba(255,255,255,0.8)] text-base mb-4">
          Select activities you want included in your schedule
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="mt-4 text-white text-base">Loading activities...</Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              selected={selectedActivities.includes(activity.id)}
              onPress={() => toggleActivitySelection(activity.id)}
            />
          ))}
        </ScrollView>
      )}

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
            className="bg-yellow-400 py-3 px-6 rounded-full flex-row items-center shadow-lg"
            onPress={handleNextPress}
          >
            <Text className="text-lg font-semibold text-black mr-2">Next</Text>
            <Feather name="chevron-right" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
