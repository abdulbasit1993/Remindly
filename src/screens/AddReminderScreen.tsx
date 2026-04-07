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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { reminderPresets } from '../constants/presets';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { saveReminder } from '../utils/storage';
import { REMINDER_CHANNEL_ID } from '../constants/config';
import { useTheme } from '../context/ThemeContext';

const AddReminderScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [reminderMode, setReminderMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customDate, setCustomDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const showDatePicker = () => setIsDatePickerVisible(true);
  const hideDatePicker = () => setIsDatePickerVisible(false);

  const handleDateConfirm = date => {
    const updatedDate = new Date(customDate);
    updatedDate.setFullYear(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    setCustomDate(updatedDate);
    hideDatePicker();
  };

  const showTimePicker = () => setIsTimePickerVisible(true);
  const hideTimePicker = () => setIsTimePickerVisible(false);

  const handleTimeConfirm = time => {
    const updatedDate = new Date(customDate);
    updatedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    setCustomDate(updatedDate);
    hideTimePicker();
  };

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

    if (
      reminderMode === 'custom' &&
      (!customDate || isNaN(customDate.getTime()))
    ) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    // Handle reminder scheduling

    try {
      await notifee.requestPermission();

      let triggerTimestamp;

      if (reminderMode === 'preset') {
        const now = new Date();
        const futureTime = now.getTime() + selectedPreset * 60000;

        const scheduleDate = new Date(futureTime);

        scheduleDate.setSeconds(0, 0);

        triggerTimestamp = scheduleDate.getTime();
      } else {
        // Logic for custom date and time
        triggerTimestamp = customDate.getTime();
        if (triggerTimestamp <= Date.now()) {
          Alert.alert('Error', 'Please select a future time');
          return;
        }
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
            channelId: REMINDER_CHANNEL_ID,
            pressAction: { id: 'default' },
            visibility: AndroidVisibility.PUBLIC,
            importance: AndroidImportance.HIGH,
            sound: 'default',
            autoCancel: true,
          },
        },
        trigger,
      );

      // Prepare the reminder object for MMKV
      const newReminderRecord = {
        id: reminderId,
        title: title,
        message: message,
        timestamp: triggerTimestamp,
        mode: reminderMode,
        preset: reminderMode === 'preset' ? selectedPreset : null,
        createdAt: new Date().toISOString(),
      };

      // Save to internal storage
      saveReminder(newReminderRecord);

      Alert.alert(
        'Success',
        `Reminder scheduled for ${moment(triggerTimestamp).format('LT')}`,
      );

      // Reset form fields
      setTitle('');
      setMessage('');
      setReminderMode('preset');
      setSelectedPreset(null);
      setCustomDate(new Date());

      navigation.navigate('Home');
    } catch (error) {
      console.error('Notification Error: ', error);
      Alert.alert('Error', 'Failed to schedule reminder');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundColor }]}
    >
      <Header title="Add Reminder" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.subContainer}>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>
              Reminder Title:
            </Text>

            <View style={[styles.inputContainer, { borderColor: colors.text }]}>
              <TextInput
                value={title}
                onChangeText={text => setTitle(text)}
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter Reminder Title"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.text }]}>
              Reminder Message:
            </Text>

            <View style={[styles.inputContainer, { borderColor: colors.text }]}>
              <TextInput
                value={message}
                onChangeText={text => setMessage(text)}
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter Reminder Message"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.text }]}>
              Reminder Mode:
            </Text>

            <View style={[styles.row, { borderColor: colors.text }]}>
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
                    { color: colors.text },
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
                    { color: colors.text },
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
                      {
                        backgroundColor: 'transparent',
                        borderColor: colors.text,
                      },
                      selectedPreset === preset.value && styles.selectedPreset,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetBtnText,
                        { color: colors.text },
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
              <View style={styles.customContainer}>
                <TouchableOpacity
                  style={[
                    styles.dateTimeSelector,
                    {
                      backgroundColor: 'transparent',
                      borderColor: colors.text,
                    },
                  ]}
                  onPress={showDatePicker}
                >
                  <Text style={[styles.dateTimeLabel, { color: colors.text }]}>
                    Date: {moment(customDate).format('LL')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.dateTimeSelector,
                    {
                      backgroundColor: 'transparent',
                      borderColor: colors.text,
                    },
                  ]}
                  onPress={showTimePicker}
                >
                  <Text style={[styles.dateTimeLabel, { color: colors.text }]}>
                    Time: {moment(customDate).format('LT')}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                  minimumDate={new Date()}
                />

                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={handleTimeConfirm}
                  onCancel={hideTimePicker}
                />
              </View>
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
  },
  inputContainer: {
    borderWidth: 1,
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
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetBtnText: {
    fontWeight: '600',
    fontSize: 14,
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
  customContainer: {
    marginTop: 20,
    gap: 10,
  },
  dateTimeSelector: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateTimeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddReminderScreen;
