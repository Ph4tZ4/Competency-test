import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import axiosClient from '../api/axiosClient';

export default function HistoryScreen({ route, navigation }) {
    const { user } = route.params;
    const [history, setHistory] = useState([]);

    // ฟังก์ชันดึงประวัติ
    const fetchHistory = async () => {
        try {
            const response = await axiosClient.get(`/history/${user._id}`);
            setHistory(response.data);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'โหลดประวัติไม่สำเร็จ');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // ฟังก์ชันคืนหนังสือ
    const handleReturn = async (transactionId) => {
        try {
            await axiosClient.post('/return', {
                transaction_id: transactionId
            });

            Alert.alert('สำเร็จ', 'คืนหนังสือเรียบร้อยแล้ว');
            fetchHistory(); // โหลดข้อมูลใหม่เพื่ออัปเดตสถานะปุ่ม
        } catch (error) {
            Alert.alert('Error', 'คืนหนังสือไม่สำเร็จ');
        }
    };

    const renderItem = ({ item }) => {
        // เช็คว่า item.book_id มีค่าไหม (เผื่อกรณีหนังสือถูกลบไปแล้ว)
        const bookTitle = item.book_id ? item.book_id.title : 'หนังสือถูกลบจากระบบ';
        const isBorrowed = item.status === 'borrowed';

        return (
            <View style={[styles.card, isBorrowed ? styles.borderActive : styles.borderReturned]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.bookTitle}>{bookTitle}</Text>
                    <Text>วันที่ยืม: {new Date(item.borrow_date).toLocaleDateString('th-TH')}</Text>
                    <Text>กำหนดคืน: {new Date(item.due_date).toLocaleDateString('th-TH')}</Text>

                    {item.return_date && (
                        <Text style={{ color: 'green' }}>
                            คืนเมื่อ: {new Date(item.return_date).toLocaleDateString('th-TH')}
                        </Text>
                    )}

                    <Text style={{ fontWeight: 'bold', marginTop: 5, color: isBorrowed ? 'orange' : 'green' }}>
                        สถานะ: {isBorrowed ? 'กำลังยืม (Borrowed)' : 'คืนแล้ว (Returned)'}
                    </Text>
                </View>

                {/* ปุ่มคืนหนังสือ (แสดงเฉพาะตอนที่ยังไม่คืน) */}
                {isBorrowed && (
                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() => handleReturn(item._id)}
                    >
                        <Text style={{ color: '#fff' }}>กดคืน</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>ประวัติการยืม-คืน</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshing={false}
                onRefresh={fetchHistory} // ดึงลงเพื่อรีเฟรช
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>ยังไม่มีประวัติการยืม</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
    borderActive: { borderColor: 'orange' },
    borderReturned: { borderColor: '#ccc' },
    bookTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    returnButton: { backgroundColor: '#dc3545', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, marginLeft: 10 }
});