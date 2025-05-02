import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import { useLocationStore } from '../../stores/locationStore';
import DatePicker from 'react-native-date-picker';
import { useworkoutTimeStore } from '../../stores/workoutTimeStore';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type InitSettingProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
};

const InitSetting: React.FC<InitSettingProps> = ({navigation}) => {
    const {sourceAddress, destAddress, routeCoordinates} =useLocationStore();
    const [isOpenTimePickerModal, setOpenModal] = useState<Boolean>(false);
    const {workoutTime, setWorkoutTime} = useworkoutTimeStore();

    const registerMyLocationInfo = async () => {
        if(!sourceAddress?.address){
            alert("출발지를 입력해주세요");
            return;
        }

        if(!destAddress?.address){
            alert("목적지 입력해주세요");
            return;
        }

        const token = await AsyncStorage.getItem("jwt-token");

        if (!token) {
            alert("인증 정보가 없습니다. 다시 로그인해주세요.");
            navigation.navigate("Login");
            return;
        }

        await axios.post('http://127.0.0.1:8080/api/setting-location',
            {
                "sourceAddress" : sourceAddress.address,
                "sourceSearched" : sourceAddress.searchText,
                "destAddress" : destAddress.address,
                "destSearched" : destAddress.searchText
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        await axios.post('http://127.0.0.1:8080/api/setting-coords',
            {
                "sourceLatitude" : sourceAddress.coordinates?.latitude,
                "sourceLongitude" : sourceAddress.coordinates?.longitude,
                "destLatitude" : destAddress.coordinates?.latitude,
                "destLongitude" : destAddress.coordinates?.longitude,
                "totalPathCoords" : routeCoordinates
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const localWorkoutTime = new Date(workoutTime);
        const kstOffset = 15 * 60 * 60 * 1000; // KST는 UTC보다 9시간 차이
        const utcWorkoutTime = new Date(localWorkoutTime.getTime() - kstOffset);

        await axios.post('http://127.0.0.1:8080/api/setting-worktime',
            {
                "startTime" : utcWorkoutTime.toISOString()
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        navigation.navigate("Home");
    }

    return (
        <SafeAreaView className="bg-white h-full">
        <View className='flex-col mt-[24px] mb-[24px]'>
            <Text className='ml-[24px] mb-[11px] text-[22px] font-bold'>초기설정</Text>
            <Text className='ml-[24px] text-[#767676] text-[17px] font-regular'>출발지와 목적지, 출근시간을 설정해주세요</Text>
            <Text className='ml-[24px] text-[#767676] text-[17px] font-regular'>챙겨요에서 알람을 보내드려요</Text>
        </View>

        <View className='flex flex-row ml-[24px] mr-[24px] bg-[#3B82F6] h-[163px] rounded-md'>
            <View className = "m-[12px]">
                <TouchableOpacity onPress={() => navigation.navigate("SrcDestSetting")}>
                    <View className = "flex-row m-[10px]">
                        <Text className='font-regular text-[18px] mr-[18px]'>출발지</Text>
                        <Text className='font-regular text-[18px]'>{sourceAddress?.searchText}</Text>
                    </View>
                    <View className = "flex-row m-[10px]">
                        <Text className='font-regular text-[18px] mr-[18px]'>도착지</Text>
                        <Text className='font-regular text-[18px]' >{destAddress?.searchText}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {
                    setOpenModal(true);
                }}>
                    <View className = "flex-row m-[10px]">
                        <Text className='font-regular text-[18px] mr-[18px]'>출근시간</Text>
                        <Text className='font-regular text-[18px]'>{workoutTime?.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric' })}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        
        <DatePicker modal open = {!!isOpenTimePickerModal} date = {workoutTime} 
            mode = "time" 
            cancelText="취소"
            confirmText="선택"
            title = "출근시간 설정"

            onConfirm={(date) => {
                setWorkoutTime(date);
                console.log(date);
                setOpenModal(false);
            }}
            
            onCancel={() => {
                setOpenModal(false)
            }}
        />
        
        <View className='flex mt-[380px] ml-[24px] mr-[24px] bg-[#3B82F6] h-[53px] rounded-md justify-center items-center'>
            <TouchableOpacity onPress={registerMyLocationInfo}>
                <Text className='font-regular text-[18px]'>이대로 설정하기</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
};

export default InitSetting;
