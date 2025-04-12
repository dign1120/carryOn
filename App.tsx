import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-white text-lg font-extrabold">
        Hello, NativeWind!
      </Text>
    </View>
  );
}
