import React, {useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import {palette} from '../foundation/palette';

type Props = {label: string; onPress: () => void; style?: ViewStyle; variant?: 'solid' | 'outline'};

export function PrismButton({label, onPress, style, variant = 'solid'}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const move = (toValue: number) => Animated.spring(scale, {toValue, useNativeDriver: true, speed: 28, bounciness: 8}).start();
  return (
    <Animated.View style={[{transform: [{scale}]}, style]}>
      <Pressable onPress={onPress} onPressIn={() => move(0.97)} onPressOut={() => move(1)} style={[styles.base, variant === 'outline' && styles.outline]}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {height: 52, borderRadius: 16, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22},
  outline: {backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.line},
  label: {color: palette.white, fontSize: 13, fontWeight: '800', letterSpacing: 1.5},
});

