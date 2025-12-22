import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Switch } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Calendar, Moon, Sun } from 'lucide-react-native';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../store/useThemeStore';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '../hooks/useThemeColors';

export default function ProfileScreen() {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const { toggleTheme } = useThemeStore();
    const { toggleColorScheme } = useColorScheme();
    const { isDark, colors } = useThemeColors();

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isEditing, setIsEditing] = useState(false);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    ];

    const changeLanguage = async (langCode: string) => {
        try {
            await i18n.changeLanguage(langCode);
            await AsyncStorage.setItem('user-language', langCode);
        } catch (e) {
            console.error('Failed to change language', e);
        }
    };

    const handleThemeToggle = () => {
        toggleTheme();
        toggleColorScheme();
    };

    const handleSaveProfile = () => {
        Alert.alert(t('common.success'), 'Profile updated');
        setIsEditing(false);
    };

    const inputContainer = "flex-row items-center bg-surface p-3 rounded-lg border border-border";

    return (
        <ScrollView className="flex-1 bg-background">

            <View className="items-center py-8 bg-surface border-b border-border">
                <View className="relative">
                    {user?.profileImage ? (
                        <Image source={{ uri: user.profileImage }} className="w-24 h-24 rounded-full border-4 border-yellow" />
                    ) : (
                        <View className="w-24 h-24 rounded-full bg-surface border-4 border-yellow items-center justify-center">
                            <Text className="text-3xl text-yellow font-bold">{user?.name?.charAt(0) || 'U'}</Text>
                        </View>
                    )}
                    <View className="absolute bottom-0 right-0 bg-yellow rounded-full p-1 border-2 border-white">
                        <Text className="text-xs font-bold text-black px-1">{user?.role === 'admin' ? 'ADM' : 'STF'}</Text>
                    </View>
                </View>
                <Text className="text-xl font-bold mt-3 text-primary">{user?.name}</Text>
                <Text className="text-secondary">{user?.email}</Text>
            </View>

            <View className="p-4 space-y-6">

                <View className="bg-surface rounded-xl p-4 border border-border">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-3">
                            {isDark ? <Moon size={20} color={colors.yellow} /> : <Sun size={20} color="#f59e0b" />}
                            <Text className="text-lg font-bold text-primary">Appearance</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-secondary">{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                            <Switch
                                trackColor={{ false: "#94a3b8", true: colors.yellow }}
                                thumbColor={isDark ? "#f59e0b" : "#f4f3f4"}
                                onValueChange={handleThemeToggle}
                                value={isDark}
                            />
                        </View>
                    </View>
                </View>

                <View className="bg-surface rounded-xl p-4 border border-border">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-primary">{t('profile.personal_details')}</Text>
                        <TouchableOpacity onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}>
                            <Text className="text-blue-400 font-medium">{isEditing ? t('common.save') : t('common.edit')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-secondary text-sm mb-1">{t('profile.name')}</Text>
                            <View className={inputContainer}>
                                <User size={18} color={colors.subText} />
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    editable={isEditing}
                                    className={`flex-1 ml-3 text-primary ${isEditing ? 'border-b border-yellow' : ''}`}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-secondary text-sm mb-1">{t('auth.email')}</Text>
                            <View className={`${inputContainer} opacity-70`}>
                                <Mail size={18} color={colors.subText} />
                                <Text className="flex-1 ml-3 text-secondary">{user?.email}</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-secondary text-sm mb-1">{t('profile.phone')}</Text>
                            <View className={inputContainer}>
                                <Phone size={18} color={colors.subText} />
                                <TextInput
                                    value={phone}
                                    onChangeText={setPhone}
                                    editable={isEditing}
                                    className={`flex-1 ml-3 text-primary ${isEditing ? 'border-b border-yellow' : ''}`}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-secondary text-sm mb-1">{t('profile.years_of_service')}</Text>
                            <View className={`${inputContainer} opacity-70`}>
                                <Calendar size={18} color={colors.subText} />
                                <Text className="flex-1 ml-3 text-yellow font-bold">2 Years</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-surface rounded-xl p-4 border border-border">
                    <Text className="text-lg font-bold mb-4 text-primary">{t('profile.language')}</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                onPress={() => changeLanguage(lang.code)}
                                className={`flex-row items-center px-4 py-3 rounded-lg border ${i18n.language === lang.code ? 'bg-yellow border-yellow' : 'bg-surface border-border'}`}
                            >
                                <Text className="text-lg mr-2">{lang.flag}</Text>
                                <Text className={`${i18n.language === lang.code ? 'text-black font-bold' : 'text-secondary'}`}>
                                    {lang.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}
