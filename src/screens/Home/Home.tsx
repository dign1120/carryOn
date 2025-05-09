import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import { useLocationStore } from '../../stores/locationStore';
import { fetchCoords, fetchLocation, fetchMyWorkoutTime, fetchSearched, fetchWeatherData } from '../../utils/swrFetcher';
import useSWR from 'swr';
import { useworkoutTimeStore } from '../../stores/workoutTimeStore';
import KakaoMap from '../../components/kakaoMap/KakaoMap';
import { WeatherResponse, getPTYDescription } from '../../types/weather';

type HomeProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
};


const getIconByPTY = (ptyCode: number) => {
  switch (ptyCode) {
    case 0:
      return require("../../assets/icons/sunny-icon.png"); // 맑은 날
    case 1:
      return require("../../assets/icons/rain-icon.png"); // 비 오는 날
    case 2:
      return require("../../assets/icons/rain-snow-icon.png"); // 비와 눈
    case 3:
      return require("../../assets/icons/snow-icon.png"); // 눈 오는 날
    case 5:
      return require("../../assets/icons/drizzle-icon.png"); // 빗방울
    case 6:
      return require("../../assets/icons/drizzle-icon.png"); // 빗방울/눈날림
    case 7:
      return require("../../assets/icons/drizzle-icon.png"); // 눈날림
    default:
      return require("../../assets/icons/sunny-icon.png"); // 기본 아이콘
  }
};

const getWindDirection = (deg: number) => {
  if (deg >= 337.5 || deg < 22.5) return "북풍";
  if (deg >= 22.5 && deg < 67.5) return "북동풍";
  if (deg >= 67.5 && deg < 112.5) return "동풍";
  if (deg >= 112.5 && deg < 157.5) return "남동풍";
  if (deg >= 157.5 && deg < 202.5) return "남풍";
  if (deg >= 202.5 && deg < 247.5) return "남서풍";
  if (deg >= 247.5 && deg < 292.5) return "서풍";
  if (deg >= 292.5 && deg < 337.5) return "북서풍";
  return "정보 없음";
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  const {sourceAddress, destAddress, setSourceAddress, setDestAddress, setRouteCoordinates} = useLocationStore();
  const {setWorkoutTime} = useworkoutTimeStore();
  const [temperature, setTemperature] = useState<string>("");
  const [weatherStatus, setWeatherStatus] = useState<string>("");
  const [icon, setIcon] = useState<any>(getIconByPTY(0));
  const [weatherDetailInfoModalOpen, setModalOpen] = useState<boolean>(false);

  const { data: locationData, error: locationError, isLoading: locationLoading } = useSWR('location', fetchLocation);
  const { data: coordsData, error: coordsError, isLoading: coordsLoading } = useSWR('coords', fetchCoords);
  const { data: workoutTime, error: workoutError } = useSWR('workout-time', fetchMyWorkoutTime);
  const { data: searchedData, error: searchedError } = useSWR('searched', fetchSearched);
  const { data: weatherData, error: weatherError } = useSWR<WeatherResponse>(
      sourceAddress?.coordinates?.latitude && sourceAddress.coordinates.longitude ? ['weather', sourceAddress?.coordinates?.latitude, sourceAddress.coordinates.longitude] : null,
      ([, lat, lon]: [string, number, number]) => fetchWeatherData(lat, lon)
    );
  

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

  useEffect(() => {
    const temp : string = weatherData?.response?.body?.items?.item
    .find((item) => item.category === 'T1H')
    ?.obsrValue ?? '정보 없음';

    const ptyCodeNumber : number = Number(
      weatherData?.response?.body?.items?.item
        .find((item) => item.category === 'PTY')
        ?.obsrValue ?? -1
    );

    setWeatherStatus(getPTYDescription(ptyCodeNumber));
    setIcon(getIconByPTY(ptyCodeNumber));
    setTemperature(temp);
  }, [weatherData])

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
          <TouchableOpacity 
            onPress={() => {
              if(weatherData?.response?.body.items.item){
                setModalOpen(true)}
              }}
            >
            <Text className='text-center text-[15px]'>현재 날씨</Text>
            <View className='flex-row align-middle justify-center mb-1'>
              <Text className='text-[15px]'>{temperature} °C</Text>
              <Text className='ml-1 bg-[#2561A0] p-[2px] text-white font-regular rounded-lg text-[12px]'>{weatherStatus}</Text>
            </View>
            <Image source={icon}
              className='w-[75px] h-[75px] self-center'/>
          </TouchableOpacity>
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


      <Modal
      transparent={true}
      visible={weatherDetailInfoModalOpen !== false}
      animationType="fade"
      onRequestClose={() => setModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
        <View className="flex-1 justify-center items-center bg-black/20 px-4">
          <View className="bg-white rounded-2xl w-full p-5 max-w-md">
            {weatherData?.response?.body?.items?.item && (
              <View>
                {/* 헤더 */}
                <Text className="text-center text-xl font-bold text-gray-800 mb-5">
                  🌦️ 기후 상세정보
                </Text>

                {/* 항목별 정보 */}
                {(() => {
                  const items = weatherData.response.body.items.item;
                  const get = (cat: string) =>
                    items.find((i) => i.category === cat)?.obsrValue;

                  const PTY = get("PTY") ?? "0";
                  const REH = get("REH");
                  const RN1 = get("RN1");
                  const VEC = parseFloat(get("VEC") ?? "0").toFixed(0);

                  const rainfallTypes: Record<string, string> = {
                    "0": "맑음",
                    "1": "비",
                    "2": "비/눈",
                    "3": "눈",
                    "5": "빗방울",
                    "6": "빗방울/눈날림",
                    "7": "눈날림",
                  };

                  const weather = rainfallTypes[PTY];

                  return (
                    <View className="space-y-5">
                      {/* 1. 날씨 */}
                      <View className="flex-row justify-between items-center border-[#3B82F6] border-b pb-3">
                        <Text className="text-lg text-gray-700 font-medium">현재 날씨</Text>
                        <View className="flex-row items-center space-x-3">
                          <Text className="text-xl font-bold text-blue-600">{weather}</Text>
                          {PTY === "1" && <Text className="text-2xl">🌧️</Text>}
                          {PTY === "3" && <Text className="text-2xl">❄️</Text>}
                          {PTY === "0" && <Text className="text-2xl">☀️</Text>}
                        </View>
                      </View>

                      {/* 2. 습도 */}
                      <View className="flex-row justify-between items-center border-[#3B82F6] border-b pb-3">
                        <Text className="text-lg text-gray-700 font-medium">습도</Text>
                        <Text className="text-xl font-bold text-gray-800">{REH}%</Text>
                      </View>

                      {/* 3. 강수량 (비가 올 때만) */}
                      {PTY !== "0" && (
                        <View className="flex-row justify-between items-center border-[#3B82F6] border-b pb-3">
                          <Text className="text-lg text-gray-700 font-medium">1시간 강수량</Text>
                          <Text className="text-xl font-bold text-gray-800">{RN1} mm</Text>
                        </View>
                      )}

                      {/* 4. 풍향 */}
                      <View className="flex-row justify-between items-center">
                        <Text className="text-lg text-gray-700 font-medium">풍향</Text>
                        <View className="flex-row items-center space-x-2">
                          <Text className="text-lg text-gray-600">{getWindDirection(Number(VEC))}</Text>
                          <View style={{ transform: [{ rotate: `${VEC}deg` }] }}>
                            <Text className="text-2xl">🧭</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      </Modal>



    </SafeAreaView>
  );
};

export default Home;
