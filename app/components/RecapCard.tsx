import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, View, StyleSheet, Dimensions, ImageBackground } from 'react-native';

interface RecapProps {
  title: string;
  percent: number;
  delay: number;
  color: string; // Keep for fallback
  frase: string;
  index: number;
}

// Constants for consistent sizing
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HEIGHTS = [425, 600, 700]; // Different heights for natural overlap

// Image sources - adjust these paths based on your actual file names
const getImageSource = (index: number) => {
  const imageMap = {
    0: require('@/assets/recap/layer3.png'), // Replace with your actual file names
    1: require('@/assets/recap/layer2.png'),
    2: require('@/assets/recap/layer1.png'),
  };
  return imageMap[index as keyof typeof imageMap] || imageMap[0];
};

// Text positioning for each card - adjust these values to fit your images
const getTextPosition = (index: number) => {
  const positions = {
    0: { 
      top: 80, 
      alignItems: 'center' as const,
      percentageStyle: { fontSize: 50, color: 'white', fontWeight: 'bold' },
      titleStyle: { fontSize: 50, fontWeight: 'bold', color: 'white', lineHeight: 50 }
    },
    1: { 
      top: 65, 
      alignItems: 'center' as const,
      percentageStyle: { fontSize: 40, color: 'white', fontWeight: 'bold' },
      titleStyle: { fontSize: 40, fontWeight: 'bold', color: 'white', lineHeight: 40 }
    },
    2: { 
      top: 30, 
      alignItems: 'center' as const,
      percentageStyle: { fontSize: 25, color: 'white', fontWeight: 'bold' },
      titleStyle: { fontSize: 25, fontWeight: 'bold', color: 'white', lineHeight: 30 }
    },
  };
  return positions[index as keyof typeof positions] || positions[0];
};

export default function RecapCard({
  title,
  percent,
  frase,
  delay,
  color,
  index
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

  const textPosition = getTextPosition(index);

  return (
    <Animated.View
      style={[ 
        styles.container,
        { 
          transform: [{ translateY }, { scale }], 
          opacity,
          height: CARD_HEIGHTS[index % CARD_HEIGHTS.length],
          zIndex: 3 - index // Ensures proper stacking order
        }
      ]}
    >
      <ImageBackground 
        source={getImageSource(index)}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Text overlay positioned in visible area */}
        <View style={[
          styles.textContainer, 
          {
            top: textPosition.top,
            alignItems: textPosition.alignItems
          }
        ]}>
          <Text style={[textPosition.percentageStyle]}>
            {Math.round(percent)}%
          </Text>
          <Text style={[textPosition.titleStyle]}>
            {title}
          </Text>
          {/* <Text style={styles.fraseText}>
            {frase}
          </Text> */}
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0, // All cards start from the bottom
    left: 0,
    right: 0
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  percentageText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  titleText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  fraseText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
});