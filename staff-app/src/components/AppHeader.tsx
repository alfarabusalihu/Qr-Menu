import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { UserCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileDropdown from './ProfileDropdown';
import { useThemeColors } from '../hooks/useThemeColors';

export default function AppHeader() {
    const { user } = useAuthStore();
    const [isDropdownVisible, setDropdownVisible] = React.useState(false);
    const navigation = useNavigation<any>();
    const { colors } = useThemeColors();

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    return (
        <View className="z-50 bg-background border-b border-border shadow-sm">
            <View className="flex-row items-center justify-between px-5 h-16">

                <View className="flex-row items-center">
                    <Text className="text-xl font-black text-primary tracking-widest">
                        QR MENU <Text className="text-yellow">STAFF</Text>
                    </Text>
                </View>

                <View className="relative z-50">
                    <TouchableOpacity
                        className="flex-row items-center gap-3"
                        onPress={toggleDropdown}
                        activeOpacity={0.7}
                    >
                        {user?.profileImage ? (
                            <Image
                                source={{ uri: user.profileImage }}
                                className="w-10 h-10 rounded-full border-2 border-yellow"
                            />
                        ) : (
                            <UserCircle size={36} color={colors.yellow} />
                        )}
                    </TouchableOpacity>

                    {isDropdownVisible && (
                        <View className="absolute top-12 right-0 w-48 bg-surface rounded-xl shadow-xl border border-border overflow-hidden">
                            <ProfileDropdown onClose={() => setDropdownVisible(false)} />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
