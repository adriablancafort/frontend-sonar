import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

export default function SelectTags() {
  return (
    <View>
      <Text>Select Tags</Text>
      <Link href="/select-activities">Next</Link>
    </View>
  )
}
