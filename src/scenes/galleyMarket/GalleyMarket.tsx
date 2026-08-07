import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Dish, DishCategory, dishes} from '../../domain/catalogue';
import {palette} from '../../foundation/palette';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {PrismButton} from '../../ui/PrismButton';

const picksKey = '@nova-cove/dining-picks/v2';
const categories: DishCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Desserts'];
const priceFilters = ['Any price', 'Under $20', 'Under $30'] as const;
const dietaryFilters = ['All', 'Vegetarian', 'Gluten-aware', 'Dairy-free'] as const;
type DietaryFilter = typeof dietaryFilters[number];

const details: Record<string, {dietary: DietaryFilter[]; allergens: string}> = {
  avocado: {dietary: ['Vegetarian'], allergens: 'Gluten, dairy'},
  omelette: {dietary: ['Vegetarian', 'Gluten-aware'], allergens: 'Eggs, dairy'},
  pancakes: {dietary: ['Vegetarian'], allergens: 'Gluten, eggs, dairy'},
  continental: {dietary: ['Vegetarian'], allergens: 'Gluten, dairy'},
  pasta: {dietary: ['Vegetarian'], allergens: 'Gluten, dairy'},
  salmon: {dietary: ['Gluten-aware'], allergens: 'Fish, dairy'},
  chicken: {dietary: ['Gluten-aware'], allergens: 'Dairy'},
  gelato: {dietary: ['Vegetarian', 'Gluten-aware'], allergens: 'Dairy'},
  tart: {dietary: ['Vegetarian'], allergens: 'Gluten, eggs, dairy'},
};

