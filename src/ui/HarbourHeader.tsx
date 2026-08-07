import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {palette} from '../foundation/palette';

type Props = {title: string; subtitle?: string; back?: () => void; right?: React.ReactNode};

export function HarbourHeader({title, subtitle = 'NOVA SCOTIA CASINO • FLAVOR HUB', back, right}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{subtitle}</Text>
      <View style={styles.row}>
        {back ? <Pressable onPress={back} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable> : null}
        <Text numberOfLines={1} style={[styles.title, back && styles.backTitle]}>{title}</Text>
        <View style={styles.spacer} />
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line},
  eyebrow: {color: palette.blue, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 10},
  row: {flexDirection: 'row', alignItems: 'center'},
  title: {color: palette.white, fontSize: 23, lineHeight: 29, fontWeight: '700'},
  backTitle: {marginLeft: 12, flexShrink: 1},
  back: {color: palette.white, fontSize: 40, lineHeight: 32, fontWeight: '200'},
  spacer: {flex: 1},
});
