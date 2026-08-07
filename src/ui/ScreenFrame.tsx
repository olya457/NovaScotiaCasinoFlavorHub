import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {palette} from '../foundation/palette';

export function ScreenFrame({children}: {children: React.ReactNode}) {
  const insets = useSafeAreaInsets();
  const spacing = Platform.OS === 'android' ? styles.androidSpacing : {paddingTop: insets.top};
  return <View style={[styles.base, spacing]}>{children}</View>;
}

const styles = StyleSheet.create({base: {flex: 1, backgroundColor: palette.ink}, androidSpacing: {paddingTop: 30, paddingBottom: 30}});
