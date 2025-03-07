import { View, StyleSheet } from 'react-native';
import Video from './components/Video';

export default function Home() {
  return (
    <View>
      <Video />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
