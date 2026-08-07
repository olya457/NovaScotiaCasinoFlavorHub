import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {flavorItems, flavorVenues} from '../../domain/flavorHubData';
import {palette} from '../../foundation/palette';
import {MainStackParamList, TabParamList} from '../../navigation/routeTypes';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {ScreenFrame} from '../../ui/ScreenFrame';

type Props = BottomTabScreenProps<TabParamList, 'HomeScreen'>;

export function HomeScreen(_: Props) {
  const stackNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const tonightSpotlight = flavorItems.filter(item => item.section === 'Drinks' || item.section === 'Signature Plates').slice(0, 4);

  return (
    <ScreenFrame>
      <HarbourHeader title="Flavor Hub" subtitle="NOVA SCOTIA CASINO • FOOD & DRINK" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground source={require('../../assets/aurora_intro/crescent_facade_story.png')} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroShade} />
          <Text style={styles.heroKicker}>REFRESHED EXPERIENCE</Text>
          <Text style={styles.heroTitle}>A new food and drink flow for Nova Scotia Casino Flavor Hub</Text>
          <Text style={styles.heroBody}>Explore dining rooms, drink venues, shareable desserts, and quick planning tools without changing your existing look and mood.</Text>
        </ImageBackground>

        <View style={styles.panel}>
          <Text style={styles.sectionKicker}>TONIGHT'S VENUES</Text>
          {flavorVenues.map(venue => (
            <Pressable key={venue.id} onPress={() => stackNavigation.navigate('VenueDetailScreen', {venue})} style={styles.venueRow}>
              <View style={styles.venueBadge}>
                <Text style={styles.venueBadgeText}>{venue.serviceType}</Text>
              </View>
              <View style={styles.venueCopy}>
                <Text style={styles.venueTitle}>{venue.title}</Text>
                <Text style={styles.venueSummary}>{venue.summary}</Text>
                <Text style={styles.venueSchedule}>◷ {venue.schedule}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionKicker}>FLAVOR SPOTLIGHT</Text>
          <View style={styles.grid}>
            {tonightSpotlight.map(item => (
              <View key={item.id} style={styles.spotlightCard}>
                <Text style={styles.spotlightTitle}>{item.title}</Text>
                <Text style={styles.spotlightMeta}>${item.price.toFixed(2)} · {item.prepMinutes} min</Text>
                <Text style={styles.spotlightTag}>{item.tags.join(' • ')}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {padding: 18, paddingBottom: 120},
  hero: {minHeight: 240, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end', padding: 20, marginBottom: 14},
  heroImage: {borderRadius: 24},
  heroShade: {...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 12, 24, 0.48)'},
  heroKicker: {color: '#B9D5FF', fontSize: 10, fontWeight: '700', letterSpacing: 1.8},
  heroTitle: {color: palette.white, fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 10},
  heroBody: {color: '#D8E1EE', fontSize: 13, lineHeight: 20, marginTop: 10},
  panel: {backgroundColor: palette.panel, borderRadius: 20, borderWidth: 1, borderColor: palette.line, padding: 16, marginBottom: 12},
  sectionKicker: {color: palette.mist, fontSize: 9, letterSpacing: 1.6, marginBottom: 10},
  venueRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line},
  venueBadge: {minWidth: 64, height: 28, borderRadius: 14, backgroundColor: palette.blueDeep, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  venueBadgeText: {color: palette.white, fontSize: 10, fontWeight: '800'},
  venueCopy: {flex: 1},
  venueTitle: {color: palette.white, fontSize: 15, fontWeight: '700'},
  venueSummary: {color: palette.mist, fontSize: 11, lineHeight: 17, marginTop: 3},
  venueSchedule: {color: palette.blue, fontSize: 10, marginTop: 6},
  chevron: {color: palette.blue, fontSize: 28, marginLeft: 6},
  grid: {gap: 10},
  spotlightCard: {backgroundColor: palette.inkSoft, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: palette.line},
  spotlightTitle: {color: palette.white, fontSize: 14, fontWeight: '700'},
  spotlightMeta: {color: palette.blue, fontSize: 11, marginTop: 6},
  spotlightTag: {color: palette.mist, fontSize: 10, lineHeight: 16, marginTop: 6},
});
