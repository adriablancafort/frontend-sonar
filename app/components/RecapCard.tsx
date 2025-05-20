import React, { useEffect, useRef } from 'react';
import { Text, Animated, View } from 'react-native';

interface RecapProps {
  title: string;
  percent: number;
  delay: number;
  color: string;
  frase: string;
}

export default function RecapCard({
  title,
  percent,
  frase,
  delay,
  color
}: RecapProps) {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        speed: 4,
        bounciness: 8,
        delay,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true
      }),
      Animated.spring(scale, {
        toValue: 1,
        speed: 2,
        bounciness: 6,
        delay,
        useNativeDriver: true
      })
    ]).start();
  }, [delay, translateY, opacity, scale]);

  return (
    <Animated.View
      className="flex-1 justify-center items-center w-full p-6"
      style={{ 
        backgroundColor: color,
        transform: [{ translateY }, { scale }], 
        opacity 
      }}
    >
      <View className="items-center">
        <Text className="text-5xl text-white font-bold mb-2">
          {Math.round(percent)}%
        </Text>
        <Text className="text-3xl text-white font-semibold capitalize mb-3">
          {title}
        </Text>
        <Text className="text-base text-white text-center px-6 opacity-90">
          {frase}
        </Text>
      </View>

      {/* Decorative elements */}
      <View className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white opacity-10" />
      <View className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white opacity-10" />
    </Animated.View>
  );
}