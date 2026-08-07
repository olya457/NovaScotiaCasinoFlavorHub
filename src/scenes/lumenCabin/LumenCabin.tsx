import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View} from 'react-native';
import {palette} from '../../foundation/palette';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {PrismButton} from '../../ui/PrismButton';

const preferencesKey = '@nova-cove/stay-preferences/v2';
type Preferences = {temperature: string; lighting: string; pillow: string; accessible: boolean; quiet: boolean; notes: string};
const initial: Preferences = {temperature: '21°C', lighting: 'Warm', pillow: 'Medium', accessible: false, quiet: false, notes: ''};

export function LumenCabin() {
  const [value, setValue] = useState<Preferences>(initial);
  useEffect(() => {AsyncStorage.getItem(preferencesKey).then(raw => raw && setValue(JSON.parse(raw))).catch(() => undefined);}, []);
  const set = <K extends keyof Preferences>(key: K, next: Preferences[K]) => setValue(current => ({...current, [key]: next}));
  const save = async () => {await AsyncStorage.setItem(preferencesKey, JSON.stringify(value)); Alert.alert('Preferences saved', 'Your stay preferences are saved on this device.');};
  const message = `My stay preferences\nTemperature: ${value.temperature}\nLighting: ${value.lighting}\nPillow: ${value.pillow}\nQuiet room: ${value.quiet ? 'Yes' : 'No'}\nAccessibility needs: ${value.accessible ? 'Yes' : 'No'}${value.notes ? `\nNotes: ${value.notes}` : ''}`;

  return <View style={styles.root}><HarbourHeader title="Stay Preferences" /><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.intro}>Keep a personal preference list on this device, then share it when contacting the concierge. Preferences are requests and are subject to availability.</Text>
    <ChoiceCard title="PREFERRED TEMPERATURE" values={['19°C', '21°C', '23°C']} selected={value.temperature} onSelect={item => set('temperature', item)} />
    <ChoiceCard title="LIGHTING PREFERENCE" values={['Warm', 'Neutral', 'Bright']} selected={value.lighting} onSelect={item => set('lighting', item)} />
    <ChoiceCard title="PILLOW PREFERENCE" values={['Soft', 'Medium', 'Firm']} selected={value.pillow} onSelect={item => set('pillow', item)} />
    <View style={styles.card}><Text style={styles.kicker}>ROOM PREFERENCES</Text><Toggle label="Quiet room preference" detail="Away from elevators or high-traffic areas where possible" enabled={value.quiet} onPress={() => set('quiet', !value.quiet)} /><Toggle label="Accessibility needs" detail="Include accessibility requirements in the notes below" enabled={value.accessible} onPress={() => set('accessible', !value.accessible)} /></View>
    <View style={styles.card}><Text style={styles.kicker}>ADDITIONAL NOTES</Text><TextInput value={value.notes} onChangeText={text => set('notes', text)} placeholder="Add any other stay preferences…" placeholderTextColor={palette.mist} style={styles.input} multiline maxLength={300} /></View>
    <PrismButton label="SAVE ON THIS DEVICE" onPress={save} />
    <View style={styles.shareGap}><PrismButton label="SHARE WITH CONCIERGE" variant="outline" onPress={() => Share.share({message})} /></View>
  </ScrollView></View>;
}

function ChoiceCard({title, values, selected, onSelect}: {title: string; values: string[]; selected: string; onSelect: (value: string) => void}) {
  return <View style={styles.card}><Text style={styles.kicker}>{title}</Text><View style={styles.choices}>{values.map(item => <Pressable key={item} onPress={() => onSelect(item)} style={[styles.choice, selected === item && styles.choiceActive]}><Text style={[styles.choiceText, selected === item && styles.choiceTextActive]}>{item}</Text></Pressable>)}</View></View>;
}
function Toggle({label, detail, enabled, onPress}: {label: string; detail: string; enabled: boolean; onPress: () => void}) {
  return <Pressable onPress={onPress} style={styles.toggleRow}><View style={styles.toggleCopy}><Text style={styles.toggleTitle}>{label}</Text><Text style={styles.toggleDetail}>{detail}</Text></View><View style={[styles.switch, enabled && styles.switchOn]}><View style={[styles.knob, enabled && styles.knobOn]} /></View></Pressable>;
}

const styles = StyleSheet.create({
  root: {flex: 1}, content: {padding: 18, paddingBottom: 130}, intro: {color: palette.mist, fontSize: 12, lineHeight: 19, marginBottom: 14}, card: {backgroundColor: palette.panel, borderRadius: 18, borderWidth: 1, borderColor: palette.line, padding: 16, marginBottom: 12}, kicker: {color: palette.mist, letterSpacing: 1.5, fontSize: 9, marginBottom: 12}, choices: {flexDirection: 'row', gap: 8}, choice: {flex: 1, height: 42, borderRadius: 12, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'}, choiceActive: {backgroundColor: palette.blue, borderColor: palette.blue}, choiceText: {color: palette.mist, fontSize: 11}, choiceTextActive: {color: palette.white, fontWeight: '800'}, toggleRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line}, toggleCopy: {flex: 1, paddingRight: 12}, toggleTitle: {color: palette.white, fontSize: 13, fontWeight: '600'}, toggleDetail: {color: palette.mist, fontSize: 9, lineHeight: 14, marginTop: 4}, switch: {width: 47, height: 27, borderRadius: 14, padding: 3, backgroundColor: '#33445C'}, switchOn: {backgroundColor: palette.blue}, knob: {width: 21, height: 21, borderRadius: 11, backgroundColor: palette.white}, knobOn: {alignSelf: 'flex-end'}, input: {height: 96, color: palette.white, backgroundColor: palette.ink, borderWidth: 1, borderColor: palette.line, borderRadius: 12, padding: 12, textAlignVertical: 'top'}, shareGap: {marginTop: 10},
});
