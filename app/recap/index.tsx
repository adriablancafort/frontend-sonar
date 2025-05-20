import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, StatusBar, Linking, StyleSheet, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { Recap } from '@/app/lib/types';
import { getRecap } from '@/app/lib/api'; 


export default function ShowRecap() {
    const router = useRouter();
    const [recap, setRecap] = useState<Recap[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    (async () => {
        const data = await getRecap();
        setRecap(data);
        setLoading(false);
    })();
    }, []);

    return (
        <View className="items-center pb-20 pt-4">
            <Link href="/" asChild>
                <TouchableOpacity className="bg-[#FFD700] py-3 px-6 rounded-full flex-row items-center shadow-lg">
                    <Feather name="refresh-cw" size={20} color="#000" style={{ marginRight: 8 }} />
                    <Text className="text-lg font-semibold text-black">Start Again</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}
