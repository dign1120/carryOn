import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Home from './src/screens/Home/Home';
import InitSetting from './src/screens/Setting/InitSetting';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ChangeSetting from './src/screens/Setting/ChangeSetting';

const Stack = createNativeStackNavigator();
enableScreens();

export default function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ChangeSetting" component={ChangeSetting} />
          <Stack.Screen name="InitSetting" component={InitSetting} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
