import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { Store, Save, Facebook, Instagram, Twitter } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';

export default function SettingsScreen() {
    const { user } = useAuthStore();
    const { settings, fetchSettings, updateSettings, isLoading } = useSettingsStore();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { colors, isDark } = useThemeColors();

    const [businessName, setBusinessName] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') {
            Alert.alert("Access Denied", "Admins only.");
            navigation.goBack();
            return;
        }
        fetchSettings();
    }, [user, navigation]);

    useEffect(() => {
        if (settings) {
            setBusinessName(settings.businessName);
            setCurrency(settings.currency);
            setFacebook(settings.socials?.facebook || '');
            setInstagram(settings.socials?.instagram || '');
            setTwitter(settings.socials?.twitter || '');
        }
    }, [settings]);

    const handleSave = async () => {
        if (!settings) return;
        try {
            await updateSettings({
                ...settings,
                businessName,
                currency,
                socials: { facebook, instagram, twitter }
            });
            Alert.alert(t('common.success'), "Settings updated successfully");
        } catch (e) {
            Alert.alert(t('common.error'), "Failed to update settings");
        }
    };

    if (isLoading && !settings) {
        return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator color={colors.yellow} /></View>;
    }

    const inputClass = "p-3 rounded-xl border bg-surface border-border text-primary";
    const placeholderColor = isDark ? "#9ca3af" : "#94a3b8";

    return (
        <ScrollView className="flex-1 bg-background p-5">
            <Text className="text-3xl font-bold mb-6 text-primary">{t('nav.settings')}</Text>

            <View className="flex-col md:flex-row gap-6">
                <View className="flex-1 bg-surface p-5 rounded-2xl shadow-sm border border-border">
                    <View className="flex-row items-center mb-4">
                        <Store size={20} color={colors.yellow} />
                        <Text className="text-lg font-bold ml-2 text-primary">{t('profile.store_settings')}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm mb-1 text-secondary">{t('profile.business_name')}</Text>
                        <TextInput
                            className={inputClass}
                            value={businessName}
                            onChangeText={setBusinessName}
                            placeholder="Enter business name"
                            placeholderTextColor={placeholderColor}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm mb-1 text-secondary">{t('products.currency')} Symbol</Text>
                        <TextInput
                            className={inputClass}
                            value={currency}
                            onChangeText={setCurrency}
                            placeholder="e.g. $, €, £"
                            placeholderTextColor={placeholderColor}
                            maxLength={3}
                        />
                    </View>
                </View>

                <View className="flex-1 bg-surface p-5 rounded-2xl shadow-sm border border-border">
                    <Text className="text-lg font-bold mb-4 text-primary">Social Media</Text>

                    <View className="mb-4">
                        <View className="flex-row items-center mb-1">
                            <Facebook size={16} color={colors.yellow} style={{ marginRight: 8 }} />
                            <Text className="text-sm text-secondary">Facebook</Text>
                        </View>
                        <TextInput
                            className={inputClass}
                            value={facebook}
                            onChangeText={setFacebook}
                            placeholder="https://facebook.com/..."
                            placeholderTextColor={placeholderColor}
                        />
                    </View>

                    <View className="mb-4">
                        <View className="flex-row items-center mb-1">
                            <Instagram size={16} color={colors.yellow} style={{ marginRight: 8 }} />
                            <Text className="text-sm text-secondary">Instagram</Text>
                        </View>
                        <TextInput
                            className={inputClass}
                            value={instagram}
                            onChangeText={setInstagram}
                            placeholder="https://instagram.com/..."
                            placeholderTextColor={placeholderColor}
                        />
                    </View>

                    <View className="mb-4">
                        <View className="flex-row items-center mb-1">
                            <Twitter size={16} color={colors.yellow} style={{ marginRight: 8 }} />
                            <Text className="text-sm text-secondary">X (Twitter)</Text>
                        </View>
                        <TextInput
                            className={inputClass}
                            value={twitter}
                            onChangeText={setTwitter}
                            placeholder="https://x.com/..."
                            placeholderTextColor={placeholderColor}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                className="bg-yellow p-4 rounded-xl items-center mt-6 flex-row justify-center gap-2 self-center w-full md:w-1/3 shadow-lg shadow-yellow/20 active:opacity-80"
                onPress={handleSave}
            >
                <Save size={18} color="#000" />
                <Text className="text-black font-bold">{t('common.save')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
