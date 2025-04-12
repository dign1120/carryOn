import React from 'react';
import {View, Text} from 'react-native';

type HomeProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-white text-lg font-extrabold">
        Hello, NativeWind!
      </Text>
    </View>
  );
};

export default Home;
