import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { StaffMember } from '../types';
import { ChefHat, UserCircle } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';

export default function StaffScreen() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useThemeColors();

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.get<StaffMember[]>('/staff/list');
            setStaff(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const chefs = staff.filter(s => s.jobTitle?.toLowerCase().includes('chef') || s.role === 'staff' && !s.jobTitle);
    const waiters = staff.filter(s => s.jobTitle?.toLowerCase().includes('waiter'));

    const renderItem = ({ item }: { item: StaffMember }) => (
        <View className="flex-row bg-surface p-4 rounded-xl mb-2.5 items-center border border-border">
            <View className="w-10 items-center mr-3">
                {item.jobTitle?.includes('chef') ? <ChefHat size={24} color="#e67e22" /> : <UserCircle size={24} color="#3498db" />}
            </View>
            <View>
                <Text className="text-base font-bold text-primary">{item.name}</Text>
                <Text className="text-sm text-secondary">{item.jobTitle || item.role}</Text>
            </View>
            <View className={`ml-auto px-2 py-1 rounded-lg ${item.isActive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <Text className={`text-xs font-bold ${item.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-background p-5 pt-8">
            <Text className="text-3xl font-bold mb-5 text-primary">Staff Management</Text>

            {loading ? <ActivityIndicator size="large" color={colors.yellow} /> : (
                <View>
                    <Text className="text-xl font-semibold mb-2.5 text-secondary">Chefs</Text>
                    <FlatList data={chefs} renderItem={renderItem} keyExtractor={i => i.id} />

                    <Text className="text-xl font-semibold mb-2.5 mt-5 text-secondary">Waiters</Text>
                    <FlatList data={waiters} renderItem={renderItem} keyExtractor={i => i.id} />
                </View>
            )}
        </View>
    );
}
