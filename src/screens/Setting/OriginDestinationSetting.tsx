import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import KakaoMap from '../../components/kakaoMap/KakaoMap';
import { useLocationStore } from '../../stores/locationStore';

type SrcDestinationSettingProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
  route : any;
};

const SrcDestinationSetting: React.FC<SrcDestinationSettingProps> = ({navigation, route}) => {
    const [latitude, setLatitude] = useState<number>(33.45070133);
    const [longitude, setLongitude] = useState<number>(126.570667);

    const {
        sourceAddress,
        destAddress,
    } = useLocationStore();
    
    return (
        <View className="bg-white h-full relative">
            <KakaoMap longitude={longitude} latitude={latitude}/>
            <View className="absolute top-[100px] left-6 right-6 h-[83px] bg-white rounded-xl shadow">
                <View className='flex-row ml-[18px] mt-[11px] mr-[18px]'>
                    <Text className='text-[18px] font-regular mr-[18px]'>출발지</Text>
                    <TouchableOpacity
                        className="border-[#4D91FF] border-b pb-0.1"
                        onPress={() => navigation.navigate('SrcInputPage')} // 출발지 입력 페이지로 이동
                    >
                        <Text className="w-[246px] text-[18px] font-regular text-gray-400 whitespace-nowrap">{sourceAddress?.searchText}</Text>
                    </TouchableOpacity>
                </View>

                <View className='flex-row ml-[18px] mt-[18px] mr-[18px]'>
                    <Text className='text-[18px] font-regular mr-[18px]'>도착지</Text>
                    <TouchableOpacity
                        className="border-[#4D91FF] border-b  pb-0.1"
                        onPress={() => navigation.navigate('DestInputPage')} // 도착지 입력 페이지로 이동
                    >
                        <Text className="w-[246px] text-[18px] font-regular text-gray-400 whitespace-nowrap">{destAddress?.searchText}</Text>
                    </TouchableOpacity>
                </View>
            
            </View>
        </View>
    );
};

export default SrcDestinationSetting;
