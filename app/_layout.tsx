import { Stack } from "expo-router";
import '../global.css';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaView>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
