import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { AuthResponse } from '../types';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<AuthResponse>('/staff/login', { email, password });
            console.log('Login Response:', response.data);
            await login(response.data.user, response.data.token);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-100 justify-center">
            <View className="p-6">
                <View className="items-center mb-10">
                    <View className="w-20 h-20 bg-white rounded-full justify-center items-center mb-4 shadow-sm">
                        <Text className="text-4xl">🍽️</Text>
                    </View>
                    <Text className="text-3xl font-bold text-slate-700 mb-2">Welcome Back</Text>
                    <Text className="text-base text-gray-400">Sign in to continue</Text>
                </View>

                <View className="gap-4">
                    <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                        <Mail size={20} color="#666" style={{ marginRight: 12 }} />
                        <TextInput
                            className="flex-1 text-base text-slate-700"
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                        <Lock size={20} color="#666" style={{ marginRight: 12 }} />
                        <TextInput
                            className="flex-1 text-base text-slate-700"
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-red-400 h-14 rounded-xl justify-center items-center shadow-lg shadow-red-400/50 mt-2"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View className="flex-row items-center">
                                <LogIn size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text className="text-lg font-semibold text-white">Login</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => (navigation as any).navigate('Signup')}>
                        <Text className="text-center text-gray-400 mt-4">
                            New Staff? <Text className="text-red-400 font-bold">Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
