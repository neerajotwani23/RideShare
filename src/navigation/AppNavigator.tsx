import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '../components/Icon';

// Auth Screens
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import RoleSelectionScreen from '../screens/Auth/RoleSelectionScreen';
import VehicleDetailsScreen from '../screens/Auth/VehicleDetailsScreen';

// Profile Screens
import ProfileSetupScreen from '../screens/Profile/ProfileSetupScreen';

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
import SuggestedRidesScreen from '../screens/Ride/SuggestedRidesScreen';

import ProfileStack from './ProfileStackNavigator';

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

// Passenger Tab Navigator
function PassengerTabs() {
  return (
    <Tab.Navigator 
      initialRouteName="Find Ride"
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
        name="Find Ride"
        component={FindRideScreen}
        options={{
          tabBarIcon: ({ color, size }) => <SearchIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="My Rides"
        component={MyRidesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <RidesIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => <WalletIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Chat"
        component={ChatBotScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ChatIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Driver Tab Navigator
function DriverTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Post Ride"
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
        name="Post Ride" 
        component={PostRideScreen}
        options={{
          tabBarIcon: ({ color, size }) => <PlusIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="My Rides" 
        component={MyRidesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <RidesIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => <WalletIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatBotScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ChatIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Icon Components (using centralized Icon component)
const SearchIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="magnify" size={size} color={color} />
);

const PlusIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="plus-circle-outline" size={size} color={color} />
);

const RidesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="car-outline" size={size} color={color} />
);

const ChatIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="chat-outline" size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="account-outline" size={size} color={color} />
);

const WalletIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="wallet" size={size} color={color} />
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, roleSelected, profileSetupComplete, currentRole } = useAuth();

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
            {currentRole === 'passenger' ? (
              <Stack.Screen name="PassengerTabs" component={PassengerTabs} />
            ) : (
              <Stack.Screen name="DriverTabs" component={DriverTabs} />
            )}
            <Stack.Screen name="SuggestedRides" component={SuggestedRidesScreen} />
            {/* Ride Flow Screens - Accessible from any tab */}
            <Stack.Screen name="DuringRide" component={DuringRideScreen} />
            <Stack.Screen name="RateRide" component={RateRideScreen} />
            <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 