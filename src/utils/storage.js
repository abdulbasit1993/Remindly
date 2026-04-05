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

export const deleteReminder = id => {
  try {
    const existingReminders = getReminders();
    const updatedReminders = existingReminders.filter(
      reminder => reminder.id !== id,
    );
    storage.set('user_reminders', JSON.stringify(updatedReminders));
    return true;
  } catch (e) {
    console.error('Error deleting reminder: ', e);
    return false;
  }
};

export const updateReminderById = (id, updatedData) => {
  try {
    const existingReminders = getReminders();
    const updatedReminders = existingReminders.map(reminder =>
      reminder.id === id ? { ...reminder, ...updatedData } : reminder,
    );
    storage.set('user_reminders', JSON.stringify(updatedReminders));
    return true;
  } catch (e) {
    console.error('Error updating reminder: ', e);
    return false;
  }
};
