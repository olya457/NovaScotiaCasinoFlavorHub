import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import {isOpenNow, mapsUrl} from '../../domain/venueGuide';
import {palette} from '../../foundation/palette';
import {RootStack} from '../../navigation/routeTypes';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {PrismButton} from '../../ui/PrismButton';
import {ScreenFrame} from '../../ui/ScreenFrame';

export function CoveLedger({navigation, route}: NativeStackScreenProps<RootStack, 'CoveLedger'>) {
  const venue = route.params.venue;
  const open = isOpenNow(venue.hours);
  return <ScreenFrame><HarbourHeader title={venue.name} back={() => navigation.goBack()} /><ScrollView contentContainerStyle={styles.content}><Image source={venue.image} style={styles.hero} /><View style={styles.titleRow}><View style={styles.titleCopy}><Text style={styles.title}>{venue.name}</Text><Text style={[styles.status, !open && styles.closed]}>{open ? '● OPEN NOW' : '● CLOSED NOW'}</Text></View><Pressable onPress={() => Share.share({message: `${venue.name}\n${venue.hours}\n${mapsUrl(venue)}`})} style={styles.share}><Text style={styles.shareText}>↗</Text></Pressable></View><Text style={styles.hours}>◷ {venue.hours}</Text><Text style={styles.short}>{venue.short}</Text><View style={styles.line} /><Text style={styles.detail}>{venue.detail}</Text>
    <View style={styles.access}><Text style={styles.accessIcon}>♿</Text><View><Text style={styles.accessTitle}>Accessibility information</Text><Text style={styles.accessText}>Accessible routes and entrances are available. Contact the venue for accommodation details.</Text></View></View>
    {venue.id === 'casino' ? <View style={styles.casino}><Text style={styles.section}>CASINO FLOOR INFORMATION</Text><Fact label="Entry" value="Valid government-issued photo ID may be required." /><Fact label="Age requirement" value="Guests must meet Nova Scotia’s legal gambling age requirements." /><Fact label="Dress code" value="Smart casual attire is recommended. Venue policies apply." /><Fact label="Entertainment" value="Slot machines, table games, tournaments and scheduled live entertainment." /><Text style={styles.responsible}>Play is optional and should remain entertainment. Set time and spending limits, never chase losses, and use on-site Responsible Gambling Resource Centre support when needed.</Text><PrismButton label="RESPONSIBLE GAMBLING RESOURCES" variant="outline" onPress={() => Linking.openURL('https://gamblingriskinformednovascotia.ca/resources-for-individuals')} /></View> : null}
    <View style={styles.buttons}><PrismButton label="OPEN ROUTE IN MAPS" onPress={() => Linking.openURL(mapsUrl(venue))} /></View>
  </ScrollView></ScreenFrame>;
}

function Fact({label, value}: {label: string; value: string}) {return <View style={styles.fact}><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue}>{value}</Text></View>;}
const styles = StyleSheet.create({
  content: {padding: 18, paddingBottom: 40}, hero: {width: '100%', aspectRatio: 1.85, borderRadius: 20}, titleRow: {flexDirection: 'row', alignItems: 'center', marginTop: 18}, titleCopy: {flex: 1}, title: {color: palette.white, fontSize: 23, fontWeight: '800'}, status: {color: palette.green, fontSize: 9, fontWeight: '700', marginTop: 7}, closed: {color: palette.red}, share: {width: 42, height: 42, borderRadius: 14, backgroundColor: palette.blueDeep, alignItems: 'center', justifyContent: 'center'}, shareText: {color: palette.white, fontSize: 20}, hours: {color: palette.mist, fontSize: 12, marginTop: 10}, short: {color: '#D7DEEA', fontSize: 14, marginTop: 8}, line: {height: 1, backgroundColor: palette.line, marginVertical: 18}, detail: {color: palette.white, fontSize: 14, lineHeight: 23},
  access: {marginTop: 20, padding: 15, borderRadius: 16, backgroundColor: palette.panel, flexDirection: 'row'}, accessIcon: {color: palette.blue, fontSize: 21, marginRight: 12}, accessTitle: {color: palette.white, fontWeight: '700', fontSize: 12}, accessText: {color: palette.mist, fontSize: 10, lineHeight: 16, marginTop: 4, paddingRight: 25}, casino: {marginTop: 13, padding: 16, borderRadius: 17, backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.line}, section: {color: palette.mist, fontSize: 9, letterSpacing: 1.5, marginBottom: 8}, fact: {paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line}, factLabel: {color: palette.blue, fontSize: 9, textTransform: 'uppercase'}, factValue: {color: palette.white, fontSize: 11, lineHeight: 17, marginTop: 4}, responsible: {color: palette.mist, fontSize: 10, lineHeight: 16, marginVertical: 14}, buttons: {marginTop: 14},
});
