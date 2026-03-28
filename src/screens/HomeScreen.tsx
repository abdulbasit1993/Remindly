import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Home" isHome />

      <ScrollView contentContainerStyle={styles.container}>
        <FloatingActionButton
          onPress={() => {
            navigation.navigate('AddReminder');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
  },
});

export default HomeScreen;
