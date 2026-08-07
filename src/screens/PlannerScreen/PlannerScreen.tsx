import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {palette} from '../../foundation/palette';
import {TabParamList} from '../../navigation/routeTypes';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {PrismButton} from '../../ui/PrismButton';
import {ScreenFrame} from '../../ui/ScreenFrame';

const plannerKey = '@nova-scotia-flavor-hub/taste-plan/v2';

type TastePlan = {
  guestName: string;
  visitDate: string;
  arrivalTime: string;
  partySize: string;
  focus: 'Dinner' | 'Drinks' | 'Dessert' | 'Mix';
  notes: string;
};

const emptyPlan: TastePlan = {
  guestName: '',
  visitDate: '',
  arrivalTime: '19:00',
  partySize: '2',
  focus: 'Mix',
  notes: '',
};

type Props = BottomTabScreenProps<TabParamList, 'PlannerScreen'>;

export function PlannerScreen(_: Props) {
  const [plan, setPlan] = useState<TastePlan>(emptyPlan);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(plannerKey).then(raw => {
      if (raw) {
        setPlan(JSON.parse(raw));
        setSaved(true);
      }
    }).catch(() => undefined);
  }, []);

  const update = <K extends keyof TastePlan>(key: K, value: TastePlan[K]) => setPlan(current => ({...current, [key]: value}));

  const savePlan = async () => {
    if (!plan.visitDate.trim()) {
      Alert.alert('Add a date', 'Enter a visit date for your food and drink plan.');
      return;
    }
    await AsyncStorage.setItem(plannerKey, JSON.stringify(plan));
    setSaved(true);
    Alert.alert('Plan saved', 'Your flavor plan is stored on this device.');
  };

  const clearPlan = async () => {
    await AsyncStorage.removeItem(plannerKey);
    setPlan(emptyPlan);
    setSaved(false);
  };

  return (
    <ScreenFrame>
      <HarbourHeader title="Taste Planner" subtitle="NOVA SCOTIA CASINO • SCHEDULE" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Build a cleaner visit flow around food, drinks, and dessert stops. This replaces the old concierge-style preferences with a category-focused planner.</Text>

        <View style={styles.card}>
          <Text style={styles.kicker}>VISIT BASICS</Text>
          <TextInput value={plan.guestName} onChangeText={text => update('guestName', text)} placeholder="Guest name or group label" placeholderTextColor={palette.mist} style={styles.input} />
          <TextInput value={plan.visitDate} onChangeText={text => update('visitDate', text)} placeholder="Visit date, e.g. 2026-08-07" placeholderTextColor={palette.mist} style={styles.input} />
          <View style={styles.row}>
            <TextInput value={plan.arrivalTime} onChangeText={text => update('arrivalTime', text)} placeholder="19:00" placeholderTextColor={palette.mist} style={[styles.input, styles.halfInput]} />
            <TextInput value={plan.partySize} onChangeText={text => update('partySize', text)} placeholder="Party size" placeholderTextColor={palette.mist} style={[styles.input, styles.halfInput]} keyboardType="number-pad" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>PLAN FOCUS</Text>
          <View style={styles.focusRow}>
            {(['Dinner', 'Drinks', 'Dessert', 'Mix'] as const).map(option => (
              <Pressable key={option} onPress={() => update('focus', option)} style={[styles.focusChip, plan.focus === option && styles.focusChipActive]}>
                <Text style={[styles.focusText, plan.focus === option && styles.focusTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput value={plan.notes} onChangeText={text => update('notes', text)} placeholder="Add table requests, favorite dishes, drink ideas, or timing notes" placeholderTextColor={palette.mist} style={styles.notesInput} multiline />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.kicker}>CURRENT PLAN</Text>
          <Text style={styles.summaryLine}>Name: {plan.guestName || 'Not set'}</Text>
          <Text style={styles.summaryLine}>Date: {plan.visitDate || 'Not set'}</Text>
          <Text style={styles.summaryLine}>Arrival: {plan.arrivalTime}</Text>
          <Text style={styles.summaryLine}>Party: {plan.partySize}</Text>
          <Text style={styles.summaryLine}>Focus: {plan.focus}</Text>
          <Text style={styles.summaryNote}>{plan.notes || 'No notes yet.'}</Text>
          {saved ? <Text style={styles.saved}>Saved on this device</Text> : null}
        </View>

        <PrismButton label="SAVE FLAVOR PLAN" onPress={savePlan} />
        {saved ? <View style={styles.clearWrap}><PrismButton label="CLEAR SAVED PLAN" variant="outline" onPress={clearPlan} /></View> : null}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {padding: 18, paddingBottom: 120},
  intro: {color: palette.mist, fontSize: 12, lineHeight: 19, marginBottom: 14},
  card: {backgroundColor: palette.panel, borderRadius: 18, borderWidth: 1, borderColor: palette.line, padding: 16, marginBottom: 12},
  summaryCard: {backgroundColor: palette.inkSoft, borderRadius: 18, borderWidth: 1, borderColor: palette.line, padding: 16, marginBottom: 14},
  kicker: {color: palette.mist, letterSpacing: 1.5, fontSize: 9, marginBottom: 12},
  input: {height: 48, borderRadius: 12, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.ink, color: palette.white, paddingHorizontal: 13, marginBottom: 10},
  row: {flexDirection: 'row', gap: 10},
  halfInput: {flex: 1},
  focusRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12},
  focusChip: {height: 38, paddingHorizontal: 14, borderRadius: 19, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'},
  focusChipActive: {backgroundColor: palette.blueDeep, borderColor: palette.blue},
  focusText: {color: palette.mist, fontSize: 11},
  focusTextActive: {color: palette.white, fontWeight: '700'},
  notesInput: {minHeight: 100, borderRadius: 12, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.ink, color: palette.white, padding: 13, textAlignVertical: 'top'},
  summaryLine: {color: palette.white, fontSize: 12, marginBottom: 7},
  summaryNote: {color: palette.mist, fontSize: 11, lineHeight: 17, marginTop: 4},
  saved: {color: palette.blue, fontSize: 10, marginTop: 10},
  clearWrap: {marginTop: 10},
});

