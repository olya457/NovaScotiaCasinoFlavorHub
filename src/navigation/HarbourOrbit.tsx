import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {BerthKeeper} from '../scenes/berthKeeper/BerthKeeper';
import {ConstellationAtlas} from '../scenes/constellationAtlas/ConstellationAtlas';
import {GalleyMarket} from '../scenes/galleyMarket/GalleyMarket';
import {LumenCabin} from '../scenes/lumenCabin/LumenCabin';
import {QuayDirectory} from '../scenes/quayDirectory/QuayDirectory';
import {TideWelcome} from '../scenes/tideWelcome/TideWelcome';
import {ScreenFrame} from '../ui/ScreenFrame';
import {FloatingOrbit} from './FloatingOrbit';
import {OrbitKey, RootStack} from './routeTypes';

export function HarbourOrbit({navigation}: NativeStackScreenProps<RootStack, 'HarbourOrbit'>) {
  const [active, setActive] = useState<OrbitKey>('TideWelcome');
  const scene = () => {
    if (active === 'QuayDirectory') {return <QuayDirectory open={venue => navigation.navigate('CoveLedger', {venue})} />;}
    if (active === 'ConstellationAtlas') {return <ConstellationAtlas open={venue => navigation.navigate('CoveLedger', {venue})} />;}
    if (active === 'GalleyMarket') {return <GalleyMarket />;}
    if (active === 'BerthKeeper') {return <BerthKeeper />;}
    if (active === 'LumenCabin') {return <LumenCabin />;}
    return <TideWelcome />;
  };
  return <ScreenFrame><StatusBar barStyle="light-content" backgroundColor="#08101F" /><View style={styles.scene}>{scene()}</View><FloatingOrbit active={active} onChange={setActive} /></ScreenFrame>;
}

const styles = StyleSheet.create({scene: {flex: 1}});
