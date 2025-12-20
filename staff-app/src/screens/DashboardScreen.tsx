import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { useOrderStore } from '../store/useOrderStore';
import { Order } from '../types';
import { ChefHat, CheckCircle } from 'lucide-react-native';

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'text-gray-500';
    let bg = 'bg-gray-100';

    switch (status) {
        case 'pending': color = 'text-orange-500'; bg = 'bg-orange-50'; break;
        case 'preparing': color = 'text-orange-600'; bg = 'bg-orange-100'; break;
        case 'completed': color = 'text-green-500'; bg = 'bg-green-50'; break;
        case 'cancelled': color = 'text-red-500'; bg = 'bg-red-50'; break;
    }

    return (
        <View className={`px-2 py-1 rounded-lg ${bg}`}>
            <Text className={`text-xs font-bold uppercase ${color}`}>{status}</Text>
        </View>
    );
};

const OrderCard = ({ order, onUpdateStatus }: { order: Order, onUpdateStatus: (id: string, status: any) => void }) => {
    return (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-xs text-gray-400 font-semibold mb-0.5">#{order.id.slice(-6)}</Text>
                    <Text className="text-base font-bold text-slate-700">{order.userDetails.name}</Text>
                </View>
                <StatusBadge status={order.status} />
            </View>

            <View className="h-[1px] bg-slate-100 my-3" />

            <View className="mb-3">
                {order.items.map((item, idx) => (
                    <View key={`${order.id}-item-${idx}`} className="flex-row justify-between mb-1.5">
                        <Text className="text-sm text-slate-600 flex-1">
                            <Text className="font-bold">{item.quantity}x </Text>
                            {item.name}
                        </Text>
                        <Text className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between mt-1 pt-3 border-t border-slate-100">
                <Text className="text-base font-semibold text-slate-700">Total</Text>
                <Text className="text-lg font-bold text-red-500">${order.total.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-end mt-4 gap-2">
                {order.status === 'pending' && (
                    <TouchableOpacity
                        className="flex-row items-center px-3 py-2 rounded-lg border border-orange-500 bg-orange-50"
                        onPress={() => onUpdateStatus(order.id, 'preparing')}
                    >
                        <ChefHat size={16} color="#e67e22" />
                        <Text className="ml-2 font-semibold text-xs text-orange-600">Start Preparing</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'preparing' && (
                    <TouchableOpacity
                        className="flex-row items-center px-3 py-2 rounded-lg border border-green-500 bg-green-50"
                        onPress={() => onUpdateStatus(order.id, 'completed')}
                    >
                        <CheckCircle size={16} color="#2ecc71" />
                        <Text className="ml-2 font-semibold text-xs text-green-500">Mark Ready</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default function DashboardScreen() {
    const { orders, fetchOrders, isLoading, updateOrderStatus } = useOrderStore();
    const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'completed'>('all');

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const onRefresh = useCallback(() => {
        fetchOrders();
    }, []);

    const filteredOrders = (orders || []).filter(o =>
        filter === 'all' ? o.status !== 'completed' && o.status !== 'cancelled'
            : o.status === filter
    );

    const displayOrders = filter === 'all' ? filteredOrders : (orders || []).filter(o => o.status === filter);

    return (
        <View className="flex-1 bg-gray-100 pt-12">
            <View className="px-5 mb-2">
                <Text className="text-3xl font-bold text-slate-700 mb-4">Orders</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" contentContainerStyle={{ paddingRight: 16 }}>
                    {['all', 'pending', 'preparing', 'completed'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            className={`py-2 px-5 rounded-full mr-2 border ${filter === f ? 'bg-red-400 border-red-400' : 'bg-white border-gray-200'}`}
                            onPress={() => setFilter(f as any)}
                        >
                            <Text className={`font-semibold ${filter === f ? 'text-white' : 'text-gray-500'}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={displayOrders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <OrderCard order={item} onUpdateStatus={updateOrderStatus} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#FF6B6B" />
                }
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-400 text-base">No orders found</Text>
                    </View>
                }
            />
        </View>
    );
}
