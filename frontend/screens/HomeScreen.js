import React, { useState, useEffect, useContext } from 'react'; // เพิ่ม useContext
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext'; // Import Context

// ไม่ต้องรับ { route } แล้ว เพราะเราเอา user มาจาก Context ได้เลย (หรือจะรับไว้เหมือนเดิมก็ได้ไม่ผิด)
export default function HomeScreen({ navigation }) {

    // เรียกใช้ user และ logout จาก Context
    const { user, logout } = useContext(AuthContext);

    const [books, setBooks] = useState([]);

    // ... (ส่วน fetchBooks เหมือนเดิม) ...
    const fetchBooks = async () => {
        try {
            const response = await axiosClient.get('/books');
            setBooks(response.data);
        } catch (error) {
            Alert.alert('Error', 'ไม่สามารถดึงข้อมูลหนังสือได้');
        }
    };

    useEffect(() => {
        fetchBooks();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchBooks();
        });
        return unsubscribe;
    }, [navigation]);

    const handleBorrowPress = (book) => {
        if (book.quantity < 1) {
            Alert.alert('เสียใจด้วย', 'หนังสือเล่มนี้ถูกยืมหมดแล้ว');
            return;
        }
        // ส่ง user ไปด้วยเหมือนเดิม
        navigation.navigate('Borrow', { book, user });
    };

    // ... (ส่วน renderBookItem เหมือนเดิม) ...
    const renderBookItem = ({ item }) => (
        <View style={styles.card}>
            <View>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text>ผู้แต่ง: {item.author}</Text>
                <Text style={{ color: item.quantity > 0 ? 'green' : 'red' }}>
                    สถานะ: {item.quantity > 0 ? 'ว่าง (Available)' : 'ถูกยืมหมด (Out of Stock)'}
                </Text>
            </View>
            {item.quantity > 0 && (
                <TouchableOpacity
                    style={styles.borrowButton}
                    onPress={() => handleBorrowPress(item)}
                >
                    <Text style={{ color: '#fff' }}>ยืม</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>สวัสดี, {user.username}</Text>

                {/* ✅ เปลี่ยนปุ่ม Logout ให้เรียกใช้ logout() */}
                <Button title="ออกจากระบบ" color="red" onPress={logout} />

            </View>

            <Text style={styles.sectionTitle}>รายการหนังสือทั้งหมด</Text>

            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={renderBookItem}
                refreshing={false}
                onRefresh={fetchBooks}
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title="ดูประวัติการยืม-คืนของฉัน"
                    onPress={() => navigation.navigate('History', { user })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    welcomeText: { fontSize: 18, fontWeight: 'bold' },
    sectionTitle: { fontSize: 20, marginBottom: 10 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    bookTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    borrowButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 }
});