import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {flavorVenues} from '../../domain/flavorHubData';
import {palette} from '../../foundation/palette';
import {TabParamList} from '../../navigation/routeTypes';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {ScreenFrame} from '../../ui/ScreenFrame';

const savedVenueKey = '@nova-scotia-flavor-hub/saved-venues/v2';
const filters = ['All', 'Food', 'Drink'] as const;

type Props = BottomTabScreenProps<TabParamList, 'VenueGuideScreen'>;

export function VenueGuideScreen({navigation}: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(savedVenueKey).then(raw => raw && setSavedIds(JSON.parse(raw))).catch(() => undefined);
  }, []);

  const toggleSaved = async (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter(item => item !== id) : [...savedIds, id];
    setSavedIds(next);
    await AsyncStorage.setItem(savedVenueKey, JSON.stringify(next));
  };

  const visibleVenues = useMemo(() => {
    return flavorVenues.filter(venue => {
      const matchesQuery = `${venue.title} ${venue.summary} ${venue.serviceType}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesFilter = filter === 'All' || venue.serviceType === filter.toUpperCase() || (filter === 'Drink' && venue.serviceType === 'LOUNGE');
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <ScreenFrame>
      <HarbourHeader title="Food & Drink Venues" subtitle="NOVA SCOTIA CASINO • GUIDE" />
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search dining rooms, bars, and counters" placeholderTextColor={palette.mist} style={styles.search} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map(item => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView key={`${filter}-${query.trim().toLowerCase()}`} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {visibleVenues.map(venue => (
          <Pressable key={venue.id} onPress={() => navigation.getParent()?.navigate('VenueDetailScreen', {venue})} style={styles.card}>
            <Image source={venue.image} style={styles.image} />
            <View style={styles.copy}>
              <View style={styles.titleRow}>
                <Text numberOfLines={1} style={styles.name}>{venue.title}</Text>
                <Pressable hitSlop={10} onPress={() => toggleSaved(venue.id)}>
                  <Text style={[styles.favorite, savedIds.includes(venue.id) && styles.favoriteOn]}>{savedIds.includes(venue.id) ? '♥' : '♡'}</Text>
                </Pressable>
              </View>
              <Text style={styles.summary}>{venue.summary}</Text>
              <Text style={styles.schedule}>◷ {venue.schedule}</Text>
              <Text style={styles.tags}>{venue.spotlight.join(' • ')}</Text>
            </View>
          </Pressable>
        ))}
        {!visibleVenues.length ? <Text style={styles.empty}>No venues match this search right now.</Text> : null}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  searchWrap: {height: 46, marginHorizontal: 16, marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.panel, flexDirection: 'row', alignItems: 'center'},
  searchIcon: {color: palette.blue, fontSize: 22, marginLeft: 13},
  search: {flex: 1, color: palette.white, paddingHorizontal: 10},
  filters: {paddingHorizontal: 16, paddingVertical: 10, gap: 8},
  filter: {height: 34, paddingHorizontal: 14, borderRadius: 17, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'},
  filterActive: {backgroundColor: palette.blueDeep, borderColor: palette.blue},
  filterText: {color: palette.mist, fontSize: 10},
  filterTextActive: {color: palette.white, fontWeight: '700'},
  list: {paddingHorizontal: 16, paddingBottom: 120},
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: palette.panel, borderRadius: 18, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: palette.line},
  image: {width: 96, height: 102, borderRadius: 14},
  copy: {flex: 1, marginLeft: 12},
  titleRow: {flexDirection: 'row', alignItems: 'center'},
  name: {color: palette.white, fontWeight: '700', fontSize: 15, flex: 1},
  favorite: {color: palette.mist, fontSize: 20},
  favoriteOn: {color: palette.red},
  summary: {color: palette.mist, fontSize: 11, lineHeight: 16, marginTop: 5},
  schedule: {color: palette.blue, fontSize: 10, marginTop: 7},
  tags: {color: palette.white, fontSize: 9, lineHeight: 14, marginTop: 7},
  empty: {color: palette.mist, textAlign: 'center', marginTop: 28},
});
