import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
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
        setLoading(false);
    })();
    }, []);

    const handleNextStep = async () => {
        router.push('/view-results');
    };

    return (
        <>  
            {/* Title */}

            <View className="flex-row items-center px-4 absolute top-20 left-0 right-0 z-50">
                <TouchableOpacity 
                    className="p-2"
                    onPress={() => router.back()}
                >
                    <Feather name="chevron-left" size={28} color="white" />
                </TouchableOpacity>

                <View className="flex-1">
                    <Text className="text-white text-3xl font-bold text-center">
                        Your profile!
                    </Text>
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

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 16
  }
});