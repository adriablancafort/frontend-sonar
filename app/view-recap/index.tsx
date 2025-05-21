import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { Recap } from '@/app/lib/types';
import { getRecap } from '@/app/lib/api'; 
import RecapCard from '@/app/components/RecapCard'

export default function ShowRecap() {
    const [recap, setRecap] = useState<Recap[]>([]);
    const [loading, setLoading] = useState(true);
    const colors = ['#d87c2f', '#e0a269', '#a65f25'];
    
    useEffect(() => {
    (async () => {
        const data = await getRecap();
        setRecap(data);
        setLoading(false);
    })();
    }, []);

    const handleNextStep = async () => {
        router.push('/view-results');
    };

    return (
        <>
            {/* Gradient overlay and button */}
            <View className="absolute bottom-0 left-0 right-0 z-10">
                <LinearGradient
                colors={[
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,1)'
                ]}
                locations={[0, 0.8]}
                style={{
                    position: 'absolute',
                    height: 150, // Increased height to accommodate two buttons
                    width: '100%',
                    bottom: 0
                }}
                />
                <View className="items-center pb-10 pt-4">
                    <Link href="/view-results" asChild>
                        <TouchableOpacity
                            className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center mb-4 shadow-lg"
                        >
                            <Text className="font-semibold text-xl mr-1 text-black">View schedule</Text>
                            <Feather name="chevron-right" size={22} color="black" />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            <View className='flex-row items-center justify-between px-4 pt-20'>
                <View className='flex-1 px-4'>
                    <Text className="text-white text-3xl font-bold text-center">Your profile</Text>
                </View>

                {/* Empty View for balanced spacing */}
                <View style={{ width: 40 }} />
            </View>

            <SafeAreaView className="flex-1">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                ) : (
                    <>
                        {/* Container for absolutely positioned cards */}
                        <View className="flex-1 relative mt-4">
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

                        {/* Gradient overlay and button */}
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
                            
                            <View className="items-center pb-20 pt-2">
                                <TouchableOpacity
                                    className="bg-yellow-400 py-3 pl-8 pr-5 rounded-full flex-row items-center"
                                    onPress={handleNextStep}
                                >
                                    <Text className="font-semibold text-xl mr-1">Next</Text>
                                    <Feather name="chevron-right" size={22} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </SafeAreaView>
        </>
    )
}