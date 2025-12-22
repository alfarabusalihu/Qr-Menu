import './global.css';
import 'react-native-gesture-handler';
import './src/i18n';
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/store/useAuthStore';
import { useThemeStore } from './src/store/useThemeStore';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrdersScreen from './src/screens/DashboardScreen'; // Reused as Orders Screen
import MenuScreen from './src/screens/MenuScreen';
import ProductFormScreen from './src/screens/ProductFormScreen';
import StaffScreen from './src/screens/StaffScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Home, ClipboardList, Users, Settings as SettingsIcon, ShoppingBag } from 'lucide-react-native';

import { useColorScheme } from 'nativewind';
import AppHeader from './src/components/AppHeader';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fef08a' : '#003153',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#003153' : '#ffffff',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        header: () => <AppHeader />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('nav.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Products"
        component={MenuScreen}
        options={{
          tabBarLabel: t('nav.products'),
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          tabBarLabel: t('nav.staff'),
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: t('nav.orders'),
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('nav.settings'),
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

function StaffTabs() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fef08a' : '#003153',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#003153' : '#ffffff',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        header: () => <AppHeader />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('nav.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Products"
        component={MenuScreen}
        options={{
          tabBarLabel: t('nav.products'),
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: t('nav.orders'),
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { token, user, isLoading, checkSession } = useAuthStore();
  const { loadTheme, theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    checkSession();
    loadTheme();
  }, []);

  // Sync NativeWind
  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f33' }}>
        <ActivityIndicator size="large" color="#fef08a" />
      </View>
    );
  }

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#001f33',
      card: '#003153',
      text: '#ffffff',
    }
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f8fafc',
      card: '#ffffff',
      text: '#0f172a',
    }
  };

  return (
    <NavigationContainer theme={theme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Horizontal Slide
          presentation: 'card', // Ensure it treats screens as cards for sliding
        }}
      >
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main">
              {() => user?.role === 'admin' ? <AdminTabs /> : <StaffTabs />}
            </Stack.Screen>
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                presentation: 'card',
                headerShown: true,
                headerStyle: { backgroundColor: theme === 'dark' ? '#003153' : '#ffffff' },
                headerTintColor: theme === 'dark' ? '#fff' : '#003153',
              }}
            />
            <Stack.Screen
              name="ProductForm"
              component={ProductFormScreen}
              options={{
                presentation: 'card',
                headerShown: true,
                title: 'Product Details',
                headerStyle: { backgroundColor: theme === 'dark' ? '#003153' : '#ffffff' },
                headerTintColor: theme === 'dark' ? '#fff' : '#003153',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
