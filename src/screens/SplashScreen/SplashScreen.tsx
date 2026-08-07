import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, Easing, Image, ImageBackground, StatusBar, StyleSheet, Text, View} from 'react-native';
import {MainStackParamList} from '../../navigation/routeTypes';
import {artwork} from '../../foundation/assets';
import {palette} from '../../foundation/palette';

export const introSeenKey = '@nova-scotia-flavor-hub/intro-complete/v2';

export function SplashScreen({navigation}: NativeStackScreenProps<MainStackParamList, 'SplashScreen'>) {
  const pulse = useRef(new Animated.Value(0.95)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1.02, duration: 1300, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0.95, duration: 1300, useNativeDriver: true}),
      ]),
    );
    animation.start();
    Animated.timing(progress, {
      toValue: 1,
      duration: 1700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(async () => {
      const seenIntro = await AsyncStorage.getItem(introSeenKey);
      navigation.replace(seenIntro ? 'MainTabs' : 'IntroScreen');
    }, 1700);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [navigation, progress, pulse]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground source={artwork.splash} style={styles.screen} resizeMode="cover">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.overlay} />
      <View style={styles.layout}>
        <Animated.View style={[styles.center, {transform: [{scale: pulse}]}]}>
          <Image source={artwork.crest} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Nova Scotia Casino{'\n'}Flavor Hub</Text>
          <Text style={styles.subtitle}>Food, drinks, pairings, and venue planning in one place.</Text>
        </Animated.View>
        <View style={styles.loaderBlock}>
          <ActivityIndicator size="small" color={palette.blue} />
          <Text style={styles.loaderLabel}>Loading your flavor hub experience</Text>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, {width: progressWidth}]} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  overlay: {...StyleSheet.absoluteFill, backgroundColor: 'rgba(3, 10, 20, 0.44)'},
  layout: {flex: 1, justifyContent: 'space-between', paddingTop: 120, paddingBottom: 24},
  center: {alignItems: 'center', paddingHorizontal: 28},
  logo: {width: 312, height: 312, marginBottom: 24},
  title: {color: palette.white, fontSize: 32, lineHeight: 40, fontWeight: '800', textAlign: 'center'},
  subtitle: {color: '#D8E1EE', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 12},
  loaderBlock: {
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 22,
    backgroundColor: 'rgba(8, 16, 31, 0.72)',
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: 'center',
  },
  loaderLabel: {color: palette.white, fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 14},
  track: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(169, 181, 200, 0.22)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.blue,
  },
});
