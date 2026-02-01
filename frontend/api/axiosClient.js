import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ สำคัญมาก: เปลี่ยนตรงนี้เป็น IP Address เครื่องคุณ!
// ห้ามใช้ localhost เพราะมือถือจะมองไม่เห็น
const BASE_URL = 'http://192.168.1.116:3000';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    async (config) => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        } catch (error) {
            console.error('Error attaching token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;