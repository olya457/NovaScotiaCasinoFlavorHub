import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {palette} from '../../foundation/palette';
import {PrismButton} from '../../ui/PrismButton';

const visitKey = '@nova-cove/my-visit/v2';
const interests = [
  {id: 'ocean', label: 'Ocean View Restaurant'},
  {id: 'lounge', label: 'Blue Harbor Lounge'},
  {id: 'casino', label: 'Casino Floor'},
  {id: 'events', label: 'Live Events'},
];

type VisitPlan = {
  date: string;
  time: string;
  selected: string[];
  notes: string;
  reminder: boolean;
};

const emptyPlan: VisitPlan = {date: '', time: '18:00', selected: [], notes: '', reminder: true};
const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const timeOptions = Array.from({length: 48}, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 ? '30' : '00';
  return `${String(hours).padStart(2, '0')}:${minutes}`;
});
const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function monthDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({length: 42}, (_, index) => {
    const day = index - firstWeekDay + 1;
    return day > 0 && day <= daysInMonth ? new Date(year, monthIndex, day, 12) : null;
  });
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {return false;}
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function TideWelcome() {
  const [saved, setSaved] = useState<VisitPlan | null>(null);
  const [draft, setDraft] = useState<VisitPlan>(emptyPlan);
  const [editing, setEditing] = useState(true);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  useEffect(() => {
    AsyncStorage.getItem(visitKey).then(raw => {
      if (raw) {
        const plan = JSON.parse(raw) as VisitPlan;
        setSaved(plan);
        setDraft(plan);
        setEditing(false);
      }
    }).catch(() => undefined);
  }, []);

  const selectedNames = useMemo(() => draft.selected.map(id => interests.find(item => item.id === id)?.label).filter(Boolean), [draft.selected]);
  const calendarDays = useMemo(() => monthDays(calendarMonth), [calendarMonth]);
  const toggle = (id: string) => setDraft(current => ({...current, selected: current.selected.includes(id) ? current.selected.filter(item => item !== id) : [...current.selected, id]}));
  const openDatePicker = () => {
    const selected = validDate(draft.date) ? new Date(`${draft.date}T12:00:00`) : new Date();
    setCalendarMonth(selected);
    setDatePickerOpen(true);
  };
  const chooseDate = (date: Date) => {
    setDraft(current => ({...current, date: formatDate(date)}));
    setDatePickerOpen(false);
  };
  const moveMonth = (amount: number) => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  const appendNote = (key: string) => setDraft(current => {
    if (current.notes.length >= 280) {return current;}
    const capitalize = !current.notes.length || /[.!?]\s$/.test(current.notes);
    return {...current, notes: current.notes + (capitalize ? key.toUpperCase() : key)};
  });
  const removeNoteCharacter = () => setDraft(current => ({...current, notes: current.notes.slice(0, -1)}));
  const save = async () => {
    if (!validDate(draft.date)) {Alert.alert('Check visit date', 'Enter a valid date in YYYY-MM-DD format.'); return;}
    if (!/^\d{2}:\d{2}$/.test(draft.time)) {Alert.alert('Check start time', 'Enter time in 24-hour HH:MM format.'); return;}
    if (!draft.selected.length) {Alert.alert('Choose an interest', 'Select at least one place or activity for your visit.'); return;}
    await AsyncStorage.setItem(visitKey, JSON.stringify(draft));
    setSaved(draft);
    setEditing(false);
  };
  const remove = () => Alert.alert('Delete My Visit?', 'This removes the plan saved on this device.', [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Delete', style: 'destructive', onPress: async () => {await AsyncStorage.removeItem(visitKey); setSaved(null); setDraft(emptyPlan); setEditing(true);}},
  ]);

  if (saved && !editing) {
    return <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.head}><Text style={styles.eyebrow}>CASINO NOVA SCOTIA</Text><Text style={styles.heading}>My Visit</Text><Text style={styles.subhead}>Your itinerary is saved on this device.</Text></View>
      <View style={styles.summary}>
        <View style={styles.summaryRow}><View><Text style={styles.kicker}>VISIT DATE</Text><Text style={styles.value}>{saved.date}</Text></View><View><Text style={styles.kicker}>START TIME</Text><Text style={styles.value}>{saved.time}</Text></View></View>
        <View style={styles.rule} />
        <Text style={styles.kicker}>ITINERARY</Text>
        {saved.selected.map((id, index) => <View key={id} style={styles.itineraryRow}><Text style={styles.step}>{String(index + 1).padStart(2, '0')}</Text><View style={styles.itineraryCopy}><Text style={styles.place}>{interests.find(item => item.id === id)?.label}</Text><Text style={styles.muted}>{index === 0 ? saved.time : 'Add timing in Edit Visit'}</Text></View></View>)}
        {saved.notes ? <><View style={styles.rule} /><Text style={styles.kicker}>NOTES</Text><Text style={styles.notes}>{saved.notes}</Text></> : null}
        <View style={styles.reminder}><Text style={styles.reminderIcon}>◷</Text><Text style={styles.reminderText}>{saved.reminder ? `In-app reminder set for ${saved.date} at ${saved.time}` : 'In-app reminder is off'}</Text></View>
      </View>
      <View style={styles.actions}><PrismButton label="EDIT VISIT" onPress={() => setEditing(true)} style={styles.action} /><PrismButton label="DELETE" variant="outline" onPress={remove} style={styles.action} /></View>
    </ScrollView>;
  }

  return <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.head}><Text style={styles.eyebrow}>PLAN AHEAD</Text><Text style={styles.heading}>{saved ? 'Edit My Visit' : 'Build My Visit'}</Text><Text style={styles.subhead}>Create a personal itinerary and keep it available on this device.</Text></View>
    <View style={styles.card}>
      <Text style={styles.kicker}>WHEN ARE YOU VISITING?</Text>
      <View style={styles.inputRow}>
        <Pressable onPress={openDatePicker} style={[styles.input, styles.dateInput, styles.pickerField]} accessibilityRole="button" accessibilityLabel="Choose visit date"><Text style={draft.date ? styles.inputValue : styles.inputPlaceholder}>{draft.date || 'Choose date'}</Text><Text style={styles.fieldIcon}>▣</Text></Pressable>
        <Pressable onPress={() => setTimePickerOpen(true)} style={[styles.input, styles.timeInput, styles.pickerField]} accessibilityRole="button" accessibilityLabel="Choose visit time"><Text style={styles.inputValue}>{draft.time}</Text><Text style={styles.fieldIcon}>◷</Text></Pressable>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.kicker}>WHAT INTERESTS YOU?</Text>
      {interests.map(item => <Pressable key={item.id} onPress={() => toggle(item.id)} style={[styles.option, draft.selected.includes(item.id) && styles.optionSelected]}><Text style={[styles.checkbox, draft.selected.includes(item.id) && styles.checkboxSelected]}>{draft.selected.includes(item.id) ? '✓' : ''}</Text><Text style={styles.optionText}>{item.label}</Text></Pressable>)}
    </View>
    <View style={styles.card}>
      <Text style={styles.kicker}>NOTES</Text>
      <Pressable onPress={() => setKeyboardOpen(true)} style={[styles.input, styles.notesInput]} accessibilityRole="button" accessibilityLabel="Edit visit notes">
        <Text style={draft.notes ? styles.noteValue : styles.inputPlaceholder}>{draft.notes || 'Add preferences, meeting points or ideas…'}</Text>
        <Text style={styles.characterCount}>{draft.notes.length}/280</Text>
      </Pressable>
      <Pressable onPress={() => setDraft(current => ({...current, reminder: !current.reminder}))} style={styles.toggleRow}><View style={[styles.switch, draft.reminder && styles.switchOn]}><View style={[styles.knob, draft.reminder && styles.knobOn]} /></View><View><Text style={styles.optionText}>In-app visit reminder</Text><Text style={styles.muted}>Shown with your saved itinerary</Text></View></Pressable>
    </View>
    {selectedNames.length ? <Text style={styles.preview}>{selectedNames.length} activities selected</Text> : null}
    <PrismButton label="BUILD MY VISIT" onPress={save} />
    {saved ? <Pressable onPress={() => {setDraft(saved); setEditing(false);}}><Text style={styles.cancel}>Cancel editing</Text></Pressable> : null}

    <Modal visible={datePickerOpen} transparent animationType="fade" onRequestClose={() => setDatePickerOpen(false)}>
      <Pressable style={styles.modalScrim} onPress={() => setDatePickerOpen(false)}>
        <Pressable style={styles.calendarCard}>
          <View style={styles.modalHeader}><View><Text style={styles.modalKicker}>VISIT DATE</Text><Text style={styles.modalTitle}>{calendarMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</Text></View><Pressable onPress={() => setDatePickerOpen(false)} hitSlop={12}><Text style={styles.modalClose}>×</Text></Pressable></View>
          <View style={styles.monthControls}><Pressable onPress={() => moveMonth(-1)} style={styles.monthButton}><Text style={styles.monthButtonText}>‹</Text></Pressable><Pressable onPress={() => {const today = new Date(); setCalendarMonth(today); chooseDate(today);}}><Text style={styles.today}>TODAY</Text></Pressable><Pressable onPress={() => moveMonth(1)} style={styles.monthButton}><Text style={styles.monthButtonText}>›</Text></Pressable></View>
          <View style={styles.calendarGrid}>{weekDays.map(day => <Text key={day} style={styles.weekDay}>{day}</Text>)}{calendarDays.map((date, index) => {
            const selected = !!date && formatDate(date) === draft.date;
            return <View key={index} style={styles.dayCell}>{date ? <Pressable onPress={() => chooseDate(date)} style={[styles.dayButton, selected && styles.dayButtonSelected]}><Text style={[styles.dayText, selected && styles.dayTextSelected]}>{date.getDate()}</Text></Pressable> : null}</View>;
          })}</View>
        </Pressable>
      </Pressable>
    </Modal>

    <Modal visible={timePickerOpen} transparent animationType="slide" onRequestClose={() => setTimePickerOpen(false)}>
      <View style={styles.modalScrim}><Pressable style={styles.scrimDismiss} onPress={() => setTimePickerOpen(false)} /><View style={styles.timeSheet}><View style={styles.modalHeader}><View><Text style={styles.modalKicker}>START TIME</Text><Text style={styles.modalTitle}>Choose a time</Text></View><Pressable onPress={() => setTimePickerOpen(false)} hitSlop={12}><Text style={styles.modalClose}>×</Text></Pressable></View><ScrollView contentContainerStyle={styles.timeGrid}>{timeOptions.map(time => <Pressable key={time} onPress={() => {setDraft(current => ({...current, time})); setTimePickerOpen(false);}} style={[styles.timeChoice, draft.time === time && styles.timeChoiceSelected]}><Text style={[styles.timeChoiceText, draft.time === time && styles.timeChoiceTextSelected]}>{time}</Text></Pressable>)}</ScrollView></View></View>
    </Modal>

    <Modal visible={keyboardOpen} transparent animationType="slide" onRequestClose={() => setKeyboardOpen(false)}>
      <View style={styles.modalScrim}><Pressable style={styles.scrimDismiss} onPress={() => setKeyboardOpen(false)} /><View style={styles.keyboardSheet}><View style={styles.keyboardHeader}><Text style={styles.modalTitle}>Visit notes</Text><Pressable onPress={() => setKeyboardOpen(false)} style={styles.doneButton}><Text style={styles.doneButtonText}>DONE</Text></Pressable></View><View style={styles.keyboardPreview}><Text style={draft.notes ? styles.noteValue : styles.inputPlaceholder}>{draft.notes || 'Type your note…'}</Text><Text style={styles.characterCount}>{draft.notes.length}/280</Text></View>{keyboardRows.map((row, rowIndex) => <View key={rowIndex} style={styles.keyboardRow}>{row.map(key => <Pressable key={key} onPress={() => appendNote(key)} style={styles.key}><Text style={styles.keyText}>{key.toUpperCase()}</Text></Pressable>)}</View>)}<View style={styles.keyboardRow}><Pressable onPress={() => appendNote(',')} style={styles.utilityKey}><Text style={styles.keyText}>,</Text></Pressable><Pressable onPress={() => appendNote(' ')} style={styles.spaceKey}><Text style={styles.utilityKeyText}>SPACE</Text></Pressable><Pressable onPress={() => appendNote('.')} style={styles.utilityKey}><Text style={styles.keyText}>.</Text></Pressable><Pressable onPress={removeNoteCharacter} onLongPress={() => setDraft(current => ({...current, notes: ''}))} style={styles.deleteKey}><Text style={styles.utilityKeyText}>⌫</Text></Pressable></View></View></View>
    </Modal>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: {padding: 18, paddingBottom: 130}, head: {paddingVertical: 10}, eyebrow: {fontSize: 10, color: palette.blue, letterSpacing: 2, fontWeight: '700'}, heading: {fontSize: 28, color: palette.white, fontWeight: '800', marginTop: 10}, subhead: {fontSize: 13, lineHeight: 20, color: palette.mist, marginTop: 7},
  card: {backgroundColor: palette.panel, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: palette.line, marginBottom: 12}, summary: {backgroundColor: palette.panel, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: palette.line, marginTop: 12}, kicker: {fontSize: 9, letterSpacing: 1.6, color: palette.mist, marginBottom: 10}, inputRow: {flexDirection: 'row', gap: 10}, input: {minHeight: 48, borderWidth: 1, borderColor: palette.line, borderRadius: 12, backgroundColor: palette.ink, paddingHorizontal: 13}, dateInput: {flex: 2}, timeInput: {flex: 1}, pickerField: {height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, inputValue: {color: palette.white, fontSize: 13}, inputPlaceholder: {color: palette.mist, fontSize: 12}, fieldIcon: {color: palette.blue, fontSize: 16, marginLeft: 6}, notesInput: {height: 92, paddingTop: 13, paddingBottom: 24}, noteValue: {color: palette.white, fontSize: 13, lineHeight: 19}, characterCount: {position: 'absolute', right: 10, bottom: 7, color: palette.mist, fontSize: 9},
  option: {height: 48, borderWidth: 1, borderColor: palette.line, borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginTop: 8}, optionSelected: {borderColor: palette.blue, backgroundColor: '#102D54'}, checkbox: {width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: palette.mist, color: palette.white, textAlign: 'center', lineHeight: 20, marginRight: 10}, checkboxSelected: {backgroundColor: palette.blue, borderColor: palette.blue}, optionText: {color: palette.white, fontSize: 13, fontWeight: '600'},
  toggleRow: {flexDirection: 'row', alignItems: 'center', marginTop: 14}, switch: {width: 47, height: 27, padding: 3, borderRadius: 14, backgroundColor: '#33445C', marginRight: 12}, switchOn: {backgroundColor: palette.blue}, knob: {width: 21, height: 21, borderRadius: 11, backgroundColor: palette.white}, knobOn: {alignSelf: 'flex-end'}, preview: {color: palette.mist, textAlign: 'center', marginBottom: 10, fontSize: 11}, cancel: {color: palette.mist, textAlign: 'center', padding: 16},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'}, value: {color: palette.white, fontWeight: '800', fontSize: 17}, rule: {height: 1, backgroundColor: palette.line, marginVertical: 16}, itineraryRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 10}, step: {width: 34, height: 34, borderRadius: 17, backgroundColor: palette.blueDeep, color: palette.white, textAlign: 'center', lineHeight: 34, fontSize: 10, fontWeight: '800'}, itineraryCopy: {marginLeft: 12}, place: {color: palette.white, fontSize: 14, fontWeight: '700'}, muted: {color: palette.mist, fontSize: 10, marginTop: 3}, notes: {color: palette.white, lineHeight: 21}, reminder: {marginTop: 16, borderRadius: 13, padding: 12, backgroundColor: palette.ink, flexDirection: 'row', alignItems: 'center'}, reminderIcon: {color: palette.blue, marginRight: 9}, reminderText: {color: palette.mist, fontSize: 11, flex: 1}, actions: {flexDirection: 'row', gap: 10, marginTop: 13}, action: {flex: 1},
  modalScrim: {flex: 1, backgroundColor: 'rgba(1, 6, 15, 0.84)', justifyContent: 'center', padding: 18}, scrimDismiss: {...StyleSheet.absoluteFillObject}, calendarCard: {backgroundColor: palette.panel, borderRadius: 24, borderWidth: 1, borderColor: palette.line, padding: 18}, modalHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, modalKicker: {color: palette.blue, fontSize: 9, letterSpacing: 1.5, marginBottom: 5}, modalTitle: {color: palette.white, fontSize: 20, fontWeight: '800'}, modalClose: {color: palette.white, fontSize: 28}, monthControls: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16}, monthButton: {width: 38, height: 38, borderRadius: 12, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center'}, monthButtonText: {color: palette.white, fontSize: 27, lineHeight: 30}, today: {color: palette.blue, fontSize: 10, fontWeight: '800', letterSpacing: 1.4}, calendarGrid: {flexDirection: 'row', flexWrap: 'wrap'}, weekDay: {width: '14.285%', color: palette.mist, textAlign: 'center', fontSize: 8, paddingBottom: 9}, dayCell: {width: '14.285%', height: 42, alignItems: 'center', justifyContent: 'center'}, dayButton: {width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center'}, dayButtonSelected: {backgroundColor: palette.blue}, dayText: {color: palette.white, fontSize: 12}, dayTextSelected: {fontWeight: '800'},
  timeSheet: {position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '72%', backgroundColor: palette.panel, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: palette.line, padding: 18, paddingBottom: 30}, timeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 18}, timeChoice: {width: '23%', height: 44, borderRadius: 12, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'}, timeChoiceSelected: {backgroundColor: palette.blue, borderColor: palette.blue}, timeChoiceText: {color: palette.mist, fontSize: 12}, timeChoiceTextSelected: {color: palette.white, fontWeight: '800'},
  keyboardSheet: {position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: palette.panel, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: palette.line, padding: 10, paddingBottom: Platform.OS === 'ios' ? 28 : 14}, keyboardHeader: {height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8}, doneButton: {paddingHorizontal: 14, height: 32, borderRadius: 10, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center'}, doneButtonText: {color: palette.white, fontSize: 10, fontWeight: '800', letterSpacing: 1.1}, keyboardPreview: {minHeight: 76, maxHeight: 110, backgroundColor: palette.ink, borderRadius: 14, borderWidth: 1, borderColor: palette.line, padding: 12, paddingBottom: 24, marginBottom: 10}, keyboardRow: {flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 7}, key: {flex: 1, maxWidth: 39, height: 45, borderRadius: 8, backgroundColor: '#31445F', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 2, shadowOffset: {width: 0, height: 2}}, keyText: {color: palette.white, fontSize: 15, fontWeight: '600'}, utilityKey: {width: 42, height: 45, borderRadius: 8, backgroundColor: '#263951', alignItems: 'center', justifyContent: 'center'}, spaceKey: {flex: 1, height: 45, borderRadius: 8, backgroundColor: '#31445F', alignItems: 'center', justifyContent: 'center'}, deleteKey: {width: 54, height: 45, borderRadius: 8, backgroundColor: palette.blueDeep, alignItems: 'center', justifyContent: 'center'}, utilityKeyText: {color: palette.white, fontSize: 11, fontWeight: '700', letterSpacing: 0.8},
});
