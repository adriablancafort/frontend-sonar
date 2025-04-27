import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
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
    <View className="flex-1 bg-black items-center">
      {loading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 px-4 pt-24 w-full">
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
          </ScrollView>
          
          <Link href="/" asChild>
            <TouchableOpacity className="bg-yellow-400 py-2 px-6 mb-20 rounded-full flex-row items-center">
              <Text className="font-semibold text-lg">Start Again</Text>
            </TouchableOpacity>
          </Link>
        </>
      )}
    </View>
  );
}
