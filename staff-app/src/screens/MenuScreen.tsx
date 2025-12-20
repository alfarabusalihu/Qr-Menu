import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Switch, Image, TextInput, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useMenuStore } from '../store/useMenuStore';
import { useAuthStore } from '../store/useAuthStore';
import { Search, Plus, Trash2, Edit } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function MenuScreen() {
    const { items, fetchMenu, toggleItemAvailability, deleteProduct, isLoading } = useMenuStore();
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchMenu();
    }, []);

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        Alert.alert("Delete Product", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteProduct(id) }
        ]);
    };

    const isStaff = user?.role === 'staff';
    const canEdit = isStaff;

    return (
        <View className="flex-1 bg-gray-100 pt-12">
            <View className="px-5 mb-2.5">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-3xl font-bold text-slate-700">Menu</Text>
                    {canEdit && (
                        <TouchableOpacity
                            className="bg-red-400 flex-row items-center px-4 py-2.5 rounded-full gap-1.5 shadow-sm"
                            onPress={() => navigation.navigate('ProductForm')}
                        >
                            <Plus color="#fff" size={20} />
                            <Text className="text-white font-bold text-sm">Add Product</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row items-center bg-white p-3 rounded-xl gap-2.5 shadow-sm">
                    <Search size={20} color="#95a5a6" />
                    <TextInput
                        className="flex-1 text-base"
                        placeholder="Search items..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={item => item.id}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchMenu} tintColor="#FF6B6B" />}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <View className={`flex-row bg-white rounded-2xl p-3 mb-3 items-center shadow-sm ${!item.isAvailable ? 'opacity-60' : ''}`}>
                        <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} className="w-16 h-16 rounded-full bg-gray-100" />
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-bold text-slate-700">{item.name}</Text>
                            <Text className="text-sm text-gray-400 mb-1">${item.price}</Text>
                            <Text className={`text-xs font-semibold ${item.availableQty < 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                Stock: {item.availableQty}
                            </Text>
                        </View>
                        <View className="items-center gap-2">
                            {canEdit ? (
                                <>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#FF6B6B" }}
                                        thumbColor={item.isAvailable ? "#f4f3f4" : "#f4f3f4"}
                                        onValueChange={() => toggleItemAvailability(item.id)}
                                        value={item.isAvailable}
                                    />
                                    <View className="flex-row gap-4 mt-2">
                                        <TouchableOpacity onPress={() => navigation.navigate('ProductForm', { item })}>
                                            <Edit size={20} color="#3498db" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                            <Trash2 size={20} color="#e74c3c" />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <Text className="text-xs text-gray-400 font-semibold">{item.isAvailable ? 'Active' : 'Unavailable'}</Text>
                            )}
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
