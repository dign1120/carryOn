import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import { useLocationStore } from '../../stores/locationStore';
import { fetchCoords, fetchLocation, fetchMyWorkoutTime, fetchSearched } from '../../utils/swrFetcher';
import useSWR from 'swr';
import { useworkoutTimeStore } from '../../stores/workoutTimeStore';
import KakaoMap from '../../components/kakaoMap/KakaoMap';

type HomeProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  const {sourceAddress, destAddress, setSourceAddress, setDestAddress, setRouteCoordinates} = useLocationStore();
  const {setWorkoutTime} = useworkoutTimeStore();

  const { data: locationData, error: locationError, isLoading: locationLoading } = useSWR('location', fetchLocation);
  const { data: coordsData, error: coordsError, isLoading: coordsLoading } = useSWR('coords', fetchCoords);
  const { data: workoutTime, error: workoutError } = useSWR('workout-time', fetchMyWorkoutTime);
  const { data: searchedData, error: searchedError } = useSWR('searched', fetchSearched);

  useEffect(() => {
    if (locationData && coordsData) {
      setSourceAddress({
        ...sourceAddress!,
        searchText : locationData.sourceSearched,
        address : locationData.sourceAddress,
        coordinates: {
            latitude: coordsData[0].sourceLatitude,
            longitude: coordsData[0].sourceLongitude
        }
        })
      setDestAddress({
        ...destAddress!,
        searchText : locationData.destSearched,
        address : locationData.destAddress,
        coordinates: {
            latitude: coordsData[0].destLatitude,
            longitude: coordsData[0].destLongitude
        }
        })

      setRouteCoordinates(coordsData[0].totalPathCoords);
    }

    if(workoutTime){
      setWorkoutTime(new Date(workoutTime.startTime));
    }
  }, [locationData, coordsData, workoutTime, searchedData]);

  useEffect(() => {
    const allLoaded = !locationLoading && !coordsLoading;
    const isMissing = !locationData?.sourceAddress || !locationData?.destAddress;

    if (allLoaded && isMissing) {
      navigation.replace('InitSetting');
    }
  }, [sourceAddress, destAddress, locationLoading, coordsLoading]);


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

      <TouchableOpacity onPress={() => navigation.navigate('KakaoMapPage')}>
        <View className='mt-[24px] ml-[24px] mr-[24px] mb-[24px] h-[345px] bg-slate-500 rounded-md'>
          <KakaoMap />      
        </View>
      </TouchableOpacity>

      <View className='h-[115px] ml-[24px] mr-[24px] bg-[#3B82F6] rounded-md flex-col'>
        <View className='flex flex-row mt-[21px] ml-[21px] mr-[21px]'>
          <Text className='text-[18px] font-light mr-[9px]'>출발지</Text>
          <Text className='text-[18px] font-light' >{sourceAddress?.searchText}</Text>
        </View>
        <View className='flex flex-row mt-[21px] ml-[21px] mr-[21px]'>
          <Text className='text-[18px] font-light mr-[9px]'>도착지</Text>
          <Text className='text-[18px] font-light' >{destAddress?.searchText}</Text>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default Home;
