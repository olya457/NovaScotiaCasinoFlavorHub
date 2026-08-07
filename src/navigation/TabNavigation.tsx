import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {TabParamList} from './routeTypes';
import {palette} from '../foundation/palette';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {VenueGuideScreen} from '../screens/VenueGuideScreen/VenueGuideScreen';
import {FlavorMapScreen} from '../screens/FlavorMapScreen/FlavorMapScreen';
import {MenuScreen} from '../screens/MenuScreen/MenuScreen';
import {PlannerScreen} from '../screens/PlannerScreen/PlannerScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const tabArt = {
  HomeScreen: {idle: require('../assets/icons/visit.png'), active: require('../assets/icons/visit_active.png'), label: 'Hub'},
  VenueGuideScreen: {idle: require('../assets/icons/places.png'), active: require('../assets/icons/places_active.png'), label: 'Venues'},
  FlavorMapScreen: {idle: require('../assets/icons/map.png'), active: require('../assets/icons/map_active.png'), label: 'Map'},
  MenuScreen: {idle: require('../assets/icons/dining.png'), active: require('../assets/icons/dining_active.png'), label: 'Menu'},
  PlannerScreen: {idle: require('../assets/icons/preferences.png'), active: require('../assets/icons/preferences_active.png'), label: 'Plan'},
} as const;

export function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({focused}) => {
          const item = tabArt[route.name];
          return (
            <View style={styles.tabItem}>
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Image source={focused ? item.active : item.idle} style={styles.icon} resizeMode="contain" />
              </View>
            </View>
          );
        },
      })}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="VenueGuideScreen" component={VenueGuideScreen} />
      <Tab.Screen name="FlavorMapScreen" component={FlavorMapScreen} />
      <Tab.Screen name="MenuScreen" component={MenuScreen} />
      <Tab.Screen name="PlannerScreen" component={PlannerScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    height: 78,
    backgroundColor: 'rgba(21,39,66,0.98)',
    borderColor: palette.line,
    borderWidth: 1,
    borderRadius: 26,
    paddingTop: 10,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 16,
  },
  tabItem: {alignItems: 'center', justifyContent: 'center'},
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(41, 121, 229, 0.16)',
    borderColor: 'rgba(115, 168, 244, 0.36)',
  },
  icon: {width: 22, height: 22},
});
