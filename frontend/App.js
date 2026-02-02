import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context
import { AuthProvider, AuthContext } from './context/AuthContext';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import BorrowScreen from './screens/BorrowScreen';
import HistoryScreen from './screens/HistoryScreen';
import AddBookScreen from './screens/AddBookScreen';
import EditBookScreen from './screens/EditBookScreen';
import AdminRequestsScreen from './screens/AdminRequestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MainTabs from './navigation/MainTabs';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    const { user, isLoading } = useContext(AuthContext);

    // ถ้ากำลังโหลดข้อมูลจากเครื่อง ให้หมุนๆ รอก่อน
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // === Zone คนล็อกอินแล้ว ===
                    <>
                        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="Borrow" component={BorrowScreen} options={{ title: 'ยืมหนังสือ' }} />
                        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'เพิ่มหนังสือ (Admin)' }} />
                        <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'แก้ไขหนังสือ (Admin)' }} />
                        <Stack.Screen name="AdminRequests" component={AdminRequestsScreen} options={{ title: 'คำร้องขอยืมหนังสือ', headerShown: false }} />
                        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'ข้อมูลส่วนตัว' }} />
                    </>
                ) : (
                    // === Zone คนยังไม่ล็อกอิน ===
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'เข้าสู่ระบบ' }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'สมัครสมาชิก' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// หุ้ม App ทั้งหมดด้วย AuthProvider
export default function App() {
    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
}