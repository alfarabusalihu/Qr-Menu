import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, User } from 'lucide-react-native';

export default function SignupScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jobTitle, setJobTitle] = useState('waiter'); // Default
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await api.post('/staff/register', { name, email, password, jobTitle });
            Alert.alert("Success", "Account created! Please login.");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-100 p-6 justify-center">
            <Text className="text-3xl font-bold text-slate-700 mb-8 text-center">Staff Registration</Text>

            <View className="gap-4">
                <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                    <User size={20} color="#666" style={{ marginRight: 12 }} />
                    <TextInput className="flex-1 text-base" placeholder="Full Name" value={name} onChangeText={setName} />
                </View>

                <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                    <Mail size={20} color="#666" style={{ marginRight: 12 }} />
                    <TextInput className="flex-1 text-base" placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                </View>

                <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                    <Lock size={20} color="#666" style={{ marginRight: 12 }} />
                    <TextInput className="flex-1 text-base" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                </View>

                <View className="mt-2.5">
                    <Text className="text-base mb-2 text-slate-700 font-semibold">I am a:</Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className={`flex-1 p-3 rounded-lg border items-center ${jobTitle === 'waiter' ? 'bg-red-400 border-red-400' : 'bg-white border-gray-200'}`}
                            onPress={() => setJobTitle('waiter')}
                        >
                            <Text className={`font-bold ${jobTitle === 'waiter' ? 'text-white' : 'text-gray-400'}`}>Waiter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 p-3 rounded-lg border items-center ${jobTitle === 'chef' ? 'bg-red-400 border-red-400' : 'bg-white border-gray-200'}`}
                            onPress={() => setJobTitle('chef')}
                        >
                            <Text className={`font-bold ${jobTitle === 'chef' ? 'text-white' : 'text-gray-400'}`}>Chef</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-red-400 h-14 rounded-xl justify-center items-center mt-4"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg font-bold">Sign Up</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-gray-400 text-center mt-4">Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
