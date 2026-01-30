import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // ใช้เช็คว่ากำลังโหลดข้อมูลเก่าอยู่ไหม

    // 1. ตอนเปิดแอป ให้เช็คว่ามี user เก็บไว้ไหม
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false); // โหลดเสร็จแล้ว
            }
        };
        loadUser();
    }, []);

    // 2. ฟังก์ชัน Login: บันทึกข้อมูลลงเครื่อง
    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    };

    // 3. ฟังก์ชัน Logout: ลบข้อมูลออกจากเครื่อง
    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('userData');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};