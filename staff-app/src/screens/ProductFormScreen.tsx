import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useMenuStore } from '../store/useMenuStore';
import { MenuItem } from '../types';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProductFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { addProduct, updateProduct, isLoading } = useMenuStore();
    const editingItem = (route.params as any)?.item as MenuItem | undefined;

    const [name, setName] = useState(editingItem?.name || '');
    const [price, setPrice] = useState(editingItem?.price.toString() || '');
    const [description, setDescription] = useState(editingItem?.description || '');
    const [prepTime, setPrepTime] = useState(editingItem?.prepTime || '15 mins');
    const [stock, setStock] = useState(editingItem?.availableQty.toString() || '50');
    // For MVP, categoryId is hardcoded or text. ideally dropdown.
    const [categoryId, setCategoryId] = useState(editingItem?.categoryId || 'default-cat');

    const handleSave = async () => {
        if (!name || !price) {
            Alert.alert("Error", "Name and Price are required");
            return;
        }

        try {
            const productData = {
                name,
                price: parseFloat(price),
                description,
                prepTime,
                availableQty: parseInt(stock),
                image: editingItem?.image || 'https://via.placeholder.com/150', // Mock image
                categoryId,
                isAvailable: true
            };

            if (editingItem) {
                await updateProduct(editingItem.id, productData);
            } else {
                await addProduct(productData);
            }
            navigation.goBack();
        } catch (e: any) {
            Alert.alert("Error", "Failed to save product");
        }
    };

    return (
        <ScrollView className="flex-1 p-5 bg-white">
            <Text className="text-base font-bold mb-2 text-slate-700">Product Name</Text>
            <TextInput className="border border-gray-200 rounded-lg p-3 mb-5 text-base" value={name} onChangeText={setName} placeholder="e.g. Burger" />

            <Text className="text-base font-bold mb-2 text-slate-700">Price ($)</Text>
            <TextInput className="border border-gray-200 rounded-lg p-3 mb-5 text-base" value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="10.00" />

            <Text className="text-base font-bold mb-2 text-slate-700">Description</Text>
            <TextInput className="border border-gray-200 rounded-lg p-3 mb-5 text-base h-24 text-top" value={description} onChangeText={setDescription} multiline />

            <Text className="text-base font-bold mb-2 text-slate-700">Prep Time</Text>
            <TextInput className="border border-gray-200 rounded-lg p-3 mb-5 text-base" value={prepTime} onChangeText={setPrepTime} placeholder="15 mins" />

            <Text className="text-base font-bold mb-2 text-slate-700">Daily Stock</Text>
            <TextInput className="border border-gray-200 rounded-lg p-3 mb-5 text-base" value={stock} onChangeText={setStock} keyboardType="numeric" />

            <TouchableOpacity
                className="bg-red-400 p-4 rounded-xl items-center mt-5"
                onPress={handleSave}
                disabled={isLoading}
            >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg font-bold">Save Product</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}
