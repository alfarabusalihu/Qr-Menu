import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useOrderStore } from '../store/useOrderStore';
import { Order } from '../types';
import { ChefHat, CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'text-gray-400';
    let bg = 'bg-gray-800';

    switch (status) {
        case 'pending': color = 'text-orange-400'; bg = 'bg-orange-500/10'; break;
        case 'preparing': color = 'text-blue-400'; bg = 'bg-blue-500/10'; break;
        case 'completed': color = 'text-green-400'; bg = 'bg-green-500/10'; break;
        case 'cancelled': color = 'text-red-400'; bg = 'bg-red-500/10'; break;
        case 'served': color = 'text-purple-400'; bg = 'bg-purple-500/10'; break;
    }

    return (
        <View className={`px-2 py-1 rounded-lg ${bg} border border-border`}>
            <Text className={`text-xs font-bold uppercase ${color}`}>{status}</Text>
        </View>
    );
};

const OrderCard = ({ order, onUpdateStatus, isDark }: { order: Order, onUpdateStatus: (id: string, status: any) => void, isDark: boolean }) => {
    const { t } = useTranslation();
    return (
        <Pressable className="bg-surface rounded-2xl p-4 mb-4 shadow-sm border border-border hover:bg-surface-light transition-colors">
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-xs text-secondary font-semibold mb-0.5">#{order.id.slice(-6)}</Text>
                    <Text className="text-base font-bold text-primary">{order.userDetails.name || 'Guest'}</Text>
                    <Text className="text-xs text-secondary">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <StatusBadge status={order.status} />
            </View>

            <View className="h-[1px] bg-border my-3" />

            <View className="mb-3">
                {order.items.map((item, idx) => (
                    <View key={`${order.id}-item-${idx}`} className="flex-row justify-between mb-1.5">
                        <Text className="text-sm text-secondary flex-1">
                            <Text className="font-bold text-primary">{item.quantity}x </Text>
                            {item.name}
                        </Text>
                        <Text className="text-sm text-secondary">${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between mt-1 pt-3 border-t border-border">
                <Text className="text-base font-semibold text-secondary">{t('common.total')}</Text>
                <Text className="text-lg font-bold text-yellow">${order.total.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-end mt-4 gap-2">
                {order.status === 'pending' && (
                    <TouchableOpacity
                        className="flex-row items-center px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 active:bg-orange-500/30 active:scale-95"
                        onPress={() => onUpdateStatus(order.id, 'preparing')}
                    >
                        <ChefHat size={16} color="#fb923c" />
                        <Text className="ml-2 font-semibold text-xs text-orange-400">Start Preparing</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'preparing' && (
                    <TouchableOpacity
                        className="flex-row items-center px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 active:bg-green-500/30 active:scale-95"
                        onPress={() => onUpdateStatus(order.id, 'completed')}
                    >
                        <CheckCircle size={16} color="#4ade80" />
                        <Text className="ml-2 font-semibold text-xs text-green-400">Mark Ready</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'completed' && (
                    <TouchableOpacity
                        className="flex-row items-center px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 active:bg-purple-500/30 active:scale-95"
                        onPress={() => onUpdateStatus(order.id, 'served')}
                    >
                        <CheckCircle size={16} color="#c084fc" />
                        <Text className="ml-2 font-semibold text-xs text-purple-400">Serve</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Pressable>
    );
};

export default function DashboardScreen() {
    const { orders, fetchOrders, isLoading, updateOrderStatus } = useOrderStore();
    const { t } = useTranslation();
    const { isDark, colors } = useThemeColors();
    const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'completed' | 'served' | 'cancelled'>('all');

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const onRefresh = useCallback(() => {
        fetchOrders();
    }, []);

    const sortedOrders = [...(orders || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredOrders = sortedOrders.filter(o =>
        filter === 'all'
            ? true
            : o.status === filter
    );

    const filters = ['all', 'pending', 'preparing', 'completed', 'served', 'cancelled'];

    return (
        <View className="flex-1 bg-background pt-4">
            <View className="px-5 mb-2">
                <Text className="text-3xl font-bold text-primary mb-4">{t('nav.orders')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" contentContainerStyle={{ paddingRight: 16 }}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f}
                            className={`py-2 px-4 rounded-full mr-2 border active:scale-95 active:opacity-80 transition-all ${filter === f ? 'bg-yellow border-yellow' : 'bg-surface border-border'}`}
                            onPress={() => setFilter(f as any)}
                        >
                            <Text className={`font-semibold capitalize ${filter === f ? 'text-black' : isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredOrders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <OrderCard order={item} onUpdateStatus={updateOrderStatus} isDark={isDark} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.yellow} />
                }
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-secondary text-base">{t('common.no_orders')}</Text>
                    </View>
                }
            />
        </View>
    );
}
