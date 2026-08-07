import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Venue, venues} from '../../domain/catalogue';
import {categoryFor, GuideCategory, isOpenNow} from '../../domain/venueGuide';
import {palette} from '../../foundation/palette';
import {HarbourHeader} from '../../ui/HarbourHeader';

const favoriteKey = '@nova-cove/venue-favorites/v2';
const filters: GuideCategory[] = ['All', 'Dining', 'Entertainment', 'Services'];

export function QuayDirectory({open}: {open: (venue: Venue) => void}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<GuideCategory>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {AsyncStorage.getItem(favoriteKey).then(raw => raw && setFavorites(JSON.parse(raw))).catch(() => undefined);}, []);
  const toggleFavorite = async (id: string) => {const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]; setFavorites(next); await AsyncStorage.setItem(favoriteKey, JSON.stringify(next));};
  const shown = useMemo(() => venues.filter(venue => {
    const matchesQuery = `${venue.name} ${venue.short} ${venue.kind}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (filter === 'All' || categoryFor(venue) === filter);
  }), [filter, query]);

  return <View style={styles.root}><HarbourHeader title="Resort Guide" /><View style={styles.searchWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search places and services" placeholderTextColor={palette.mist} style={styles.search} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{filters.map(item => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</ScrollView>
    <View style={styles.resultRow}><Text style={styles.muted}>{shown.length} places</Text><Text style={styles.muted}>{favorites.length} saved ♥</Text></View>
    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>{shown.map(venue => {const openNow = isOpenNow(venue.hours); return <Pressable key={venue.id} onPress={() => open(venue)} style={styles.card}><Image source={venue.image} style={styles.image} /><View style={styles.copy}><View style={styles.titleRow}><Text numberOfLines={1} style={styles.name}>{venue.name}</Text><Pressable hitSlop={10} onPress={() => toggleFavorite(venue.id)}><Text style={[styles.favorite, favorites.includes(venue.id) && styles.favoriteOn]}>{favorites.includes(venue.id) ? '♥' : '♡'}</Text></Pressable></View><Text style={[styles.status, !openNow && styles.closed]}>{openNow ? '● OPEN NOW' : '● CLOSED NOW'}</Text><Text style={styles.hours}>◷ {venue.hours}</Text><Text numberOfLines={1} style={styles.short}>{venue.short}</Text><Text style={styles.kind}>{categoryFor(venue)} · Accessible entrance info available</Text></View><Text style={styles.chevron}>›</Text></Pressable>;})}
      {!shown.length ? <Text style={styles.empty}>No places match your search and filter.</Text> : null}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  root: {flex: 1}, searchWrap: {height: 46, marginHorizontal: 16, marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.panel, flexDirection: 'row', alignItems: 'center'}, searchIcon: {color: palette.blue, fontSize: 22, marginLeft: 13}, search: {flex: 1, color: palette.white, paddingHorizontal: 10}, filters: {paddingHorizontal: 16, paddingVertical: 10, gap: 8}, filter: {height: 34, paddingHorizontal: 13, borderRadius: 17, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'}, filterActive: {backgroundColor: palette.blueDeep, borderColor: palette.blue}, filterText: {color: palette.mist, fontSize: 10}, filterTextActive: {color: palette.white, fontWeight: '700'}, resultRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 19, paddingBottom: 9}, muted: {fontSize: 10, color: palette.mist},
  list: {paddingHorizontal: 16, paddingBottom: 130}, card: {minHeight: 130, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.panel, borderRadius: 18, padding: 12, marginBottom: 11, borderWidth: 1, borderColor: palette.line}, image: {width: 92, height: 98, borderRadius: 13}, copy: {flex: 1, marginLeft: 13}, titleRow: {flexDirection: 'row', alignItems: 'center'}, name: {color: palette.white, fontWeight: '700', fontSize: 14, flex: 1}, favorite: {color: palette.mist, fontSize: 20}, favoriteOn: {color: palette.red}, status: {fontSize: 8, color: palette.green, marginTop: 5, fontWeight: '700'}, closed: {color: palette.red}, hours: {fontSize: 9, color: palette.mist, marginTop: 5}, short: {fontSize: 10, color: palette.mist, marginTop: 5}, kind: {color: palette.blue, fontSize: 8, marginTop: 7}, chevron: {fontSize: 27, color: palette.blue, marginLeft: 4}, empty: {color: palette.mist, textAlign: 'center', marginTop: 35},
});
