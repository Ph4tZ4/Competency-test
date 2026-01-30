import React, { useState, useContext } from 'react'; // เพิ่ม useContext
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext'; // Import Context

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // เรียกใช้ฟังก์ชัน login จาก Context
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await axiosClient.post('/login', {
                username,
                password
            });

            // ✅ เปลี่ยนตรงนี้: เรียก login() แล้ว App.js จะสลับหน้าให้เองอัตโนมัติ
            login(response.data.user);

        } catch (error) {
            Alert.alert('Error', 'Login ไม่ผ่าน เช็ค Username/Password หรือ Server');
            console.log(error);
        }
    };

    // ... (ส่วน return เหมือนเดิมทุกอย่าง) ...
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ระบบยืม-คืนหนังสือ</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="เข้าสู่ระบบ" onPress={handleLogin} />
            <View style={{ marginTop: 10 }}>
                <Button title="สมัครสมาชิก" color="gray" onPress={() => navigation.navigate('Register')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});