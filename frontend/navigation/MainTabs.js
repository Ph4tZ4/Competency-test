import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { View, Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UserListScreen from '../screens/UserListScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    const { user } = useContext(AuthContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'HistoryTab') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'DashboardTab') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (route.name === 'UsersTab') {
                        iconName = focused ? 'people' : 'people-outline';
                    }
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#000000', // Black active icon for white bg
                tabBarInactiveTintColor: '#8e8e93',
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    marginHorizontal: 20, // Provides spacing on mobile
                    width: '90%',         // Ensures it doesn't touch sides
                    alignSelf: 'center',  // Centers it horizontally
                    maxWidth: 400,        // Keeps it pill-shaped on wider screens (web)
                    elevation: 5,
                    backgroundColor: '#ffffff', // White background
                    borderRadius: 25,
                    height: 60,
                    borderTopWidth: 0,
                    paddingBottom: Platform.OS === 'ios' ? 0 : 0, // Reset padding
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.1, // Reduced opacity for lighter look
                    shadowRadius: 10,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    paddingTop: 4, // Higher by 2px (from 6)
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginBottom: 5
                },
                // Hiding the background of the tab bar container to make float effect work better
                tabBarBackground: () => (
                    <View style={{ flex: 1, backgroundColor: 'transparent' }} />
                ),
                safeAreaInsets: { bottom: 0 } // Override safe area to stick to our bottom margin
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            {user.role === 'admin' ? (
                <>
                    <Tab.Screen
                        name="DashboardTab"
                        component={DashboardScreen}
                        options={{ title: 'Dashboard' }}
                    />
                    <Tab.Screen
                        name="UsersTab"
                        component={UserListScreen}
                        options={{ title: 'Member' }}
                    />
                    <Tab.Screen
                        name="HistoryTab"
                        component={HistoryScreen}
                        options={{ title: 'History' }}
                        initialParams={{ user }}
                    />
                </>
            ) : (
                <Tab.Screen
                    name="HistoryTab"
                    component={HistoryScreen}
                    options={{ title: 'History' }}
                    initialParams={{ user }}
                />
            )}
        </Tab.Navigator>
    );
}
