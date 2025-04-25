import React from 'react'
import { View, SafeAreaView, Text } from 'react-native'
import {GestureHandlerRootView } from 'react-native-gesture-handler'

const results = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <SafeAreaView className="flex-1 bg-white">
      <View>
        <Text>Select Tags</Text>
      </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default results