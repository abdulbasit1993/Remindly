import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { useMMKVString } from 'react-native-mmkv';
import { storage } from '../utils/storage';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [remindersJSON] = useMMKVString('user_reminders', storage);

  const reminders = useMemo(() => {
    return remindersJSON ? JSON.parse(remindersJSON) : [];
  }, [remindersJSON]);

  console.log('reminders ===>> ', reminders);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.reminderCard}>
      <Text style={styles.reminderTitle}>{item?.title}</Text>
      <Text style={styles.reminderMessage}>{item?.message}</Text>
      <Text style={styles.reminderTime}>
        {new Date(item?.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Home" isHome />

      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reminders set yet.</Text>
            <Text style={styles.emptyText}>
              Press the '+' button to add a new reminder.
            </Text>
          </View>
        }
      />

      <FloatingActionButton
        onPress={() => {
          navigation.navigate('AddReminder');
        }}
      />
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
  reminderCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  reminderTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  reminderMessage: { fontSize: 14, color: '#666', marginTop: 5 },
  reminderTime: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 10,
    fontWeight: '600',
  },
  emptyState: { alignItems: 'center', marginTop: 50 },
  listContainer: { padding: 20, paddingBottom: 100 },
  emptyText: { color: '#999', fontSize: 16 },
});

export default HomeScreen;
