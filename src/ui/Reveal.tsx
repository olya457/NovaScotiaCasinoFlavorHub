import React, {useEffect, useRef} from 'react';
import {Animated, ViewStyle} from 'react-native';

export function Reveal({children, delay = 0, style}: {children: React.ReactNode; delay?: number; style?: ViewStyle}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {toValue: 1, duration: 420, delay, useNativeDriver: true}),
      Animated.spring(lift, {toValue: 0, delay, speed: 16, bounciness: 4, useNativeDriver: true}),
    ]).start();
  }, [delay, lift, opacity]);
  return <Animated.View style={[style, {opacity, transform: [{translateY: lift}]}]}>{children}</Animated.View>;
}

