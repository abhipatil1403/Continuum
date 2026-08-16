import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';

// Import screens
import SelectionScreen from './src/screens/SelectionScreen';
import FarmerLoginScreen from './src/screens/FarmerLoginScreen';
import FarmerRegistrationScreen from './src/screens/FarmerRegistrationScreen';
import FarmerDashboardScreen from './src/screens/FarmerDashboardScreen';
import FarmerHistoryScreen from './src/screens/FarmerHistoryScreen';
import FarmerProfileScreen from './src/screens/FarmerProfileScreen';
import ProductScanningScreen from './src/screens/ProductScanningScreen';
import GradingScreen from './src/screens/GradingScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import UserLoginScreen from './src/screens/UserLoginScreen';
import UserSignupScreen from './src/screens/UserSignupScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import VerificationHistoryScreen from './src/screens/VerificationHistoryScreen';
import MyReviewsScreen from './src/screens/MyReviewsScreen';
import LocationPickerScreen from './src/screens/LocationPickerScreen';

// Import navigation
import TabNavigator from './src/navigation/TabNavigator';

// Import components
import ErrorBoundary from './src/components/ErrorBoundary';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    ExpoSplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <NavigationContainer onReady={() => ExpoSplashScreen.hideAsync()}>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Selection"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1c7e38',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* Selection Screen */}
          <Stack.Screen 
            name="Selection" 
            component={SelectionScreen}
            options={{ headerShown: false }}
          />
          
          {/* Farmer Screens */}
          <Stack.Screen 
            name="FarmerLogin" 
            component={FarmerLoginScreen}
            options={{ title: 'Farmer Login' }}
          />
          <Stack.Screen 
            name="FarmerRegistration" 
            component={FarmerRegistrationScreen}
            options={{ title: 'Farmer Registration' }}
          />
          <Stack.Screen 
            name="FarmerDashboard" 
            component={FarmerDashboardScreen}
            options={{ title: 'Farmer Dashboard' }}
          />
          <Stack.Screen 
            name="FarmerHistory" 
            component={FarmerHistoryScreen}
            options={{ title: 'Grading History' }}
          />
          <Stack.Screen 
            name="FarmerProfile" 
            component={FarmerProfileScreen}
            options={{ title: 'Farmer Profile' }}
          />
          <Stack.Screen 
            name="ProductScanning" 
            component={ProductScanningScreen}
            options={{ title: 'Scan Product' }}
          />
          <Stack.Screen 
            name="Grading" 
            component={GradingScreen}
            options={{ title: 'Product Grading' }}
          />
          <Stack.Screen 
            name="QRCode" 
            component={QRCodeScreen}
            options={{ title: 'QR Code Generated' }}
          />
          
          {/* User Screens */}
          <Stack.Screen 
            name="UserLogin" 
            component={UserLoginScreen}
            options={{ title: 'User Login' }}
          />
          <Stack.Screen 
            name="UserSignup" 
            component={UserSignupScreen}
            options={{ title: 'User Signup' }}
          />
          <Stack.Screen 
            name="UserTabs" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProductDetails" 
            component={ProductDetailsScreen}
            options={{ title: 'Product Details' }}
          />
          <Stack.Screen 
            name="Review" 
            component={ReviewScreen}
            options={{ title: 'Review Farmer' }}
          />
          <Stack.Screen 
            name="VerificationHistory" 
            component={VerificationHistoryScreen}
            options={{ title: 'Verification History' }}
          />
          <Stack.Screen 
            name="MyReviews" 
            component={MyReviewsScreen}
            options={{ title: 'My Reviews' }}
          />
          <Stack.Screen 
            name="LocationPicker" 
            component={LocationPickerScreen}
            options={{ title: 'Pick Location' }}
          />
        </Stack.Navigator>
        </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}