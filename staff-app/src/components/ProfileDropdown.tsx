import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';

export default function ProfileDropdown({ onClose }: { onClose: () => void }) {
    const navigation = useNavigation<any>();
    const { logout } = useAuthStore();
    const { t } = useTranslation();
    const { colors } = useThemeColors();

    const handleLogout = async () => {
        onClose();
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const handleProfile = () => {
        onClose();
        navigation.navigate('Profile');
    };

    return (
        <View className="w-full">
            <TouchableOpacity
                className="flex-row items-center p-4 border-b border-border active:bg-surface-light"
                onPress={handleProfile}
            >
                <User size={20} color={colors.yellow} />
                <Text className="ml-3 text-primary font-medium">{t('nav.profile')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-row items-center p-4 active:bg-surface-light"
                onPress={handleLogout}
            >
                <LogOut size={20} color="#ef4444" />
                <Text className="ml-3 text-red-500 font-medium">{t('auth.logout')}</Text>
            </TouchableOpacity>
        </View>
    );
}
