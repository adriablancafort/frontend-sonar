import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import ResultsCard from '@/app/components/ResultsCard';
import { Result } from '@/app/lib/types';
import { getResults } from '@/app/lib/api';

export default function ViewResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const backgroundTranslateY = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -100],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    (async () => {
      const data = await getResults();
      setResults(data);
      setLoading(false);
    })();
  }, []);

  const handleNextStep = async () => {
    router.push('/recap');
  };

  return (
    <View className="flex-1 bg-black">
      <Animated.View
        className="absolute top-0 left-0 right-0"
        style={{ transform: [{ translateY: backgroundTranslateY }] }}
      >
        <ImageBackground
          source={require('@/assets/images/background-results.jpg')}
          className="flex-1 w-full h-full"
          style={{ minHeight: Dimensions.get('window').height * 2 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            className="absolute top-0 left-0 right-0 bottom-0"
          />
        </ImageBackground>
      </Animated.View>
  
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <View className="px-5 pt-3 pb-4 mb-3 justify-centered">
          <Text className="text-3xl font-bold text-white mb-2">Results</Text>
        </View>
  
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="mt-4 text-white text-base">Finding perfect matches...</Text>
          </View>
        ) : (
          <View className="flex-1">
            <Animated.ScrollView
              className="px-4 pt-2"
              contentContainerStyle={{paddingHorizontal: 16, paddingTop: 8}}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            >
              {results.map((result) => (
                <ResultsCard
                  key={result.id}
                  title={result.title}
                  description={result.description}
                  schedule={result.schedules.title}
                  startTime={result.start_time}
                  endTime={result.end_time}
                  imageUri={result.image_uri}
                  dominantColor={result.dominant_color}
                  darkColor={result.dark_color}
                  pastelColor={result.pastel_color}
                  activityUri={result.activity_uri}
                  tags={result.tags}
                />
              ))}
              <View className="h-[120px]" />
            </Animated.ScrollView>

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
                  height: 130,
                  width: '100%',
                  bottom: 0
                }}
              />
              <View className="items-center pb-20 pt-2">
                <TouchableOpacity
                  className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center"
                  onPress={handleNextStep}
                >
                  <Text className="font-semibold text-xl mr-1">Next</Text>
                  <Feather name="chevron-right" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
          
        )}
      </SafeAreaView>
      
    </View>
  );
}
