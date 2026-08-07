import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {Animated, Image, ImageBackground, StatusBar, StyleSheet, Text, View} from 'react-native';
import {artwork} from '../../foundation/assets';
import {palette} from '../../foundation/palette';
import {RootStack} from '../../navigation/routeTypes';

export const passageKey = '@nova-cove/aurora-passage-complete/v1';

export function EmberPrelude({navigation}: NativeStackScreenProps<RootStack, 'EmberPrelude'>) {
  const glow = useRef(new Animated.Value(0.92)).current;
  useEffect(() => {
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(glow, {toValue: 1.04, duration: 1300, useNativeDriver: true}),
      Animated.timing(glow, {toValue: 0.92, duration: 1300, useNativeDriver: true}),
    ]));
    pulse.start();
    let active = true;
    const route = async () => {
      const complete = await AsyncStorage.getItem(passageKey);
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (active) {navigation.replace(complete === 'yes' ? 'HarbourOrbit' : 'AuroraPassage');}
    };
    route();
    return () => {active = false; pulse.stop();};
  }, [glow, navigation]);
  return (
    <ImageBackground source={artwork.splash} style={styles.backdrop} resizeMode="cover">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.shade} />
      <View style={styles.center}>
        <Animated.View style={{transform: [{scale: glow}]}}><Image source={artwork.crest} style={styles.crest} /></Animated.View>
        <Text style={styles.title}>Nova Scotia{'\n'}Concierge Casino</Text>
        <Text style={styles.tagline}>Smart Guest Companion</Text>
      </View>
      <View style={styles.loader}><View style={styles.loaderDot} /></View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, justifyContent: 'center'},
  shade: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,5,14,0.18)'},
  center: {alignItems: 'center', paddingHorizontal: 28, marginTop: 30},
  crest: {width: 240, height: 240, borderRadius: 28},
  title: {color: palette.white, fontSize: 36, textAlign: 'center', lineHeight: 43, marginTop: 26, fontWeight: '500'},
  tagline: {color: '#FFFFFF', fontSize: 16, fontStyle: 'italic', marginTop: 24},
  loader: {position: 'absolute', bottom: 86, alignSelf: 'center', width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center'},
  loaderDot: {width: 9, height: 9, borderRadius: 5, backgroundColor: palette.white},
});

