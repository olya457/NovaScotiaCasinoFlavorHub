import React, {useState} from 'react';
import {Image, Linking, Pressable, Share, StyleSheet, Text, View} from 'react-native';
import {Venue, venues} from '../../domain/catalogue';
import {isOpenNow, mapsUrl} from '../../domain/venueGuide';
import {artwork} from '../../foundation/assets';
import {palette} from '../../foundation/palette';
import {HarbourHeader} from '../../ui/HarbourHeader';

const marks = [
  {top: '12%', left: '44%'}, {top: '26%', left: '68%'}, {top: '41%', left: '45%'}, {top: '56%', left: '22%'}, {top: '69%', left: '66%'}, {top: '31%', left: '18%'}, {top: '18%', left: '79%'}, {top: '72%', left: '36%'},
] as const;

export function ConstellationAtlas({open}: {open: (venue: Venue) => void}) {
  const [selected, setSelected] = useState<number | null>(null);
  const venue = selected === null ? null : venues[selected];
  return <View style={styles.root}><HarbourHeader title="Resort Map" /><View style={styles.stage}><Image source={artwork.map} style={styles.map} />{marks.map((point, index) => <Pressable key={index} onPress={() => setSelected(index)} style={[styles.mark, point]}><Text style={styles.markText}>●</Text><View style={styles.markTail} /></Pressable>)}{venue ? <View style={styles.card}><Pressable onPress={() => setSelected(null)} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable><Image source={venue.image} style={styles.thumb} /><View style={styles.copy}><Text style={styles.name}>{venue.name}</Text><Text style={[styles.status, !isOpenNow(venue.hours) && styles.closed]}>{isOpenNow(venue.hours) ? '● OPEN NOW' : '● CLOSED NOW'}</Text><Text style={styles.hours}>◷ {venue.hours}</Text><View style={styles.actions}><Pressable onPress={() => open(venue)}><Text style={styles.action}>DETAILS</Text></Pressable><Pressable onPress={() => Linking.openURL(mapsUrl(venue))}><Text style={styles.action}>ROUTE</Text></Pressable><Pressable onPress={() => Share.share({message: `${venue.name}\n${venue.hours}\n${mapsUrl(venue)}`})}><Text style={styles.action}>SHARE</Text></Pressable></View></View></View> : <View style={styles.hint}><Text style={styles.hintText}>Tap a blue beacon to discover a venue</Text></View>}</View></View>;
}

const styles = StyleSheet.create({
  root: {flex: 1}, stage: {flex: 1, marginTop: 10, marginBottom: 104, overflow: 'hidden'}, map: {width: '100%', height: '100%', resizeMode: 'cover'},
  mark: {position: 'absolute', width: 28, height: 38, alignItems: 'center'}, markText: {width: 28, height: 28, textAlign: 'center', textAlignVertical: 'center', borderRadius: 14, backgroundColor: palette.blueDeep, borderWidth: 2, borderColor: '#76A9F4', color: palette.white, fontSize: 10}, markTail: {width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: palette.blueDeep, marginTop: -3},
  hint: {position: 'absolute', bottom: 18, alignSelf: 'center', backgroundColor: 'rgba(5,12,24,0.9)', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 16}, hintText: {color: palette.mist, fontSize: 11},
  card: {position: 'absolute', left: 14, right: 14, bottom: 18, minHeight: 126, backgroundColor: palette.panel, borderRadius: 20, borderWidth: 1, borderColor: palette.line, padding: 13, flexDirection: 'row', alignItems: 'center'}, close: {position: 'absolute', right: 8, top: 5, zIndex: 2, padding: 7}, closeText: {color: palette.white, fontSize: 24}, thumb: {width: 92, height: 88, borderRadius: 13}, copy: {flex: 1, marginLeft: 13, paddingRight: 12}, name: {color: palette.white, fontWeight: '700'}, status: {color: palette.green, fontSize: 8, marginTop: 5}, closed: {color: palette.red}, hours: {color: palette.mist, fontSize: 9, marginTop: 5}, actions: {flexDirection: 'row', gap: 13, marginTop: 10}, action: {color: palette.blue, fontSize: 8, fontWeight: '800'},
});
