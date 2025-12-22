import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { AuthResponse } from '../types';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors, isDark } = useThemeColors();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t('common.error'), 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<AuthResponse>('/staff/login', { email, password });
            await login(response.data.staff, response.data.token);
        } catch (error: any) {
            console.error(error);
            Alert.alert(t('common.error'), error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const iconColor = isDark ? '#9ca3af' : '#64748b';
    const placeholderColor = isDark ? "#64748b" : "#94a3b8";

    return (
        <View className="flex-1 bg-background justify-center p-6">
            <View className="items-center mb-10">
                <View className="w-20 h-20 bg-surface rounded-full justify-center items-center mb-4 shadow-sm border border-border">
                    <Text className="text-4xl">🍽️</Text>
                </View>
                <Text className="text-3xl font-bold text-primary mb-2">{t('common.welcome')}</Text>
                <Text className="text-base text-secondary">{t('auth.login')}</Text>
            </View>

            <View className="gap-4">
                <View className="flex-row items-center bg-surface rounded-xl px-4 h-14 border border-border">
                    <Mail size={20} color={iconColor} style={{ marginRight: 12 }} />
                    <TextInput
                        className="flex-1 text-base text-primary"
                        placeholder={t('auth.email')}
                        placeholderTextColor={placeholderColor}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View className="flex-row items-center bg-surface rounded-xl px-4 h-14 border border-border">
                    <Lock size={20} color={iconColor} style={{ marginRight: 12 }} />
                    <TextInput
                        className="flex-1 text-base text-primary"
                        placeholder={t('auth.password')}
                        placeholderTextColor={placeholderColor}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-yellow h-14 rounded-xl justify-center items-center shadow-lg shadow-yellow/20 mt-2 active:opacity-90 active:scale-[0.98]"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <View className="flex-row items-center">
                            <LogIn size={20} color="#000" style={{ marginRight: 8 }} />
                            <Text className="text-lg font-bold text-black">{t('auth.login')}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => (navigation as any).navigate('Signup')}
                    className="active:opacity-70"
                >
                    <Text className="text-center text-secondary mt-4">
                        New Staff? <Text className="text-yellow font-bold hover:underline">{t('auth.signup')}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
