import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert,
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
import { deleteReminder, storage } from '../utils/storage';
import notifee from '@notifee/react-native';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const navigation = useNavigation();

  const { colors, theme } = useTheme();

  const [remindersJSON] = useMMKVString('user_reminders', storage);

  const reminders = useMemo(() => {
    return remindersJSON ? JSON.parse(remindersJSON) : [];
  }, [remindersJSON]);

  const cancelScheduledReminder = async (id: string): Promise<boolean> => {
    try {
      await notifee.cancelTriggerNotification(id);

      await notifee.cancelDisplayedNotification(id);

      console.log(`Notification ${id} cancelled successfully`);
      return true;
    } catch (error) {
      console.error('Error cancelling notification: ', error);
      return false;
    }
  };

  const handleDeleteReminder = async (id: string) => {
    const deleted = deleteReminder(id);
    if (deleted) {
      await cancelScheduledReminder(id);

      Alert.alert('Success', 'Reminder deleted successfully');
    } else {
      Alert.alert('Error', 'Failed to delete reminder');
    }
  };

  const onDeletePress = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteReminder(id),
          style: 'destructive',
        },
      ],
    );
  };

  const onUpdatePress = (item: unknown) => {
    navigation.navigate('UpdateReminder', { data: item });
  };

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
          onPress={() => onUpdatePress(item)}
          style={[styles.actionButton, styles.updateButton]}
        >
          <Text style={styles.actionText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDeletePress(item.id)}
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
      <View style={[styles.reminderCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.reminderTitle, { color: colors.text }]}>
          {item?.title}
        </Text>
        <Text
          style={[
            styles.reminderMessage,
            { color: theme === 'dark' ? '#d0cfcf' : '#000000' },
          ]}
        >
          {item?.message}
        </Text>
        <Text style={styles.reminderTime}>
          {new Date(item?.timestamp).toLocaleString()}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.backgroundColor }]}
      >
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
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
  reminderTitle: { fontSize: 18, fontWeight: 'bold' },
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
