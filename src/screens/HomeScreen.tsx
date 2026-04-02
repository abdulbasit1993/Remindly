import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RectButton,
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
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

  const deleteReminder = (id: string) => {};

  const updateReminder = (id: string) => {};

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    item: any,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [0, 160],
    });

    return (
      <View style={styles.swipedRow}>
        <TouchableOpacity
          onPress={() => updateReminder(item.id)}
          style={[styles.actionButton, styles.updateButton]}
        >
          <Text style={styles.actionText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteReminder(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      friction={2}
      rightThreshold={40}
    >
      <View style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>{item?.title}</Text>
        <Text style={styles.reminderMessage}>{item?.message}</Text>
        <Text style={styles.reminderTime}>
          {new Date(item?.timestamp).toLocaleString()}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
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
    backgroundColor: COLORS.white,
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
  swipedRow: {
    flexDirection: 'row',
    width: 160,
    height: '82%', // Match the reminderCard height (minus margin)
    marginBottom: 15, // Match card marginBottom
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
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
