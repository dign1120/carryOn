import React from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';

type HomeProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className='flex-row space-x-12 mt-[24px] mb-[24px]'>
        <Text className='ml-[24px] text-[22px] font-bold'>우산을 안 챙기셔도 될 것 같아요!</Text>
        <TouchableOpacity onPress = {() => navigation.navigate("ChangeSetting")}>
          <Image source={require("../../assets/icons/myicon.png")}
          className='w-[25px] h-[25px] mr-[24px]'
          />
        </TouchableOpacity>
      </View>

      <View className='flex flex-row ml-[24px] mr-[24px] bg-[#3B82F6] h-[145px] rounded-md'>
        <View className='flex m-[15px] flex-1'>
          <Text className='text-center text-black text-[15px] font-light'>출근길까지 강수확률</Text>
          <View className='flex-1 justify-center items-center'>
            <Text className='text-[40px] text-black font-regular'>10%</Text>
          </View>
        </View>
        <View className='m-[15px] flex-1'>
          <Text className='text-center text-[15px]'>현재 날씨</Text>
          <View className='flex-row align-middle justify-center mb-1'>
            <Text className='text-[15px]'>18 °C</Text>
            <Text className='ml-1 bg-[#2561A0] p-[2px] text-white font-regular rounded-lg text-[12px]'>맑음</Text>
          </View>
          <Image source={require("../../assets/icons/weather_icon.png")}
            className='w-[75px] h-[75px] self-center'/>
        </View>
      </View>

      <View className='mt-[24px] ml-[24px] mr-[24px] mb-[24px] h-[345px] bg-slate-500 rounded-md'>
        <Image source={require("../../assets/images/kakaoMap.png")} className='w-full h-full'/>
      
      </View>

      <View className='h-[115px] ml-[24px] mr-[24px] bg-[#3B82F6] rounded-md flex-col'>
        <View className='flex flex-row mt-[21px] ml-[21px] mr-[21px]'>
          <Text className='text-[18px] font-light mr-[9px]'>출발지</Text>
          <Text className='text-[18px] font-light' >울산 남구 달동 1310-3</Text>
        </View>
        <View className='flex flex-row mt-[21px] ml-[21px] mr-[21px]'>
          <Text className='text-[18px] font-light mr-[9px]'>도착지</Text>
          <Text className='text-[18px] font-light' >플로르스터디카페 울산옥동점</Text>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default Home;
