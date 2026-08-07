import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, StatusBar, StyleSheet, Text, View} from 'react-native';
import {artwork} from '../../foundation/assets';
import {palette} from '../../foundation/palette';
import {RootStack} from '../../navigation/routeTypes';
import {PrismButton} from '../../ui/PrismButton';
import {passageKey} from '../emberPrelude/EmberPrelude';

const stories = [
  {image: artwork.arrival, title: 'Welcome to Nova Scotia Concierge Casino', body: 'Your complete resort companion for an effortless stay.'},
  {image: artwork.explore, title: 'Discover Every Corner', body: 'Browse venues, explore the property map, and find every experience.'},
  {image: artwork.order, title: 'Discover Dining', body: 'Explore menus, dietary details, favourites, and build a personal dining shortlist.'},
  {image: artwork.suite, title: 'Plan with Confidence', body: 'Remember your parking spot and save stay preferences on your device.'},
];

export function AuroraPassage({navigation}: NativeStackScreenProps<RootStack, 'AuroraPassage'>) {
  const [page, setPage] = useState(0);
  const list = useRef<FlatList>(null);
  const width = Dimensions.get('window').width;
  const finish = async () => {await AsyncStorage.setItem(passageKey, 'yes'); navigation.replace('HarbourOrbit');};
  const advance = () => page === stories.length - 1 ? finish() : list.current?.scrollToIndex({index: page + 1, animated: true});
  const onMomentum = (event: NativeSyntheticEvent<NativeScrollEvent>) => setPage(Math.round(event.nativeEvent.contentOffset.x / width));
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList ref={list} data={stories} horizontal pagingEnabled bounces={false} showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onMomentum} keyExtractor={item => item.title} renderItem={({item, index}) => (
        <ImageBackground source={item.image} style={[styles.story, {width}]} resizeMode="cover">
          <View style={styles.gradient} />
          <Text onPress={finish} style={styles.skip}>Skip</Text>
          <View style={styles.copy}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <View style={styles.dots}>{stories.map((_, dot) => <View key={dot} style={[styles.dot, dot === index && styles.dotActive]} />)}</View>
            <PrismButton label={index === stories.length - 1 ? 'BEGIN YOUR STAY' : 'NEXT'} onPress={advance} />
          </View>
        </ImageBackground>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: palette.ink},
  story: {flex: 1},
  gradient: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,7,17,0.24)'},
  skip: {position: 'absolute', top: 54, right: 24, color: '#D4DCE8', fontSize: 14, padding: 10},
  copy: {position: 'absolute', left: 24, right: 24, bottom: 40},
  title: {color: palette.white, fontSize: 27, lineHeight: 34, fontWeight: '800', textAlign: 'center'},
  body: {color: '#C8D1DE', textAlign: 'center', lineHeight: 21, fontSize: 14, marginTop: 12, paddingHorizontal: 10},
  dots: {height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  dot: {width: 6, height: 4, borderRadius: 2, backgroundColor: '#446081', marginHorizontal: 3},
  dotActive: {width: 25, backgroundColor: palette.blue},
});