export function GalleyMarket() {
  const [category, setCategory] = useState<DishCategory>('Breakfast');
  const [priceFilter, setPriceFilter] = useState<typeof priceFilters[number]>('Any price');
  const [dietary, setDietary] = useState<DietaryFilter>('All');
  const [picks, setPicks] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Dish | null>(null);

  useEffect(() => {AsyncStorage.getItem(picksKey).then(raw => raw && setPicks(JSON.parse(raw))).catch(() => undefined);}, []);
  const savePicks = async (next: string[]) => {setPicks(next); await AsyncStorage.setItem(picksKey, JSON.stringify(next));};
  const togglePick = (id: string) => savePicks(picks.includes(id) ? picks.filter(item => item !== id) : [...picks, id]);
  const maxPrice = priceFilter === 'Under $20' ? 20 : priceFilter === 'Under $30' ? 30 : Infinity;
  const shown = dishes.filter(dish => dish.category === category && dish.price < maxPrice && (dietary === 'All' || details[dish.id]?.dietary.includes(dietary)));
  const selectedDishes = picks.map(id => dishes.find(dish => dish.id === id)).filter((dish): dish is Dish => !!dish);
  const budget = useMemo(() => selectedDishes.reduce((sum, dish) => sum + dish.price, 0), [selectedDishes]);

  return <View style={styles.root}>
    <HarbourHeader title="Atlantic Galley" right={<Pressable onPress={() => setOpen(true)} style={styles.picksButton}><Text style={styles.heart}>♥</Text>{picks.length ? <View style={styles.badge}><Text style={styles.badgeText}>{picks.length}</Text></View> : null}</Pressable>} />
    <View style={styles.tabs}>{categories.map(item => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.tab, category === item && styles.tabActive]}><Text style={[styles.tabText, category === item && styles.tabTextActive]}>{item}</Text></Pressable>)}</View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.filterLabel}>PRICE</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{priceFilters.map(item => <Pressable key={item} onPress={() => setPriceFilter(item)} style={[styles.chip, priceFilter === item && styles.chipActive]}><Text style={[styles.chipText, priceFilter === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>
      <Text style={styles.filterLabel}>DIETARY</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{dietaryFilters.map(item => <Pressable key={item} onPress={() => setDietary(item)} style={[styles.chip, dietary === item && styles.chipActive]}><Text style={[styles.chipText, dietary === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>
      <Text style={styles.result}>{shown.length} menu items</Text>
      {shown.map(dish => <Pressable key={dish.id} onPress={() => setDetail(dish)} style={styles.dish}><Image source={dish.image} style={styles.food} /><View style={styles.dishCopy}><View style={styles.nameRow}><Text numberOfLines={1} style={styles.name}>{dish.name}</Text><Pressable hitSlop={10} onPress={() => togglePick(dish.id)}><Text style={[styles.favorite, picks.includes(dish.id) && styles.favoriteOn]}>{picks.includes(dish.id) ? '♥' : '♡'}</Text></Pressable></View><Text numberOfLines={2} style={styles.description}>{dish.description}</Text><View style={styles.meta}><Text style={styles.price}>${dish.price.toFixed(2)}</Text><Text style={styles.time}>◷ {dish.minutes} min</Text><Text style={styles.details}>DETAILS ›</Text></View></View></Pressable>)}
      {!shown.length ? <Text style={styles.empty}>No dishes match these filters. Try another combination.</Text> : null}
    </ScrollView>

    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}><Pressable style={styles.scrim} onPress={() => setOpen(false)} /><View style={styles.sheet}><View style={styles.sheetHead}><Text style={styles.sheetTitle}>♥  My Dining Picks</Text><Pressable onPress={() => setOpen(false)}><Text style={styles.x}>×</Text></Pressable></View><ScrollView style={styles.pickList}>{selectedDishes.length ? selectedDishes.map(dish => <View key={dish.id} style={styles.pickRow}><Pressable onPress={() => setDetail(dish)} style={styles.pickCopy}><Text style={styles.pickName}>{dish.name}</Text><Text style={styles.pickMeta}>${dish.price.toFixed(2)} · {dish.category}</Text></Pressable><Pressable onPress={() => togglePick(dish.id)}><Text style={styles.remove}>×</Text></Pressable></View>) : <Text style={styles.empty}>Tap the heart beside any dish to build your dining shortlist.</Text>}</ScrollView><View style={styles.budget}><Text style={styles.budgetLabel}>ESTIMATED BUDGET</Text><Text style={styles.budgetValue}>${budget.toFixed(2)}</Text></View><PrismButton label="VIEW DINING MENU" onPress={() => setOpen(false)} /></View></Modal>

    <Modal visible={!!detail} transparent animationType="fade" onRequestClose={() => setDetail(null)}><View style={styles.detailScrim}><View style={styles.detailCard}>{detail ? <><Image source={detail.image} style={styles.detailImage} /><Pressable onPress={() => setDetail(null)} style={styles.detailClose}><Text style={styles.x}>×</Text></Pressable><Text style={styles.detailTitle}>{detail.name}</Text><Text style={styles.detailDescription}>{detail.description}</Text><Text style={styles.detailLine}>Dietary: {details[detail.id]?.dietary.join(', ') || 'Ask the restaurant'}</Text><Text style={styles.detailLine}>Allergens: {details[detail.id]?.allergens || 'Please ask staff before ordering'}</Text><Text style={styles.disclaimer}>Ingredient and allergen information can change. Inform restaurant staff about allergies.</Text><PrismButton label={picks.includes(detail.id) ? 'REMOVE FROM MY PICKS' : 'ADD TO MY PICKS'} onPress={() => togglePick(detail.id)} /></> : null}</View></View></Modal>
  </View>;
}

const styles = StyleSheet.create({
  root: {flex: 1}, picksButton: {width: 48, height: 42, borderRadius: 14, backgroundColor: palette.blueDeep, alignItems: 'center', justifyContent: 'center'}, heart: {color: palette.white, fontSize: 20}, badge: {position: 'absolute', right: -5, top: -6, minWidth: 19, height: 19, borderRadius: 10, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center'}, badgeText: {color: palette.ink, fontSize: 10, fontWeight: '800'},
  tabs: {height: 47, flexDirection: 'row', backgroundColor: palette.panel, paddingHorizontal: 8}, tab: {flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent'}, tabActive: {borderBottomColor: palette.blue}, tabText: {color: palette.mist, fontSize: 11}, tabTextActive: {color: palette.blue}, content: {padding: 16, paddingBottom: 130}, filterLabel: {color: palette.mist, fontSize: 8, letterSpacing: 1.5, marginTop: 3, marginBottom: 7}, chips: {gap: 8, paddingBottom: 13}, chip: {borderWidth: 1, borderColor: palette.line, paddingHorizontal: 12, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'}, chipActive: {backgroundColor: palette.blueDeep, borderColor: palette.blue}, chipText: {color: palette.mist, fontSize: 10}, chipTextActive: {color: palette.white, fontWeight: '700'}, result: {color: palette.mist, fontSize: 10, marginBottom: 10},
  dish: {minHeight: 108, borderRadius: 18, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.panel, padding: 11, marginBottom: 10, flexDirection: 'row'}, food: {width: 92, height: 86, borderRadius: 13}, dishCopy: {flex: 1, marginLeft: 12}, nameRow: {flexDirection: 'row', alignItems: 'center'}, name: {color: palette.white, fontSize: 14, fontWeight: '700', flex: 1}, favorite: {color: palette.mist, fontSize: 23, marginLeft: 6}, favoriteOn: {color: palette.red}, description: {color: palette.mist, fontSize: 11, lineHeight: 16, marginTop: 5}, meta: {flexDirection: 'row', alignItems: 'center', marginTop: 8}, price: {color: palette.blue, fontWeight: '800', fontSize: 13}, time: {color: palette.mist, fontSize: 10, marginLeft: 10}, details: {marginLeft: 'auto', color: palette.blue, fontSize: 8, fontWeight: '700'}, empty: {color: palette.mist, textAlign: 'center', lineHeight: 20, marginVertical: 24},
  scrim: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,5,13,0.82)'}, sheet: {position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '72%', backgroundColor: palette.panel, padding: 20, paddingBottom: 32, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: palette.line}, sheetHead: {flexDirection: 'row', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: palette.line}, sheetTitle: {color: palette.white, fontSize: 16, fontWeight: '700', flex: 1}, x: {color: palette.white, fontSize: 25}, pickList: {maxHeight: 220}, pickRow: {flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line, paddingVertical: 12}, pickCopy: {flex: 1}, pickName: {color: palette.white, fontSize: 12, fontWeight: '700'}, pickMeta: {color: palette.mist, fontSize: 10, marginTop: 4}, remove: {color: palette.mist, fontSize: 23, padding: 5}, budget: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16}, budgetLabel: {color: palette.mist, fontSize: 9, letterSpacing: 1.2}, budgetValue: {color: palette.white, fontSize: 18, fontWeight: '800'},
  detailScrim: {flex: 1, backgroundColor: 'rgba(0,5,13,0.86)', justifyContent: 'center', padding: 22}, detailCard: {backgroundColor: palette.panel, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: palette.line}, detailImage: {width: '100%', height: 160, borderRadius: 15}, detailClose: {position: 'absolute', top: 24, right: 24, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center'}, detailTitle: {color: palette.white, fontSize: 20, fontWeight: '800', marginTop: 15}, detailDescription: {color: palette.mist, lineHeight: 20, marginTop: 7, marginBottom: 12}, detailLine: {color: palette.white, fontSize: 12, marginTop: 6}, disclaimer: {color: palette.mist, fontSize: 9, lineHeight: 14, marginVertical: 15},
});
