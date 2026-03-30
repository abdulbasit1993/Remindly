import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const getReminders = () => {
  try {
    const data = storage.getString('user_reminders');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading reminders', e);
    return [];
  }
};

export const saveReminder = newReminder => {
  try {
    const existingReminders = getReminders();
    const updatedReminders = [newReminder, ...existingReminders];

    // MMKV stores strings, so we stringify the array
    storage.set('user_reminders', JSON.stringify(updatedReminders));
  } catch (e) {
    console.error('Error saving reminder', e);
  }
};
