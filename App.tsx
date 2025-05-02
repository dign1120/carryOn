import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import React, {useState, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './src/screens/Home/Home';
import InitSetting from './src/screens/Setting/InitSetting';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ChangeSetting from './src/screens/Setting/ChangeSetting';
import SrcDestinationSetting from './src/screens/Setting/OriginDestinationSetting';
import SrcInputPage from './src/screens/Setting/SrcInputPage';
import DestInputPage from './src/screens/Setting/DestInputPage';
import Login from './src/screens/Login/Login';

const Stack = createNativeStackNavigator();
enableScreens();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt-token');
        setIsAuthenticated(!!token); // 토큰이 있으면 true, 없으면 false
      } catch (error) {
        console.error('AsyncStorage error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();

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
          initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
          <Stack.Screen name = "Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ChangeSetting" component={ChangeSetting} />
          <Stack.Screen name="InitSetting" component={InitSetting} />
          <Stack.Screen name="SrcDestSetting" component={SrcDestinationSetting} />
          <Stack.Screen name="SrcInputPage" component={SrcInputPage} />
          <Stack.Screen name="DestInputPage" component={DestInputPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
