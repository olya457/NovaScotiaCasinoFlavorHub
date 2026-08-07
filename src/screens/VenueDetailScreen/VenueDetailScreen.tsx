import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {MainStackParamList} from '../../navigation/routeTypes';
import {palette} from '../../foundation/palette';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {ScreenFrame} from '../../ui/ScreenFrame';

export function VenueDetailScreen({navigation, route}: NativeStackScreenProps<MainStackParamList, 'VenueDetailScreen'>) {
  const {venue} = route.params;

  return (
    <ScreenFrame>
      <HarbourHeader title={venue.title} subtitle="NOVA SCOTIA CASINO • VENUE DETAILS" back={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={venue.image} style={styles.hero} />
        <Text style={styles.type}>{venue.serviceType}</Text>
        <Text style={styles.title}>{venue.title}</Text>
        <Text style={styles.schedule}>◷ {venue.schedule}</Text>
        <Text style={styles.summary}>{venue.summary}</Text>

        <View style={styles.card}>
          <Text style={styles.kicker}>ABOUT THIS VENUE</Text>
          <Text style={styles.description}>{venue.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>WHY PEOPLE CHOOSE IT</Text>
          {venue.spotlight.map(point => (
            <View key={point} style={styles.pointRow}>
              <Text style={styles.pointDot}>•</Text>
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {padding: 18, paddingBottom: 40},
  hero: {width: '100%', aspectRatio: 1.85, borderRadius: 20},
  type: {color: palette.blue, fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 16},
  title: {color: palette.white, fontSize: 26, fontWeight: '800', marginTop: 8},
  schedule: {color: palette.mist, fontSize: 12, marginTop: 8},
  summary: {color: '#D7DEEA', fontSize: 14, marginTop: 8, lineHeight: 21},
  card: {backgroundColor: palette.panel, borderRadius: 18, borderWidth: 1, borderColor: palette.line, padding: 16, marginTop: 14},
  kicker: {color: palette.mist, fontSize: 9, letterSpacing: 1.5, marginBottom: 10},
  description: {color: palette.white, fontSize: 13, lineHeight: 21},
  pointRow: {flexDirection: 'row', alignItems: 'flex-start', marginTop: 8},
  pointDot: {color: palette.blue, width: 14, fontSize: 14},
  pointText: {color: palette.white, fontSize: 12, lineHeight: 18, flex: 1},
});

