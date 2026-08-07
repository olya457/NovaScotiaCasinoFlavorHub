import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {CoveLedger} from '../scenes/coveLedger/CoveLedger';
import {AuroraPassage} from '../scenes/auroraPassage/AuroraPassage';
import {EmberPrelude} from '../scenes/emberPrelude/EmberPrelude';
import {HarbourOrbit} from './HarbourOrbit';
import {RootStack} from './routeTypes';

const Stack = createNativeStackNavigator<RootStack>();
const theme = {...DarkTheme, colors: {...DarkTheme.colors, background: '#08101F', card: '#08101F'}};

export function NorthstarNavigator() {
  return <NavigationContainer theme={theme}><Stack.Navigator initialRouteName="EmberPrelude" screenOptions={{headerShown: false, animation: 'fade', contentStyle: {backgroundColor: '#08101F'}}}><Stack.Screen name="EmberPrelude" component={EmberPrelude} options={{animation: 'none'}} /><Stack.Screen name="AuroraPassage" component={AuroraPassage} options={{animation: 'fade'}} /><Stack.Screen name="HarbourOrbit" component={HarbourOrbit} options={{animation: 'fade'}} /><Stack.Screen name="CoveLedger" component={CoveLedger} options={{animation: 'slide_from_right'}} /></Stack.Navigator></NavigationContainer>;
}

