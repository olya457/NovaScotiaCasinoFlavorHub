import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {flavorVenues} from '../../domain/flavorHubData';
import {artwork} from '../../foundation/assets';
import {palette} from '../../foundation/palette';
import {MainStackParamList, TabParamList} from '../../navigation/routeTypes';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {ScreenFrame} from '../../ui/ScreenFrame';

const mapPins = [
  {top: '18%', left: '45%'},
  {top: '34%', left: '66%'},
  {top: '55%', left: '28%'},
  {top: '69%', left: '57%'},
] as const;

type Props = BottomTabScreenProps<TabParamList, 'FlavorMapScreen'>;

export function FlavorMapScreen(_: Props) {
  const stackNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedVenue = selectedIndex === null ? null : flavorVenues[selectedIndex];

  return (
    <ScreenFrame>
      <HarbourHeader title="Flavor Map" subtitle="NOVA SCOTIA CASINO • DESTINATIONS" />
      <View style={styles.stage}>
        {selectedVenue ? <Pressable style={styles.dismissLayer} onPress={() => setSelectedIndex(null)} /> : null}
        <Image source={artwork.map} style={styles.map} />
        {mapPins.map((pin, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedIndex(current => current === index ? null : index)}
            hitSlop={14}
            style={[styles.pin, pin]}>
            <Text style={styles.pinText}>●</Text>
            <View style={styles.pinTail} />
          </Pressable>
        ))}
        {selectedVenue ? (
          <View style={styles.card}>
            <Pressable onPress={() => setSelectedIndex(null)} hitSlop={12} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
            <Image source={selectedVenue.image} style={styles.thumb} />
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>{selectedVenue.title}</Text>
              <Text style={styles.cardMeta}>{selectedVenue.serviceType} · {selectedVenue.schedule}</Text>
              <Text style={styles.cardBody}>{selectedVenue.summary}</Text>
              <Pressable onPress={() => stackNavigation.navigate('VenueDetailScreen', {venue: selectedVenue})}>
                <Text style={styles.cardAction}>OPEN VENUE DETAILS</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stage: {flex: 1, marginTop: 10, marginBottom: 100},
  map: {width: '100%', height: '100%', resizeMode: 'cover'},
  dismissLayer: {...StyleSheet.absoluteFill, zIndex: 1},
  pin: {position: 'absolute', width: 42, height: 52, alignItems: 'center', justifyContent: 'flex-start', zIndex: 3},
  pinText: {width: 38, height: 38, textAlign: 'center', textAlignVertical: 'center', borderRadius: 19, backgroundColor: palette.blueDeep, borderWidth: 2, borderColor: '#76A9F4', color: palette.white, fontSize: 14, lineHeight: 34},
  pinTail: {width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: palette.blueDeep, marginTop: -3},
  card: {position: 'absolute', left: 14, right: 14, bottom: 16, backgroundColor: palette.panel, borderRadius: 20, borderWidth: 1, borderColor: palette.line, padding: 14, flexDirection: 'row', zIndex: 4},
  close: {position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(8,16,31,0.82)', alignItems: 'center', justifyContent: 'center', zIndex: 5},
  closeText: {color: palette.white, fontSize: 22, lineHeight: 24},
  thumb: {width: 92, height: 88, borderRadius: 13},
  cardCopy: {flex: 1, marginLeft: 12, paddingRight: 22},
  cardTitle: {color: palette.white, fontWeight: '700', fontSize: 15},
  cardMeta: {color: palette.blue, fontSize: 10, marginTop: 5},
  cardBody: {color: palette.mist, fontSize: 10, lineHeight: 16, marginTop: 7},
  cardAction: {color: palette.white, fontSize: 10, fontWeight: '800', marginTop: 10},
});
