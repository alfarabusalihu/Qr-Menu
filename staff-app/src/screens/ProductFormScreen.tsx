import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { useMenuStore } from '../store/useMenuStore';
import { MenuItem } from '../types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';

export default function ProductFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { addProduct, updateProduct, isLoading } = useMenuStore();
    const { colors, isDark } = useThemeColors();

    const editingItem = (route.params as any)?.item as MenuItem | undefined;

    const [name, setName] = useState(editingItem?.name || '');
    const [price, setPrice] = useState(editingItem?.price.toString() || '');
    const [description, setDescription] = useState(editingItem?.description || '');
    const [image, setImage] = useState(editingItem?.image || '');
    const [prepTime, setPrepTime] = useState(editingItem?.prepTime || '15 mins');
    const [stock, setStock] = useState(editingItem?.availableQty.toString() || '50');
    const [isAvailable, setIsAvailable] = useState(editingItem?.isAvailable ?? true);
    const [categoryId, setCategoryId] = useState(editingItem?.categoryId || 'default-cat');

    const inputClass = "border border-border rounded-lg p-3 mb-5 text-base bg-surface text-primary";
    const placeholderColor = isDark ? "#9ca3af" : "#94a3b8";

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
                image: image || 'https://via.placeholder.com/150',
                categoryId,
                isAvailable
            };

            if (editingItem) {
                await updateProduct(editingItem.id, productData);
            } else {
                await addProduct(productData);
            }
            navigation.goBack();
        } catch (e: any) {
            console.error(e);
            Alert.alert("Error", "Failed to save product");
        }
    };

    return (
        <ScrollView className="flex-1 p-5 bg-background">
            <View className="mb-6">
                <View className="flex-row justify-between items-center bg-surface p-4 rounded-xl border border-border mb-6 shadow-sm">
                    <View>
                        <Text className="text-base font-bold text-primary mb-1">Status</Text>
                        <Text className={`text-sm font-semibold ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {isAvailable ? 'Available' : 'Unavailable'}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#334155", true: colors.yellow }}
                        thumbColor={"#fff"}
                        onValueChange={setIsAvailable}
                        value={isAvailable}
                    />
                </View>

                <Text className="text-base font-bold mb-2 text-primary">Product Name</Text>
                <TextInput
                    className={inputClass}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Burger"
                    placeholderTextColor={placeholderColor}
                />

                <Text className="text-base font-bold mb-2 text-primary">Price ($)</Text>
                <TextInput
                    className={inputClass}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="10.00"
                    placeholderTextColor={placeholderColor}
                />

                <Text className="text-base font-bold mb-2 text-primary">Description</Text>
                <TextInput
                    className={`${inputClass} min-h-[100px] align-top text-top`}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                    placeholder="Product description..."
                    placeholderTextColor={placeholderColor}
                />

                <Text className="text-base font-bold mb-2 text-primary">Image URL</Text>
                <TextInput
                    className={inputClass}
                    value={image}
                    onChangeText={setImage}
                    placeholder="https://example.com/image.jpg"
                    placeholderTextColor={placeholderColor}
                />

                <Text className="text-base font-bold mb-2 text-primary">Prep Time</Text>
                <TextInput
                    className={inputClass}
                    value={prepTime}
                    onChangeText={setPrepTime}
                    placeholder="15 mins"
                    placeholderTextColor={placeholderColor}
                />

                <Text className="text-base font-bold mb-2 text-primary">Daily Stock</Text>
                <TextInput
                    className={inputClass}
                    value={stock}
                    onChangeText={setStock}
                    keyboardType="numeric"
                    placeholder="50"
                    placeholderTextColor={placeholderColor}
                />

                <TouchableOpacity
                    className="bg-yellow p-4 rounded-xl items-center mt-2 shadow-sm active:opacity-90 active:scale-[0.98]"
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text className="text-black text-lg font-bold">
                            {editingItem ? 'Update Product' : 'Save Product'}
                        </Text>
                    )}
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}
