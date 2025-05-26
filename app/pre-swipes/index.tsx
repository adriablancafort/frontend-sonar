import { View, Text, TouchableOpacity, Animated, Easing, StatusBar, Platform } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function StartScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  // Animate the progress bar and navigate after 10 seconds
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000, // 10 seconds
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      router.push('/swipes');
    });
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const statusBarOffset = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View className="flex-1 justify-center items-center px-12 bg-black">
      {/* Progress Bar */}
      <Animated.View
        style={{
          position: 'absolute',
          top: statusBarOffset,
          left: 0,
          height: 4,
          backgroundColor: '#facc15',
          width: widthInterpolated,
        }}
      />

      <Text className="text-white text-3xl font-bold mb-5">
        Swipe through Activities
      </Text>

      <Text className="text-center text-neutral-300 text-xl mb-32">
        We'll show you short videos of different artists. Swipe right if you're interested, left if you're not - just like a dating app, but for concerts.
      </Text>

      <Link href="/swipes" asChild>
        <TouchableOpacity
          className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center mb-4 shadow-lg"
        >
          <Text className="font-semibold text-xl mr-1 text-black">Start Swiping</Text>
          <Feather name="chevron-right" size={22} color="black" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
