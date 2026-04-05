import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, setTheme, colors } = useTheme();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System Default', value: 'system' },
  ]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.label, { color: colors.text }]}>App Theme</Text>

        <View style={{ zIndex: 1000 }}>
          <DropDownPicker
            open={open}
            value={theme}
            items={items}
            setOpen={setOpen}
            setValue={callback => {
              const value = callback(theme);
              setTheme(value);
            }}
            setItems={setItems}
            placeholder="Select Theme"
            style={[styles.dropdown, { borderColor: colors.border }]}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              { borderColor: colors.border },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#ccc',
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
});

export default SettingsScreen;
