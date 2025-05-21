import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, ActivityIndicator, Linking, StyleSheet, SafeAreaView, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { Recap } from '@/app/lib/types';
import { getRecap } from '@/app/lib/api'; 
import RecapCard from '@/app/components/RecapCard'

export default function ShowRecap() {
    const router = useRouter();
    const [recap, setRecap] = useState<Recap[]>([]);
    const [loading, setLoading] = useState(true);
    const colors = ['#d87c2f', '#e0a269', '#a65f25'];
    
    useEffect(() => {
    (async () => {
        const data = await getRecap();
        setRecap(data);
        console.log(data)
        setLoading(false);
    })();
    }, []);

    return (
        <>
            {/* Gradient overlay and button */}
            <View className="absolute bottom-0 left-0 right-0">
                <LinearGradient
                colors={[
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,1)'
                ]}
                locations={[0, 0.8]}
                style={{
                    position: 'absolute',
                    height: 100,
                    width: '100%',
                    bottom: 0
                }}
                />
                <View className="items-center pb-10 pt-2">
                    <Link href="/" asChild>
                        <TouchableOpacity className="bg-[#FFD700] py-3 px-6 rounded-full flex-row items-center shadow-lg">
                            <Feather name="refresh-cw" size={20} color="#000" style={{ marginRight: 8 }} />
                            <Text className="text-lg font-semibold text-black">Start Again</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            <View className='flex-row items-center justify-between px-4 pt-20'>
                <TouchableOpacity 
                    className="p-2"
                    onPress={() => router.back()}
                >
                    <Feather name="chevron-left" size={28} color="white" />
                </TouchableOpacity>

                <View className='flex-1 px-4'>
                    <Text className="text-white text-3xl font-bold text-center">What tells about you</Text>
                </View>
                
                {/* This empty view maintains balance in the flex row */}
                <View className="w-10" />
            </View>
            
            <SafeAreaView className="flex-1">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                ) : (
                    <>
                        {/* Container for absolutely positioned cards */}
                        <View style={styles.cardsContainer}>
                            {recap.map((item, index) => (
                                <RecapCard
                                    key={item.id}
                                    title={item.title}
                                    percent={item.percentage}
                                    frase={item.frase}
                                    color={colors[index % colors.length]}
                                    delay={index * 300}
                                    index={index}
                                />
                            ))}
                        </View>
                    </>
                )}
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 16
  }
});