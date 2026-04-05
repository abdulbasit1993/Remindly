import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddReminderScreen from './screens/AddReminderScreen';
import UpdateReminderScreen from './screens/UpdateReminderScreen';
import SettingsScreen from './screens/SettingsScreen';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import { REMINDER_CHANNEL_ID, REMINDER_CHANNEL_NAME } from './constants/config';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const setupChannel = async () => {
      await notifee.createChannel({
        id: REMINDER_CHANNEL_ID,
        name: REMINDER_CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    };

    setupChannel();
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('User has authorized notifications');
      } else {
        console.log('User has not authorized notifications');
      }
    };

    requestPermission();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen} />
          <Stack.Screen
            name="UpdateReminder"
            component={UpdateReminderScreen}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
