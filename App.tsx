import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Calculator from './components/Calculator';
import PasswordSetup from './components/PasswordSetup';
import HiddenPhotos from './components/HiddenPhotos';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PasswordSetup">
        <Stack.Screen name="PasswordSetup" component={PasswordSetup} options={{ headerShown: false }} />
        <Stack.Screen name="Calculator" component={Calculator} options={{ headerShown: false }} />
        <Stack.Screen name="HiddenPhotos" component={HiddenPhotos} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;