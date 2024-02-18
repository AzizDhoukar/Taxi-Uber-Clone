import React from 'react';
import { ThemeProvider } from 'styled-components';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import theme from './theme';

import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_300Light,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';

import Home from './screens/Home';
import Verification from './screens/Verification';
import CurrentLocation from './screens/CurrentLocation';
import SelectDestination from './screens/SelectDestination';
import Request from './screens/Request';
import YourRide from './screens/YourRide';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();


export default function App() {

  let [fontsLoaded, fontError] = useFonts({
    OpenSans_400Regular,
    OpenSans_300Light,
    OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CurrentLocation" component={CurrentLocation} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="SelectDestination" component={SelectDestination} />
          <Stack.Screen name="Request" component={Request} />
          <Stack.Screen name="YourRide" component={YourRide} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}


