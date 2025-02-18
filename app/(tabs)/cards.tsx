import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';

const DUMMY_DATA = [
  { id: 1, title: 'Card 1', color: '#A1CEDC' },
  { id: 2, title: 'Card 2', color: '#FFB6C1' },
  { id: 3, title: 'Card 3', color: '#98FB98' },
  { id: 4, title: 'Card 4', color: '#DDA0DD' },
];

export default function CardsScreen() {
  const [cards, setCards] = useState(DUMMY_DATA);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    setCards((prev) => prev.slice(1));
  }, []);

  const handleReload = useCallback(() => {
    setCards(DUMMY_DATA);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.cardsContainer}>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <Card
                key={card.id}
                data={card}
                onSwipe={handleSwipe}
                isFirst={index === 0}
                swipeEnabled={index === 0}
                style={[
                  styles.card,
                  {
                    transform: [{ scale: 1 - index * 0.05 }],
                    top: -index * 10,
                    zIndex: cards.length - index,
                  },
                ]}
              />
            ))
          ) : (
            <ThemedView style={styles.emptyStateContainer}>
              <ThemedText type="title">No more cards!</ThemedText>
              <TouchableOpacity onPress={handleReload} style={styles.reloadButton}>
                <ThemedText type="defaultSemiBold">Reload Cards</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  card: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  emptyStateContainer: {
    alignItems: 'center',
    gap: 20,
  },
  reloadButton: {
    padding: 16,
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
  },
});
