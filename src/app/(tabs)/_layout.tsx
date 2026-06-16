import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Search, Droplet, Bell, User, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 72,
          borderRadius: 28,
          backgroundColor: 'rgba(255,255,255,0.97)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)',
          paddingBottom: 10,
          paddingTop: 10,
          // Premium multi-layer shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 24,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Home color={color} size={22} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="find-donors"
        options={{
          title: 'Find',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Search color={color} size={22} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Droplet
                color={color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
                fill={focused ? color : 'none'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Bell color={color} size={22} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <User color={color} size={22} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Settings color={color} size={22} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="blood-request/create" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeIconWrap: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
});
