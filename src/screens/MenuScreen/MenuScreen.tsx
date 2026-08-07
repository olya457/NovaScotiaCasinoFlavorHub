import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {flavorItems, FlavorItem, MenuSection} from '../../domain/flavorHubData';
import {palette} from '../../foundation/palette';
import {TabParamList} from '../../navigation/routeTypes';
import {HarbourHeader} from '../../ui/HarbourHeader';
import {PrismButton} from '../../ui/PrismButton';
import {ScreenFrame} from '../../ui/ScreenFrame';

const shortlistKey = '@nova-scotia-flavor-hub/shortlist/v2';
const sections: MenuSection[] = ['Breakfast', 'Small Plates', 'Signature Plates', 'Desserts', 'Drinks'];

type Props = BottomTabScreenProps<TabParamList, 'MenuScreen'>;

export function MenuScreen(_: Props) {
  const [section, setSection] = useState<MenuSection>('Signature Plates');
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [detailItem, setDetailItem] = useState<FlavorItem | null>(null);
  const [shortlistOpen, setShortlistOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(shortlistKey).then(raw => raw && setShortlist(JSON.parse(raw))).catch(() => undefined);
  }, []);

  const toggleShortlist = async (id: string) => {
    const next = shortlist.includes(id) ? shortlist.filter(item => item !== id) : [...shortlist, id];
    setShortlist(next);
    await AsyncStorage.setItem(shortlistKey, JSON.stringify(next));
  };

  const visibleItems = useMemo(() => flavorItems.filter(item => item.section === section), [section]);
  const shortlistItems = useMemo(() => shortlist.map(id => flavorItems.find(item => item.id === id)).filter((item): item is FlavorItem => !!item), [shortlist]);
  const totalBudget = useMemo(() => shortlistItems.reduce((sum, item) => sum + item.price, 0), [shortlistItems]);

  return (
    <ScreenFrame>
      <HarbourHeader
        title="Menu Explorer"
        subtitle="NOVA SCOTIA CASINO • FOOD & DRINK"
        right={
          <Pressable onPress={() => setShortlistOpen(true)} style={styles.counter}>
            <Text style={styles.counterText}>{shortlist.length}</Text>
          </Pressable>
        }
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {sections.map(item => (
          <Pressable key={item} onPress={() => setSection(item)} style={[styles.tab, section === item && styles.tabActive]}>
            <Text style={[styles.tabText, section === item && styles.tabTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visibleItems.map(item => (
          <Pressable key={item.id} onPress={() => setDetailItem(item)} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.copy}>
              <View style={styles.row}>
                <Text numberOfLines={1} style={styles.name}>{item.title}</Text>
                <Pressable hitSlop={10} onPress={() => toggleShortlist(item.id)}>
                  <Text style={[styles.favorite, shortlist.includes(item.id) && styles.favoriteOn]}>{shortlist.includes(item.id) ? '♥' : '♡'}</Text>
                </Pressable>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.meta}>${item.price.toFixed(2)} · {item.prepMinutes} min</Text>
              <Text style={styles.tags}>{item.tags.join(' • ')}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={shortlistOpen} transparent animationType="slide" onRequestClose={() => setShortlistOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setShortlistOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>My Flavor Shortlist</Text>
            <Pressable onPress={() => setShortlistOpen(false)}><Text style={styles.close}>×</Text></Pressable>
          </View>
          <ScrollView style={styles.sheetList}>
            {shortlistItems.length ? shortlistItems.map(item => (
              <View key={item.id} style={styles.sheetRow}>
                <View style={styles.sheetCopy}>
                  <Text style={styles.sheetName}>{item.title}</Text>
                  <Text style={styles.sheetMeta}>${item.price.toFixed(2)} · {item.section}</Text>
                </View>
                <Pressable onPress={() => toggleShortlist(item.id)}><Text style={styles.remove}>×</Text></Pressable>
              </View>
            )) : <Text style={styles.empty}>Save dishes or drinks to build a quick shortlist.</Text>}
          </ScrollView>
          <View style={styles.budget}>
            <Text style={styles.budgetLabel}>ESTIMATED SPEND</Text>
            <Text style={styles.budgetValue}>${totalBudget.toFixed(2)}</Text>
          </View>
          <PrismButton label="RETURN TO MENU" onPress={() => setShortlistOpen(false)} />
        </View>
      </Modal>

      <Modal visible={!!detailItem} transparent animationType="fade" onRequestClose={() => setDetailItem(null)}>
        <View style={styles.detailScrim}>
          <View style={styles.detailCard}>
            {detailItem ? (
              <>
                <Image source={detailItem.image} style={styles.detailImage} />
                <Pressable onPress={() => setDetailItem(null)} style={styles.detailClose}>
                  <Text style={styles.close}>×</Text>
                </Pressable>
                <Text style={styles.detailTitle}>{detailItem.title}</Text>
                <Text style={styles.detailBody}>{detailItem.description}</Text>
                <Text style={styles.detailMeta}>Ready in about {detailItem.prepMinutes} min</Text>
                <Text style={styles.detailMeta}>Best for: {detailItem.tags.join(', ')}</Text>
                <PrismButton
                  label={shortlist.includes(detailItem.id) ? 'REMOVE FROM SHORTLIST' : 'ADD TO SHORTLIST'}
                  onPress={() => toggleShortlist(detailItem.id)}
                />
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  counter: {width: 40, height: 40, borderRadius: 14, backgroundColor: palette.blueDeep, alignItems: 'center', justifyContent: 'center'},
  counterText: {color: palette.white, fontSize: 13, fontWeight: '800'},
  tabs: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6, gap: 8},
  tab: {height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center'},
  tabActive: {backgroundColor: palette.blueDeep, borderColor: palette.blue},
  tabText: {color: palette.mist, fontSize: 10},
  tabTextActive: {color: palette.white, fontWeight: '700'},
  content: {paddingHorizontal: 16, paddingBottom: 120},
  card: {flexDirection: 'row', backgroundColor: palette.panel, borderRadius: 18, borderWidth: 1, borderColor: palette.line, padding: 12, marginTop: 10},
  image: {width: 92, height: 88, borderRadius: 13},
  copy: {flex: 1, marginLeft: 12},
  row: {flexDirection: 'row', alignItems: 'center'},
  name: {color: palette.white, fontSize: 14, fontWeight: '700', flex: 1},
  favorite: {color: palette.mist, fontSize: 20},
  favoriteOn: {color: palette.red},
  description: {color: palette.mist, fontSize: 11, lineHeight: 16, marginTop: 5},
  meta: {color: palette.blue, fontSize: 11, marginTop: 7},
  tags: {color: palette.white, fontSize: 9, lineHeight: 14, marginTop: 6},
  scrim: {...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,5,13,0.82)'},
  sheet: {position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '72%', backgroundColor: palette.panel, padding: 20, paddingBottom: 32, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: palette.line},
  sheetHead: {flexDirection: 'row', alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: palette.line},
  sheetTitle: {color: palette.white, fontSize: 17, fontWeight: '700', flex: 1},
  close: {color: palette.white, fontSize: 24},
  sheetList: {maxHeight: 240},
  sheetRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line},
  sheetCopy: {flex: 1},
  sheetName: {color: palette.white, fontSize: 12, fontWeight: '700'},
  sheetMeta: {color: palette.mist, fontSize: 10, marginTop: 4},
  remove: {color: palette.mist, fontSize: 22, padding: 5},
  budget: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16},
  budgetLabel: {color: palette.mist, fontSize: 9, letterSpacing: 1.4},
  budgetValue: {color: palette.white, fontSize: 18, fontWeight: '800'},
  empty: {color: palette.mist, textAlign: 'center', marginVertical: 24},
  detailScrim: {flex: 1, backgroundColor: 'rgba(0,5,13,0.86)', justifyContent: 'center', padding: 22},
  detailCard: {backgroundColor: palette.panel, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: palette.line},
  detailImage: {width: '100%', height: 160, borderRadius: 15},
  detailClose: {position: 'absolute', top: 24, right: 24, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center'},
  detailTitle: {color: palette.white, fontSize: 20, fontWeight: '800', marginTop: 15},
  detailBody: {color: palette.mist, lineHeight: 20, marginTop: 7, marginBottom: 12},
  detailMeta: {color: palette.white, fontSize: 12, marginTop: 6, marginBottom: 4},
});
