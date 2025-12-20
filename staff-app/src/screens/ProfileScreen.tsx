import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, User, Mail, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();

    return (
        <View className="flex-1 bg-gray-100 pt-12 px-5">
            <View className="mb-5">
                <Text className="text-3xl font-bold text-slate-700">Profile</Text>
            </View>

            <View className="bg-white rounded-3xl p-6 items-center shadow-sm mb-6">
                <View className="w-20 h-20 rounded-full bg-red-50 justify-center items-center mb-4">
                    <User size={40} color="#FF6B6B" />
                </View>
                <Text className="text-2xl font-bold text-slate-700 mb-1">{user?.name || 'Staff Member'}</Text>
                <Text className="text-xs font-bold text-red-400 px-2.5 py-1 bg-red-50 rounded-xl mb-5 overflow-hidden">
                    {user?.role?.toUpperCase() || 'STAFF'}
                </Text>

                <View className="flex-row items-center mb-3 gap-3">
                    <Mail size={18} color="#95a5a6" />
                    <Text className="text-base text-gray-400">{user?.email || 'email@example.com'}</Text>
                </View>

                <View className="flex-row items-center mb-3 gap-3">
                    <Shield size={18} color="#95a5a6" />
                    <Text className="text-base text-gray-400">ID: {user?.id?.slice(0, 8) || 'Unknown'}</Text>
                </View>
            </View>

            <TouchableOpacity
                className="bg-red-500 flex-row justify-center items-center p-4 rounded-xl gap-2.5 shadow-lg shadow-red-500/50"
                onPress={logout}
            >
                <LogOut size={20} color="#fff" />
                <Text className="text-white text-lg font-bold">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
