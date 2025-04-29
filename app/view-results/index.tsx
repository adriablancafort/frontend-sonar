import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ResultsCard from '@/app/components/ResultsCard';
import { Result } from '@/app/lib/types';
import { getResults } from '@/app/lib/api';

export default function ViewResults() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getResults();
      setResults(data);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      {loading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      ) : (
        <View className="flex-1 items-center">
          <ScrollView className="flex-1 px-4 w-full">
            {results.map((result) => (
              <ResultsCard
                key={result.id}
                title={result.title}
                description={result.description}
                schedule={result.schedules.title}
                startTime={result.start_time}
                endTime={result.end_time}
                imageUri={result.image_uri}
              />
            ))}
            <View style={{ height: 110 }} />
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
              <Link href="/" asChild>
                <TouchableOpacity className="bg-yellow-400 disabled:bg-neutral-500 py-3 px-8 rounded-full flex-row items-center">
                  <Text className="font-semibold text-xl">Start Again</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
