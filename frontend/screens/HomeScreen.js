import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, TextInput } from 'react-native';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo, if not we can use generic text

export default function HomeScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchBooks = async (currentPage = 1, search = '') => {
        try {
            const response = await axiosClient.get(`/books?page=${currentPage}&limit=10&search=${search}`);
            // Check data structure based on new API: { data: [], meta: {} }
            if (response.data.data) {
                setBooks(response.data.data);
                setTotalPages(response.data.meta.total_pages);
            } else {
                // Fallback for old API just in case
                setBooks(response.data);
            }
        } catch (error) {
            Alert.alert('Error', 'ไม่สามารถดึงข้อมูลหนังสือได้');
        }
    };

    const handleSearch = () => {
        setPage(1); // Reset to first page
        fetchBooks(1, searchQuery);
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            fetchBooks(newPage, searchQuery);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            fetchBooks(newPage, searchQuery);
        }
    };

    useEffect(() => {
        fetchBooks(page, searchQuery);
        const unsubscribe = navigation.addListener('focus', () => {
            fetchBooks(page, searchQuery);
        });
        return unsubscribe;
    }, [navigation]);

    const handleBorrowPress = (book) => {
        if (book.quantity < 1) {
            Alert.alert('Out of Stock', 'This book is not available right now.');
            return;
        }
        navigation.navigate('Borrow', { book, user });
    };

    const renderBookItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>

                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: item.quantity > 0 ? '#34C759' : '#FF3B30' }
                    ]} />
                    <Text style={styles.statusText}>
                        {item.quantity > 0 ? 'Available' : 'Out of Stock'}
                    </Text>
                </View>
            </View>

            {item.quantity > 0 && (
                <TouchableOpacity
                    style={styles.borrowButton}
                    onPress={() => handleBorrowPress(item)}
                >
                    <Text style={styles.borrowButtonText}>Borrow</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const handleUserProfilePress = () => {
        Alert.alert(
            user.username,
            'Do you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.appTitle}>My Library</Text>
                <TouchableOpacity onPress={handleUserProfilePress}>
                    <Ionicons name="person-circle" size={40} color="#000000" />
                </TouchableOpacity>
            </View>

            {user.role === 'admin' && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddBook')}
                >
                    <Text style={styles.addButtonText}>+ Add New Book</Text>
                </TouchableOpacity>
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search books..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Library Collection</Text>

            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={renderBookItem}
                refreshing={false}
                onRefresh={() => fetchBooks(1, searchQuery)}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.paginationContainer}>
                        <TouchableOpacity
                            style={[styles.pageButton, page === 1 && styles.disabledButton]}
                            onPress={handlePrevPage}
                            disabled={page === 1}
                        >
                            <Text style={styles.pageButtonText}>Prev</Text>
                        </TouchableOpacity>

                        <Text style={styles.pageInfo}>{page} / {totalPages}</Text>

                        <TouchableOpacity
                            style={[styles.pageButton, page === totalPages && styles.disabledButton]}
                            onPress={handleNextPage}
                            disabled={page === totalPages}
                        >
                            <Text style={styles.pageButtonText}>Next</Text>
                        </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: '800', // Extra bold for iOS style
        color: '#000',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginTop: 20,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Increased for floating tab bar
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 12,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    pageButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    disabledButton: {
        backgroundColor: '#C7C7CC',
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    pageInfo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 15,
        color: '#8e8e93',
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 13,
        color: '#8e8e93',
        fontWeight: '500',
    },
    borrowButton: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 12,
    },
    borrowButtonText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 14,
    },
    addButton: {
        marginHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

});