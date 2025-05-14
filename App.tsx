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
import DetailKakaoMap from './src/screens/Map/DetailKakaoMap';
import { jwtDecode } from "jwt-decode";
import Join from './src/screens/Join/Join';
import { configurePushNotification } from './src/utils/notification';


const Stack = createNativeStackNavigator();
enableScreens();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    configurePushNotification();
  }, [])
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt-token');
        if (token && !isTokenExpired(token)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('AsyncStorage error:', error);
        setIsAuthenticated(false);
      }
    };

    const isTokenExpired = (token: string) => {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
      } catch (e) {
        return true;
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
          <Stack.Screen name = "Join" component={Join} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ChangeSetting" component={ChangeSetting} />
          <Stack.Screen name="InitSetting" component={InitSetting} />
          <Stack.Screen name="SrcDestSetting" component={SrcDestinationSetting} />
          <Stack.Screen name="SrcInputPage" component={SrcInputPage} />
          <Stack.Screen name="DestInputPage" component={DestInputPage} />
          <Stack.Screen name="KakaoMapPage" component = {DetailKakaoMap} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
