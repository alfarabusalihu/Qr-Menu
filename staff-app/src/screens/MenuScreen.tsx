import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, Image, TextInput, RefreshControl, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { useMenuStore } from '../store/useMenuStore';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Search, Plus, Trash2, Edit, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';

export default function MenuScreen() {
    const { categories, fetchMenu, deleteProduct, createCategory, isLoading } = useMenuStore();
    const { settings, fetchSettings } = useSettingsStore();
    const { t } = useTranslation();
    const { colors, isDark } = useThemeColors();
    const [search, setSearch] = useState('');
    const [isCatModalVisible, setCatModalVisible] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchMenu();
        fetchSettings();
    }, []);

    const sections = categories.map(cat => ({
        title: cat.name,
        data: cat.items.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase()))
    })).filter(section => section.data.length > 0);

    const handleDelete = (id: string) => {
        Alert.alert(t('common.delete'), t('common.are_you_sure'), [
            { text: t('common.cancel'), style: "cancel" },
            { text: t('common.delete'), style: "destructive", onPress: () => deleteProduct(id) }
        ]);
    };

    const handleCreateCategory = async () => {
        if (!newCatName.trim()) return;
        try {
            await createCategory(newCatName);
            setCatModalVisible(false);
            setNewCatName('');
        } catch (e) {
            Alert.alert("Error", "Failed to create category");
        }
    };

    const currencySymbol = settings?.currency === 'USD' ? '$' : settings?.currency || '$';

    return (
        <View className="flex-1 bg-background">
            <View className="px-5 mb-2.5">
                <View className="flex-row justify-between items-center mb-4 mt-4">
                    <Text className="text-3xl font-bold text-primary">{t('nav.products')}</Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            className="bg-surface p-2.5 rounded-full border border-border active:scale-95"
                            onPress={() => setCatModalVisible(true)}
                        >
                            <Plus color={colors.yellow} size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-yellow flex-row items-center px-4 py-2.5 rounded-full gap-1.5 shadow-sm active:scale-95 active:opacity-90"
                            onPress={() => navigation.navigate('ProductForm')}
                        >
                            <Plus color="#000" size={20} />
                            <Text className="text-black font-bold text-sm">{t('products.add_new')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center bg-surface p-3 rounded-xl gap-2.5 shadow-sm border border-border">
                    <Search size={20} color={isDark ? "#9ca3af" : "#64748b"} />
                    <TextInput
                        className="flex-1 text-base text-primary"
                        placeholder={t('common.search')}
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    />
                </View>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchMenu} tintColor={colors.yellow} />}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                renderSectionHeader={({ section: { title } }) => (
                    <View className="bg-background py-2 mb-2">
                        <Text className="text-xl font-bold text-yellow">{title}</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <Pressable
                        className={`flex-row bg-surface rounded-2xl p-3 mb-3 items-center shadow-sm border border-border ${!item.isAvailable ? 'opacity-60' : ''} hover:bg-surface-light`}
                        onPress={() => navigation.navigate('ProductForm', { item })}
                    >
                        <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} className="w-16 h-16 rounded-xl bg-gray-700" />
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-bold text-primary">{item.name}</Text>
                            <Text className="text-sm text-secondary mb-1">{currencySymbol}{item.price}</Text>
                            <View className="flex-row items-center gap-2">
                                <Text className={`text-xs font-semibold ${item.availableQty < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                    Stock: {item.availableQty}
                                </Text>
                                {!item.isAvailable && (
                                    <View className="bg-red-500/10 px-2 py-0.5 rounded">
                                        <Text className="text-xs text-red-500 font-bold">UNAVAILABLE</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View className="items-center gap-2">
                            <View className="flex-row gap-4 mt-2">
                                <TouchableOpacity onPress={() => navigation.navigate('ProductForm', { item })} className="active:scale-90">
                                    <Edit size={18} color="#60a5fa" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} className="active:scale-90">
                                    <Trash2 size={18} color="#f87171" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-secondary">{t('common.no_items')}</Text>
                    </View>
                }
            />

            <Modal
                transparent
                visible={isCatModalVisible}
                animationType="fade"
                onRequestClose={() => setCatModalVisible(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center p-5">
                    <View className="bg-surface w-full max-w-sm p-6 rounded-2xl shadow-xl border border-border">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold text-primary">New Category</Text>
                            <TouchableOpacity onPress={() => setCatModalVisible(false)} className="active:scale-90">
                                <X size={24} color={isDark ? "#94a3b8" : "#64748b"} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            className="bg-background border border-border p-4 rounded-xl mb-4 text-lg text-primary"
                            placeholder="Category Name"
                            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                            value={newCatName}
                            onChangeText={setNewCatName}
                            autoFocus
                        />

                        <TouchableOpacity
                            className="bg-yellow p-4 rounded-xl items-center active:opacity-90 active:scale-[0.98]"
                            onPress={handleCreateCategory}
                        >
                            <Text className="text-black font-bold text-lg">{t('common.save')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
