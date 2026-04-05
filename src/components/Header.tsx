import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import IonIcons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import GearIcon from '../assets/icons/gear.svg';

const Header = ({ title, isHome }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {isHome ? null : (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <IonIcons name="chevron-back" size={30} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={styles.right}>
        {isHome ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Settings');
            }}
          >
            <GearIcon width={30} height={30} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
});

export default Header;
