import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import axiosClient from '../api/axiosClient';

export default function HistoryScreen({ route, navigation }) {
    const { user } = route.params;
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const response = await axiosClient.get(`/history/${user._id}`);
            setHistory(response.data);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to load history');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleReturn = async (transactionId) => {
        try {
            await axiosClient.post('/return', {
                transaction_id: transactionId
            });

            Alert.alert('Success', 'Book returned successfully');
            fetchHistory();
        } catch (error) {
            Alert.alert('Error', 'Could not return book');
        }
    };

    const renderItem = ({ item }) => {
        const bookTitle = item.book_id ? item.book_id.title : 'Details not available';
        const isBorrowed = item.status === 'borrowed';
        const isPending = item.status === 'pending';
        const isRejected = item.status === 'rejected';
        const isReturned = item.status === 'returned';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.bookTitle}>{bookTitle}</Text>
                    {isBorrowed && (
                        <View style={styles.badgeBorrowed}>
                            <Text style={styles.badgeTextBorrowed}>Borrowed</Text>
                        </View>
                    )}
                    {isPending && (
                        <View style={styles.badgePending}>
                            <Text style={styles.badgeTextPending}>Pending</Text>
                        </View>
                    )}
                    {isRejected && (
                        <View style={styles.badgeRejected}>
                            <Text style={styles.badgeTextRejected}>Rejected</Text>
                        </View>
                    )}
                    {isReturned && (
                        <View style={styles.badgeReturned}>
                            <Text style={styles.badgeTextReturned}>Returned</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Borrowed:</Text>
                        <Text style={styles.infoValue}>{new Date(item.borrow_date).toLocaleDateString('th-TH')}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Due Date:</Text>
                        <Text style={styles.infoValue}>{new Date(item.due_date).toLocaleDateString('th-TH')}</Text>
                    </View>
                    {item.return_date && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Returned On:</Text>
                            <Text style={styles.infoValue}>{new Date(item.return_date).toLocaleDateString('th-TH')}</Text>
                        </View>
                    )}
                </View>

                {isBorrowed && (
                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() => handleReturn(item._id)}
                    >
                        <Text style={styles.returnButtonText}>Return Book</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>My History</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshing={false}
                onRefresh={fetchHistory}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No history found.</Text>
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
    screenTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Increased for floating tab bar
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bookTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        marginRight: 8,
    },
    badgeBorrowed: {
        backgroundColor: '#FFF4E5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeTextBorrowed: {
        color: '#FF9500', // iOS Orange
        fontSize: 12,
        fontWeight: '600',
    },
    badgeReturned: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeTextReturned: {
        color: '#34C759', // iOS Green
        fontSize: 12,
        fontWeight: '600',
    },
    badgePending: {
        backgroundColor: '#E5F1FB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeTextPending: {
        color: '#007AFF', // iOS Blue
        fontSize: 12,
        fontWeight: '600',
    },
    badgeRejected: {
        backgroundColor: '#FFE5E5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeTextRejected: {
        color: '#FF3B30', // iOS Red
        fontSize: 12,
        fontWeight: '600',
    },
    infoContainer: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: '#8e8e93',
        width: 100,
    },
    infoValue: {
        fontSize: 14,
        color: '#000',
    },
    returnButton: {
        backgroundColor: '#FF3B30', // iOS Red
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 4,
    },
    returnButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8e8e93',
    },
});