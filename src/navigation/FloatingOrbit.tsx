import React from 'react';
import {Image, ImageSourcePropType, Platform, Pressable, StyleSheet, View} from 'react-native';
import {palette} from '../foundation/palette';
import {OrbitKey} from './routeTypes';

const items: {key: OrbitKey; icon: ImageSourcePropType; activeIcon: ImageSourcePropType; label: string}[] = [
  {key: 'TideWelcome', icon: require('../assets/icons/visit.png'), activeIcon: require('../assets/icons/visit_active.png'), label: 'My Visit'},
  {key: 'QuayDirectory', icon: require('../assets/icons/places.png'), activeIcon: require('../assets/icons/places_active.png'), label: 'Places'},
  {key: 'ConstellationAtlas', icon: require('../assets/icons/map.png'), activeIcon: require('../assets/icons/map_active.png'), label: 'Map'},
  {key: 'GalleyMarket', icon: require('../assets/icons/dining.png'), activeIcon: require('../assets/icons/dining_active.png'), label: 'Dining'},
  {key: 'BerthKeeper', icon: require('../assets/icons/parking.png'), activeIcon: require('../assets/icons/parking_active.png'), label: 'Parking'},
  {key: 'LumenCabin', icon: require('../assets/icons/preferences.png'), activeIcon: require('../assets/icons/preferences_active.png'), label: 'Preferences'},
];

export function FloatingOrbit({active, onChange}: {active: OrbitKey; onChange: (key: OrbitKey) => void}) {
  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <View style={styles.dock}>
        {items.map(item => {
          const chosen = item.key === active;
          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              style={({pressed}) => [styles.item, pressed && styles.itemPressed]}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{selected: chosen}}>
              <View style={[styles.iconHalo, chosen && styles.iconHaloActive]}>
                <Image
                  source={chosen ? item.activeIcon : item.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {position: 'absolute', left: 12, right: 12, bottom: Platform.OS === 'android' ? 30 : 20},
  dock: {height: 66, borderRadius: 24, backgroundColor: 'rgba(21,39,66,0.98)', borderWidth: 1, borderColor: palette.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: {width: 0, height: 9}, elevation: 16},
  item: {flex: 1, height: 58, alignItems: 'center', justifyContent: 'center'},
  itemPressed: {opacity: 0.68},
  iconHalo: {width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent'},
  iconHaloActive: {backgroundColor: 'rgba(41, 121, 229, 0.16)', borderColor: 'rgba(115, 168, 244, 0.36)'},
  icon: {width: 25, height: 25},
});
