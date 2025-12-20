import './global.css';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProductFormScreen from './src/screens/ProductFormScreen';
import StaffScreen from './src/screens/StaffScreen';
import { Home, User, ClipboardList, Users } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

function StaffTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { token, user, isLoading, checkSession } = useAuthStore();
  console.log('App Token State:', token ? 'Present' : 'Missing');

  useEffect(() => {
    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
            <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ presentation: 'modal', headerShown: true, title: 'Product Details' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
