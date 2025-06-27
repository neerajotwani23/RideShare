import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';

// Auth Screens
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import RoleSelectionScreen from '../screens/Auth/RoleSelectionScreen';
import VehicleDetailsScreen from '../screens/Auth/VehicleDetailsScreen';

// Profile Screens
import ProfileSetupScreen from '../screens/Profile/ProfileSetupScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import ReviewsScreen from '../screens/Profile/ReviewsScreen';

// Main App Screens
import HomeScreen from '../screens/Home/HomeScreen';
import PostRideScreen from '../screens/Ride/PostRideScreen';
import FindRideScreen from '../screens/Ride/FindRideScreen';
import RideDetailsScreen from '../screens/Ride/RideDetailsScreen';
import DuringRideScreen from '../screens/Ride/DuringRideScreen';
import RateRideScreen from '../screens/Ride/RateRideScreen';
import MyRidesScreen from '../screens/Booking/MyRidesScreen';
import BookingDetailsScreen from '../screens/Booking/BookingDetailsScreen';
import ChatBotScreen from '../screens/ChatBot/ChatBotScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import WalletScreen from '../screens/Wallet/WalletScreen';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
      <Stack.Screen name="DuringRide" component={DuringRideScreen} />
      <Stack.Screen name="RateRide" component={RateRideScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

// Find Ride Stack Navigator
function FindRideStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FindRideMain" component={FindRideScreen} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
      <Stack.Screen name="DuringRide" component={DuringRideScreen} />
      <Stack.Screen name="RateRide" component={RateRideScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
  );
}

// Post Ride Stack Navigator
function PostRideStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PostRideMain" component={PostRideScreen} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
      <Stack.Screen name="DuringRide" component={DuringRideScreen} />
      <Stack.Screen name="RateRide" component={RateRideScreen} />
    </Stack.Navigator>
  );
}

// My Rides Stack Navigator
function MyRidesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyRidesMain" component={MyRidesScreen} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
      <Stack.Screen name="DuringRide" component={DuringRideScreen} />
      <Stack.Screen name="RateRide" component={RateRideScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Find Ride" 
        component={FindRideStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SearchIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Post Ride" 
        component={PostRideStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <PlusIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="My Rides" 
        component={MyRidesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <RidesIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatBotScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChatIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Simple Icon Components (using React Native Paper IconButton)
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <IconButton 
    icon="home-outline" 
    size={size} 
    iconColor={color} 
    style={{ margin: 0 }}
  />
);

const SearchIcon = ({ color, size }: { color: string; size: number }) => (
  <IconButton 
    icon="magnify" 
    size={size} 
    iconColor={color} 
    style={{ margin: 0 }}
  />
);

const PlusIcon = ({ color, size }: { color: string; size: number }) => (
  <IconButton 
    icon="plus-circle-outline" 
    size={size} 
    iconColor={color} 
    style={{ margin: 0 }}
  />
);

const RidesIcon = ({ color, size }: { color: string; size: number }) => (
  <IconButton 
    icon="car-outline" 
    size={size} 
    iconColor={color} 
    style={{ margin: 0 }}
  />
);

const ChatIcon = ({ color, size }: { color: string; size: number }) => (
  <IconButton 
    icon="chat-outline" 
    size={size} 
    iconColor={color} 
    style={{ margin: 0 }}
  />
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, roleSelected, profileSetupComplete } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Flow
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : !roleSelected ? (
          // Role Selection
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        ) : !profileSetupComplete ? (
          // Profile Setup Flow
          <>
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
          </>
        ) : (
          // Main App
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            
            {/* Global Modal Screens */}
            <Stack.Screen 
              name="WalletModal" 
              component={WalletScreen} 
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="NotificationsModal" 
              component={NotificationsScreen} 
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="ProfileModal" 
              component={ProfileStack} 
              options={{ presentation: 'modal' }}
            />
            
            {/* Ride Flow Screens - Accessible from any tab */}
            <Stack.Screen name="DuringRide" component={DuringRideScreen} />
            <Stack.Screen name="RateRide" component={RateRideScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 