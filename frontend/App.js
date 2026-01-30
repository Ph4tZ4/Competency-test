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
                        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ห้องสมุด' }} initialParams={{ user }} />
                        <Stack.Screen name="Borrow" component={BorrowScreen} options={{ title: 'ยืมหนังสือ' }} />
                        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'ประวัติการยืม-คืน' }} />
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