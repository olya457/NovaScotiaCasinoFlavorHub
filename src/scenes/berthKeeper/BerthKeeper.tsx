import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {palette} from '../../foundation/palette';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {PrismButton} from '../../ui/PrismButton';

const parkingKey = '@nova-cove/parking-assistant/v2';
type ParkingMemory = {level: string; spot: string; parkedAt: number | null};

export function BerthKeeper() {
  const [level, setLevel] = useState('P1');
  const [spot, setSpot] = useState('');
  const [parkedAt, setParkedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    AsyncStorage.getItem(parkingKey).then(raw => {
      if (raw) {const value = JSON.parse(raw) as ParkingMemory; setLevel(value.level); setSpot(value.spot); setParkedAt(value.parkedAt);}
    }).catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!parkedAt) {return;}
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [parkedAt]);

  const elapsed = useMemo(() => {
    if (!parkedAt) {return 'Timer not started';}
    const minutes = Math.max(0, Math.floor((now - parkedAt) / 60000));
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m parked`;
  }, [now, parkedAt]);
  const remember = async () => {
    const clean = spot.trim().toUpperCase();
    if (!clean) {Alert.alert('Enter your parking spot', 'For example, B14 or Accessible 3.'); return;}
    const timestamp = parkedAt || Date.now();
    setSpot(clean); setParkedAt(timestamp); setNow(Date.now());
    await AsyncStorage.setItem(parkingKey, JSON.stringify({level, spot: clean, parkedAt: timestamp}));
    Alert.alert('Parking spot remembered', `${level} · ${clean} was saved on this device.`);
  };
  const clear = async () => {await AsyncStorage.removeItem(parkingKey); setSpot(''); setParkedAt(null);};

  return <View style={styles.root}><HarbourHeader title="Parking Assistant" /><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.hero}><Text style={styles.heroKicker}>VISITOR PARKING</Text><Text style={styles.heroTitle}>Find your way back with ease</Text><Text style={styles.heroBody}>Save the level and space shown on-site. This does not reserve a parking space.</Text></View>
    <View style={styles.card}><Text style={styles.kicker}>PARKING INFORMATION</Text>
      <Info label="Hours" value="Open 24 hours" />
      <Info label="Rates" value="Rates are posted at each entrance" />
      <Info label="Payment" value="Follow instructions at the parking facility" />
      <Info label="Accessible parking" value="Designated spaces are located near accessible entrances" />
      <Text style={styles.ruleText}>Observe all posted signs, height limits and time restrictions. Availability and rates may change.</Text>
      <PrismButton label="OPEN DIRECTIONS IN MAPS" variant="outline" onPress={() => Linking.openURL('https://maps.apple.com/?q=Casino+Nova+Scotia+Halifax')} />
    </View>
    <View style={styles.card}><Text style={styles.kicker}>REMEMBER MY PARKING SPOT</Text><View style={styles.levels}>{['P1', 'P2', 'P3', 'Street'].map(item => <Pressable key={item} onPress={() => setLevel(item)} style={[styles.level, level === item && styles.levelActive]}><Text style={[styles.levelText, level === item && styles.levelTextActive]}>{item}</Text></Pressable>)}</View>
      <TextInput value={spot} onChangeText={setSpot} autoCapitalize="characters" placeholder="Space or landmark, e.g. B14" placeholderTextColor={palette.mist} style={styles.input} maxLength={30} />
      <View style={styles.timer}><Text style={styles.timerIcon}>◷</Text><View><Text style={styles.timerValue}>{elapsed}</Text><Text style={styles.timerLabel}>{parkedAt ? `Started ${new Date(parkedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}` : 'Starts when you save your spot'}</Text></View></View>
      <PrismButton label="REMEMBER MY PARKING SPOT" onPress={remember} />
      {parkedAt ? <Pressable onPress={clear}><Text style={styles.clear}>Clear saved parking spot</Text></Pressable> : null}
    </View>
  </ScrollView></View>;
}

function Info({label, value}: {label: string; value: string}) {
  return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  root: {flex: 1}, content: {padding: 17, paddingBottom: 130}, hero: {borderRadius: 20, padding: 19, backgroundColor: palette.blueDeep, marginBottom: 12}, heroKicker: {color: '#AFCFFF', fontSize: 9, letterSpacing: 1.6}, heroTitle: {color: palette.white, fontSize: 21, fontWeight: '800', marginTop: 9}, heroBody: {color: '#D3E2FA', fontSize: 12, lineHeight: 19, marginTop: 7},
  card: {backgroundColor: palette.panel, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: palette.line, marginBottom: 12}, kicker: {color: palette.mist, fontSize: 9, letterSpacing: 1.5, marginBottom: 10}, info: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line}, infoLabel: {color: palette.mist, fontSize: 11, width: '34%'}, infoValue: {color: palette.white, fontSize: 11, lineHeight: 17, textAlign: 'right', flex: 1}, ruleText: {color: palette.mist, fontSize: 9, lineHeight: 15, marginVertical: 13},
  levels: {flexDirection: 'row', gap: 7, marginBottom: 12}, level: {flex: 1, height: 38, borderRadius: 11, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'}, levelActive: {backgroundColor: palette.blue, borderColor: palette.blue}, levelText: {color: palette.mist, fontSize: 10}, levelTextActive: {color: palette.white, fontWeight: '800'}, input: {height: 48, borderWidth: 1, borderColor: palette.line, borderRadius: 12, color: palette.white, paddingHorizontal: 13, backgroundColor: palette.ink}, timer: {flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 13, backgroundColor: palette.ink, marginVertical: 12}, timerIcon: {color: palette.blue, fontSize: 21, marginRight: 12}, timerValue: {color: palette.white, fontWeight: '700'}, timerLabel: {color: palette.mist, fontSize: 9, marginTop: 3}, clear: {color: palette.mist, textAlign: 'center', paddingTop: 15, fontSize: 11},
});
