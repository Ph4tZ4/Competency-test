import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await axiosClient.post('/login', {
                username,
                password
            });
            login(response.data.user);
        } catch (error) {
            Alert.alert('Error', 'Login ไม่ผ่าน เช็ค Username/Password หรือ Server');
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.inputHeader}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            placeholderTextColor="#8e8e93"
                        />
                        <View style={styles.separator} />
                        <TextInput
                            style={styles.inputFooter}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#8e8e93"
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerButtonText}>Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS Grouped Background
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#8e8e93',
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 24,
        overflow: 'hidden',
    },
    inputHeader: {
        padding: 16,
        fontSize: 17,
        backgroundColor: '#fff',
    },
    inputFooter: {
        padding: 16,
        fontSize: 17,
        backgroundColor: '#fff',
    },
    separator: {
        height: 1, // Hairline
        backgroundColor: '#c6c6c8',
        marginLeft: 16,
    },
    loginButton: {
        backgroundColor: '#007AFF', // iOS Blue
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#007AFF",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    registerButton: {
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});