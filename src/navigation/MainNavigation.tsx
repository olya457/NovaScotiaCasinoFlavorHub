import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {MainStackParamList} from './routeTypes';
import {palette} from '../foundation/palette';
import {TabNavigation} from './TabNavigation';
import {SplashScreen} from '../screens/SplashScreen/SplashScreen';
import {IntroScreen} from '../screens/IntroScreen/IntroScreen';
import {VenueDetailScreen} from '../screens/VenueDetailScreen/VenueDetailScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const flavorTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: palette.ink,
    card: palette.ink,
    border: palette.line,
    primary: palette.blue,
    text: palette.white,
  },
};

export function MainNavigation() {
  return (
    <NavigationContainer theme={flavorTheme}>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false, contentStyle: {backgroundColor: palette.ink}}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{animation: 'none'}} />
        <Stack.Screen name="IntroScreen" component={IntroScreen} options={{animation: 'fade'}} />
        <Stack.Screen name="MainTabs" component={TabNavigation} options={{animation: 'fade'}} />
        <Stack.Screen name="VenueDetailScreen" component={VenueDetailScreen} options={{animation: 'slide_from_right'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

