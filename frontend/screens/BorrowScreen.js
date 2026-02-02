import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Platform, Image } from 'react-native';
import axiosClient, { BASE_URL } from '../api/axiosClient';

export default function BorrowScreen({ route, navigation }) {
    const { book, user } = route.params;

    const handleConfirmBorrow = async () => {
        try {
            await axiosClient.post('/borrow', {
                user_id: user._id,
                book_id: book._id
            });

            Alert.alert('Success', 'Borrow request submitted. Please wait for admin approval.', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Main') // Navigate to the Tab Navigator
                }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Could not borrow book. It might be out of stock.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.screenTitle}>Confirm Borrow</Text>

                <View style={styles.card}>
                    {book.coverImage && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: book.coverImage.startsWith('http') ? book.coverImage : `${BASE_URL}${book.coverImage}` }}
                                style={styles.bookImage}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>by {book.author}</Text>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Book ID</Text>
                        <Text style={styles.infoValue}>{book._id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Borrower</Text>
                        <Text style={styles.infoValue}>{user.username}</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBorrow}>
                        <Text style={styles.confirmButtonText}>Confirm Borrow</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        padding: 20,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 24,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 30,
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    bookImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
    },
    bookTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
        textAlign: 'center',
    },
    bookAuthor: {
        fontSize: 17,
        color: '#8e8e93',
        textAlign: 'center',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 15,
        color: '#8e8e93',
    },
    infoValue: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
    },
    actions: {
        marginTop: 'auto',
    },
    confirmButton: {
        backgroundColor: '#34C759',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#34C759",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontSize: 17,
        fontWeight: '500',
    },
});