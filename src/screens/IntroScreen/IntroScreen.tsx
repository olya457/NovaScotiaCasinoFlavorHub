import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {MainStackParamList} from '../../navigation/routeTypes';
import {artwork} from '../../foundation/assets';
import {palette} from '../../foundation/palette';
import {PrismButton} from '../../ui/PrismButton';
import {introSeenKey} from '../SplashScreen/SplashScreen';

const storyCards = [
  {image: artwork.arrival, title: 'Welcome to Nova Scotia Casino Flavor Hub', body: 'A refreshed food and drink companion built around venues, menus, and table plans.'},
  {image: artwork.explore, title: 'Browse food-first destinations', body: 'Open venue cards, compare service hours, and spot the best rooms for bites, cocktails, or dessert.'},
  {image: artwork.order, title: 'Build your menu shortlist', body: 'Save dishes, track drink ideas, and mix fast snacks with signature dinner plans.'},
  {image: artwork.suite, title: 'Plan the night in one flow', body: 'Lock in arrival time, party size, notes, and your ideal food-and-drink route.'},
];

export function IntroScreen({navigation}: NativeStackScreenProps<MainStackParamList, 'IntroScreen'>) {
  const width = Dimensions.get('window').width;
  const listRef = useRef<FlatList>(null);
  const [activePage, setActivePage] = useState(0);

  const finish = async () => {
    await AsyncStorage.setItem(introSeenKey, 'true');
    navigation.replace('MainTabs');
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActivePage(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const advance = () => {
    if (activePage === storyCards.length - 1) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({index: activePage + 1, animated: true});
  };

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        ref={listRef}
        data={storyCards}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.title}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({item, index}) => (
          <ImageBackground source={item.image} style={[styles.slide, {width}]} resizeMode="cover">
            <View style={styles.overlay} />
            <Pressable onPress={finish} style={styles.skip}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <View style={styles.dots}>
                {storyCards.map((_, dotIndex) => (
                  <View key={dotIndex} style={[styles.dot, dotIndex === index && styles.dotActive]} />
                ))}
              </View>
              <PrismButton label={index === storyCards.length - 1 ? 'OPEN FLAVOR HUB' : 'NEXT'} onPress={advance} />
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: palette.ink},
  slide: {flex: 1},
  overlay: {...StyleSheet.absoluteFill, backgroundColor: 'rgba(1, 7, 17, 0.28)'},
  skip: {position: 'absolute', top: 54, right: 20, padding: 10},
  skipText: {color: '#D4DCE8', fontSize: 14},
  copy: {position: 'absolute', left: 24, right: 24, bottom: 42},
  title: {color: palette.white, fontSize: 29, lineHeight: 36, fontWeight: '800', textAlign: 'center'},
  body: {color: '#C8D1DE', textAlign: 'center', lineHeight: 22, fontSize: 14, marginTop: 12},
  dots: {height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  dot: {width: 8, height: 4, borderRadius: 2, backgroundColor: '#446081', marginHorizontal: 3},
  dotActive: {width: 26, backgroundColor: palette.blue},
});
