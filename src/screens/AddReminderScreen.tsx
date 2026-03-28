import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { reminderPresets } from '../constants/presets';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

const AddReminderScreen = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [reminderMode, setReminderMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!message) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (reminderMode === 'preset' && !selectedPreset) {
      Alert.alert('Error', 'Please select a preset');
      return;
    }

    if (reminderMode === 'custom' && (!date || !time)) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    // Handle reminder scheduling

    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'reminders',
        name: 'Scheduled Reminders',
      });

      let triggerTimestamp;

      if (reminderMode === 'preset') {
        const now = new Date();
        const futureTime = now.getTime() + selectedPreset * 60000;

        const scheduleDate = new Date(futureTime);

        scheduleDate.setSeconds(0, 0);

        triggerTimestamp = scheduleDate.getTime();
      } else {
        // Logic for custom date and time
        triggerTimestamp = new Date(date).getTime();
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTimestamp,
      };

      const reminderId = `rem-${Date.now().toString()}`;

      await notifee.createTriggerNotification(
        {
          id: reminderId,
          title: title,
          body: message,
          android: {
            channelId,
            pressAction: { id: 'default' },
            visibility: AndroidVisibility.PUBLIC,
            importance: AndroidImportance.HIGH,
            sound: 'default',
            autoCancel: true,
          },
        },
        trigger,
      );

      const readableTime = new Date(triggerTimestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      Alert.alert('Success', `Reminder scheduled for ${readableTime}`);

      // Reset form fields
      setTitle('');
      setMessage('');
      setReminderMode('preset');
      setSelectedPreset(null);
      setDate(null);
      setTime(null);
    } catch (error) {
      console.error('Notification Error: ', error);
      Alert.alert('Error', 'Failed to schedule reminder');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Add Reminder" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.subContainer}>
          <View>
            <Text style={styles.label}>Reminder Title:</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={title}
                onChangeText={text => setTitle(text)}
                style={styles.input}
                placeholder="Enter Reminder Title"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Reminder Message:</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={message}
                onChangeText={text => setMessage(text)}
                style={styles.input}
                placeholder="Enter Reminder Message"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Reminder Mode:</Text>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setReminderMode('preset')}
                style={[
                  styles.modeBtn,
                  reminderMode === 'preset' && {
                    backgroundColor: COLORS.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    reminderMode === 'preset' && { color: COLORS.white },
                  ]}
                >
                  Quick Presets
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setReminderMode('custom')}
                style={[
                  styles.modeBtn,
                  reminderMode === 'custom' && {
                    backgroundColor: COLORS.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    reminderMode === 'custom' && { color: COLORS.white },
                  ]}
                >
                  Custom
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {reminderMode === 'preset' ? (
              <View style={styles.presetsGrid}>
                {reminderPresets.map((preset, index) => (
                  <TouchableOpacity
                    onPress={() => setSelectedPreset(preset.value)}
                    key={preset.value}
                    style={[
                      styles.presetBtn,
                      selectedPreset === preset.value && styles.selectedPreset,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetBtnText,
                        selectedPreset === preset.value &&
                          styles.selectedPresetText,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : reminderMode === 'custom' ? (
              <View></View>
            ) : null}
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
    color: COLORS.black,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.black,
    width: '70%',
    marginTop: 10,
  },
  modeBtn: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  presetBtn: {
    width: '30%',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  selectedPreset: {
    backgroundColor: COLORS.primary,
  },
  presetText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  selectedPresetText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AddReminderScreen;
