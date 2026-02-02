import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import axiosClient from '../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }) {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await axiosClient.get('/admin/dashboard');
            setBorrowedBooks(response.data);
        } catch (error) {
            Alert.alert('Error', 'ไม่สามารถดึงข้อมูล Dashboard ได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrowedBooks();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchBorrowedBooks();
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="book" size={24} color="#007AFF" />
                <Text style={styles.bookTitle} numberOfLines={1}>{item.book_id?.title || 'Unknown Book'}</Text>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.row}>
                    <Text style={styles.label}>Borrowed By:</Text>
                    <Text style={styles.value}>{item.user_id?.username || 'Unknown User'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Due Date:</Text>
                    <Text style={styles.value}>{new Date(item.due_date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Borrowed</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Text style={styles.subHeader}>Borrowed Books Overview</Text>
                <TouchableOpacity
                    style={styles.requestButton}
                    onPress={() => navigation.navigate('AdminRequests')}
                >
                    <Ionicons name="notifications" size={20} color="#fff" />
                    <Text style={styles.requestButtonText}>Manage Requests</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={borrowedBooks}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchBorrowedBooks}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No books are currently borrowed.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5ea',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    subHeader: {
        fontSize: 16,
        color: '#8e8e93',
        marginTop: 5,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f7',
        paddingBottom: 8,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
    },
    cardContent: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        color: '#8e8e93',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 4,
    },
    statusText: {
        color: '#FF9500',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#8e8e93',
        fontSize: 16,
    },
    requestButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    requestButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    }
});
