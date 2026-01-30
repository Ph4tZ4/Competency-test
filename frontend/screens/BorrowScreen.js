import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axiosClient from '../api/axiosClient';

export default function BorrowScreen({ route, navigation }) {
    // รับข้อมูลที่ส่งมาจากหน้า Home
    const { book, user } = route.params;

    const handleConfirmBorrow = async () => {
        try {
            await axiosClient.post('/borrow', {
                user_id: user._id,
                book_id: book._id
            });

            Alert.alert('สำเร็จ', 'ยืมหนังสือเรียบร้อยแล้ว!', [
                {
                    text: 'ตกลง',
                    // พอกดตกลง ให้กลับไปหน้า Home (หน้า Home จะรีเฟรชเองเพราะเราเขียน logic ไว้แล้ว)
                    onPress: () => navigation.navigate('Home')
                }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('ผิดพลาด', 'ไม่สามารถยืมหนังสือได้ (หนังสืออาจจะหมดพอดี)');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>ยืนยันการยืมหนังสือ</Text>

            <View style={styles.card}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.info}>ผู้แต่ง: {book.author}</Text>
                <Text style={styles.info}>รหัสหนังสือ: {book._id}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button title="ยืนยันการยืม" onPress={handleConfirmBorrow} color="#28a745" />
                <View style={{ marginTop: 10 }}>
                    <Button title="ยกเลิก" onPress={() => navigation.goBack()} color="red" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    label: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 30, elevation: 3 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    info: { fontSize: 16, marginBottom: 5, color: '#555' },
    buttonContainer: { width: '100%' }
});