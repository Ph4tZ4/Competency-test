import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
            // ส่งข้อมูลไปสมัครสมาชิก (Role: member เป็นค่า default จาก backend อยู่แล้ว)
            await axiosClient.post('/register', {
                username,
                password,
                role: 'member' // หรือถ้าอยากเทส Admin ให้แก้ตรงนี้เป็น 'admin'
            });

            Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อย', [
                { text: 'ตกลง', onPress: () => navigation.goBack() } // กดตกลงแล้วกลับไปหน้า Login
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว หรือระบบมีปัญหา');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>สมัครสมาชิกใหม่</Text>
            <TextInput
                style={styles.input}
                placeholder="ตั้งชื่อผู้ใช้ (Username)"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="ตั้งรหัสผ่าน (Password)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="ยืนยันการสมัคร" onPress={handleRegister} color="#28a745" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5 }
});