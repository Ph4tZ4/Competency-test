import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import axiosClient from '../api/axiosClient';

export default function EditBookScreen({ route, navigation }) {
    const { book } = route.params;

    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [quantity, setQuantity] = useState(book.quantity.toString());
    const [coverImage, setCoverImage] = useState(book.coverImage || '');

    const handleUpdateBook = async () => {
        if (!title || !author || !quantity) {
            Alert.alert('Missing Information', 'Please fill in all fields.');
            return;
        }

        try {
            await axiosClient.put(`/books/${book._id}`, {
                title,
                author,
                quantity: parseInt(quantity),
                coverImage
            });

            Alert.alert('Success', 'Book updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Could not update book.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Edit Book</Text>
                    <Text style={styles.headerSubtitle}>Update book details below</Text>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter book title"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#C7C7CC"
                        />
                    </View>
                    <View style={styles.separator} />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Author</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter author name"
                            value={author}
                            onChangeText={setAuthor}
                            placeholderTextColor="#C7C7CC"
                        />
                    </View>
                    <View style={styles.separator} />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                            placeholderTextColor="#C7C7CC"
                        />
                    </View>
                    <View style={styles.separator} />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Image URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://example.com/image.jpg"
                            value={coverImage}
                            onChangeText={setCoverImage}
                            placeholderTextColor="#C7C7CC"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdateBook}>
                        <Text style={styles.saveButtonText}>Update Book</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
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
        padding: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#8e8e93',
    },
    formGroup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        width: 80,
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginLeft: 16,
    },
    actions: {
        marginTop: 'auto',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontSize: 17,
    },
});
