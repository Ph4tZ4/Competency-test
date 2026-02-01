import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import axiosClient from '../api/axiosClient';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        try {
            await axiosClient.post('/register', {
                username,
                password,
                role: 'member'
            });

            Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อย', [
                { text: 'ตกลง', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว หรือระบบมีปัญหา');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.inputHeader}
                            placeholder="Choose a Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            placeholderTextColor="#8e8e93"
                        />
                        <View style={styles.separator} />
                        <TextInput
                            style={styles.inputFooter}
                            placeholder="Choose a Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#8e8e93"
                        />
                    </View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginLinkButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.loginLinkText}>Already have an account?</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
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
        height: 1,
        backgroundColor: '#c6c6c8',
        marginLeft: 16,
    },
    registerButton: {
        backgroundColor: '#34C759', // iOS Green
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#34C759",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    loginLinkButton: {
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#007AFF',
        fontSize: 16,
    },
});