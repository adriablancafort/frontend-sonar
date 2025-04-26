import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

export default function SelectShedule() {
  return (
    <View>
      <Text>Select Schedule</Text>
      <Link href="/select-tags">Next</Link>
    </View>
  )
}
