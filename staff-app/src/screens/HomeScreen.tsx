import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Clock, CheckCircle, Package } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';

const StatCard = ({ title, value, icon, bg }: any) => {
    return (
        <Pressable className="flex-1 p-4 rounded-xl border border-border bg-surface shadow-sm min-w-[150px] active:scale-[0.98] hover:bg-surface-light transition-colors">
            <View className={`w-10 h-10 rounded-full items-center justify-center mb-3 ${bg}`}>
                {icon}
            </View>
            <Text className="text-2xl font-bold text-primary">{value}</Text>
            <Text className="text-sm text-secondary">{title}</Text>
        </Pressable>
    );
};

export default function HomeScreen() {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const { colors } = useThemeColors();

    const isAdmin = user?.role === 'admin';

    return (
        <ScrollView className="flex-1 bg-background p-5">
            <View className="mb-8">
                <Text className="text-3xl font-bold text-primary">
                    {t('common.welcome')}, <Text className="text-yellow">{user?.name}</Text>
                </Text>
                <Text className="text-base text-secondary uppercase tracking-widest mt-1">
                    {user?.role} DASHBOARD
                </Text>
            </View>

            <View className="flex-row flex-wrap gap-4">
                {isAdmin ? (
                    <>
                        <StatCard
                            title={t('dashboard.total_orders')}
                            value="1,234"
                            icon={<ShoppingBag color={colors.yellow} size={20} />}
                            bg="bg-yellow/10"
                        />
                        <StatCard
                            title={t('dashboard.pending_orders')}
                            value="12"
                            icon={<Clock color="#f87171" size={20} />}
                            bg="bg-red-400/10"
                        />
                        <StatCard
                            title="Total Products"
                            value="45"
                            icon={<Package color="#60a5fa" size={20} />}
                            bg="bg-blue-400/10"
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title={t('dashboard.my_orders')}
                            value="42"
                            icon={<ShoppingBag color={colors.yellow} size={20} />}
                            bg="bg-yellow/10"
                        />
                        <StatCard
                            title={t('dashboard.completed_orders')}
                            value="1,205"
                            icon={<CheckCircle color="#4ade80" size={20} />}
                            bg="bg-green-400/10"
                        />
                        <StatCard
                            title={t('dashboard.hours_logged')}
                            value="142h"
                            icon={<Clock color="#c084fc" size={20} />}
                            bg="bg-purple-400/10"
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}
