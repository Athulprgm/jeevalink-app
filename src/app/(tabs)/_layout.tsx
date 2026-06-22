import { Tabs, router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Home, Search, Bell, Droplet, User, Settings, Plus } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#757575',
        tabBarActiveTintColor: '#E53935',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 72,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderColor: '#F0F0F0',
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          // Light top shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarItemStyle: {
          height: 52,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} fill={focused ? '#E53935' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="find-donors"
        options={{
          title: 'Find',
          tabBarIcon: ({ color, focused }) => (
            <Search color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <Bell color={color} size={24} strokeWidth={focused ? 2.5 : 2} fill={focused ? '#E53935' : 'none'} />
          ),
        }}
      />
      
      {/* CENTER FAB: Emergency */}
      <Tabs.Screen
        name="blood-request/emergency"
        options={{
          title: 'Emergency',
          tabBarLabelStyle: { color: '#E53935', fontSize: 10, fontWeight: '700', marginTop: 4, marginBottom: Platform.OS === 'ios' ? 0 : 4 },
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                position: 'absolute',
                bottom: -8, // Shifts the circle up outside the bar while maintaining label alignment
                alignItems: 'center',
                justifyContent: 'center',
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: '#E53935',
                shadowColor: '#E53935',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 8,
              }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet color="#FFFFFF" size={28} strokeWidth={2.5} fill="#FFFFFF" />
                  <Plus color="#E53935" size={14} strokeWidth={4} style={{ position: 'absolute', marginTop: 4 }} />
                </View>
              </View>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <Droplet color={color} size={24} strokeWidth={focused ? 2.5 : 2} fill={focused ? '#E53935' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} fill={focused ? '#E53935' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Settings color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      {/* Hidden screens */}
      <Tabs.Screen name="blood-request/create" options={{ href: null }} />
      <Tabs.Screen name="blood-request/history" options={{ href: null }} />
    </Tabs>
  );
}

