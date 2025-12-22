import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/useThemeStore';

export default function SignupScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { theme } = useThemeStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jobTitle, setJobTitle] = useState('waiter');
    const [loading, setLoading] = useState(false);

    const isDark = theme === 'dark';
    const iconColor = isDark ? '#9ca3af' : '#64748b';

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert(t('common.error'), "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await api.post('/staff/register', { name, email, password, jobTitle });
            Alert.alert(t('common.success'), "Account created! Please login.");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert(t('common.error'), error.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background p-6 justify-center">
            <Text className="text-3xl font-bold text-primary mb-8 text-center">{t('auth.signup')}</Text>

            <View className="gap-4">
                <View className="flex-row items-center bg-surface rounded-xl px-4 h-14 border border-border">
                    <User size={20} color={iconColor} style={{ marginRight: 12 }} />
                    <TextInput
                        className="flex-1 text-base text-primary"
                        placeholder={t('profile.name')}
                        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View className="flex-row items-center bg-surface rounded-xl px-4 h-14 border border-border">
                    <Mail size={20} color={iconColor} style={{ marginRight: 12 }} />
                    <TextInput
                        className="flex-1 text-base text-primary"
                        placeholder={t('auth.email')}
                        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
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
                        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View className="mt-2.5">
                    <Text className="text-base mb-2 text-primary font-semibold">I am a:</Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className={`flex-1 p-3 rounded-lg border items-center ${jobTitle === 'waiter' ? 'bg-yellow border-yellow' : 'bg-surface border-border'}`}
                            onPress={() => setJobTitle('waiter')}
                        >
                            <Text className={`font-bold ${jobTitle === 'waiter' ? 'text-black' : 'text-secondary'}`}>Waiter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 p-3 rounded-lg border items-center ${jobTitle === 'chef' ? 'bg-yellow border-yellow' : 'bg-surface border-border'}`}
                            onPress={() => setJobTitle('chef')}
                        >
                            <Text className={`font-bold ${jobTitle === 'chef' ? 'text-black' : 'text-secondary'}`}>Chef</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-yellow h-14 rounded-xl justify-center items-center mt-4"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#000" /> : <Text className="text-black text-lg font-bold">{t('auth.signup')}</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-secondary text-center mt-4">Already have an account? <Text className="text-yellow hover:underline">{t('auth.login')}</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
