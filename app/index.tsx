import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

export default function StartScreen() {
  return (
    <View>
      <Text>Start</Text>
      <Link href="/select-schedule">Start</Link>
    </View>
  )
}