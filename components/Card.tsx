import { StyleSheet, ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';

const SWIPE_THRESHOLD = 100;

type CardData = {
  id: number;
  title: string;
  color: string;
};

type Props = {
  data: CardData;
  onSwipe: (direction: 'left' | 'right') => void;
  isFirst: boolean;
  swipeEnabled: boolean;
  style?: ViewStyle;
};

export function Card({ data, onSwipe, isFirst, swipeEnabled, style }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('right');
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('left');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-30, 0, 30],
      'clamp'
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const cardContent = (
    <Animated.View 
      style={[
        styles.card,
        { backgroundColor: data.color },
        rStyle,
        style,
      ]}
    >
      <ThemedText type="title" style={styles.cardText}>
        {data.title}
      </ThemedText>
    </Animated.View>
  );

  if (!swipeEnabled) {
    return cardContent;
  }

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      {cardContent}
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 400,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
  },
});
