import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import KakaoMap from '../../components/kakaoMap/KakaoMap';
import { useLocationStore } from '../../stores/locationStore';
import axios from 'axios';
import tMap from "./../../mocks/tmap.json";
import { Route } from '../../types/setting';
import {REACT_APP_SK_OPEN_API_KEY} from '@env';

type SrcDestinationSettingProps = {
    navigation: any; // 필요하다면 any 대신 정확한 타입 사용
    route : any;
};

const SrcDestinationSetting: React.FC<SrcDestinationSettingProps> = ({navigation, route}) => {
    const {
        sourceAddress,
        destAddress,
        routeCoordinates,
        setRouteCoordinates
    } = useLocationStore();
    
    const callTmapTransitRoute = async () => {
        function findFastestItinerary(data : any) {
            const itineraries = data.metaData.plan.itineraries;
        
            if (!itineraries || itineraries.length === 0) return null;
        
            // totalTime 기준으로 가장 작은 경로 찾기
            let fastest = itineraries[0];
        
            for (let i = 1; i < itineraries.length; i++) {
            if (itineraries[i].totalTime < fastest.totalTime) {
                fastest = itineraries[i];
            }
            }
        
            return fastest;
        }
        
        
        if (!sourceAddress?.coordinates || !destAddress?.coordinates) return;
    
        const { latitude: startY, longitude: startX } = sourceAddress.coordinates;
        const { latitude: endY, longitude: endX } = destAddress.coordinates;
    
        try {
        const res = await axios.post(
            'https://apis.openapi.sk.com/transit/routes',
            {
            startX: String(startX),
            startY: String(startY),
            endX: String(endX),
            endY: String(endY),
            count: 10,
            lang: 0,
            format: 'json'
            },
            {
            headers: {
                accept: 'application/json',
                appKey: `${REACT_APP_SK_OPEN_API_KEY}`,
                'content-type': 'application/json'
            }
            }
        );
        const result = res.data;

        const mock = tMap;
    
        // 응답 파싱해서 경로 좌표 추출
        const fastest_route = findFastestItinerary(result);
        const routes = fastest_route?.legs || [];
        const allCoords: { latitude: number; longitude: number }[] = [];
    
        const extractCoordinates = (data: Route) => {
            data.forEach(leg => {
                if (leg.mode === "WALK") {
                    allCoords.push({ latitude: leg.start.lat, longitude: leg.start.lon });

                    leg.steps?.forEach(step => {
                        const points = step.linestring.split(" ");
                        points.forEach(point => {
                            const [lon, lat] = point.split(",").map(Number);
                            allCoords.push({ latitude :lat, longitude : lon });
                        });
                    });

                    allCoords.push({ latitude: leg.end.lat, longitude: leg.end.lon });
                }

                if (leg.mode === "BUS") {
                    allCoords.push({ latitude: leg.start.lat, longitude: leg.start.lon });
                    
                    const passShape = leg.passShape?.linestring.split(" ");
                    passShape.forEach(point => {
                        const [lon, lat] = point.split(",").map(Number);
                        allCoords.push({ latitude :lat, longitude : lon });
                    })

                    allCoords.push({ latitude: leg.end.lat, longitude: leg.end.lon });
                }
            });
        };

        extractCoordinates(routes);
    
        if (allCoords.length > 0) {
            setRouteCoordinates(allCoords);
        } else {
            console.warn('대중교통 경로 좌표가 없습니다.');
        }
        } catch (error) {
        console.error('Tmap 대중교통 API 오류:', error);
        }
    };

    const callTmapPedestrianRoute = async () => {
        if (!sourceAddress?.coordinates || !destAddress?.coordinates) return;

        const { latitude: startY, longitude: startX } = sourceAddress.coordinates;
        const { latitude: endY, longitude: endX } = destAddress.coordinates;
    
        try {
        const res = await axios.post(
            'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1',
            {
            startX,
            startY,
            endX,
            endY,
            startName: sourceAddress.searchText,
            endName: destAddress.searchText,
            },
            {
            headers: {
                accept: 'application/json',
                appKey: `${REACT_APP_SK_OPEN_API_KEY}`,
                'content-type': 'application/json',
            },
            }
        );
    
        const features = res.data?.features || [];
        const coords: { latitude: number; longitude: number }[] = [];
    
        features.forEach((feature: any) => {
            const geometry = feature.geometry;
            if (geometry.type === 'LineString') {
            geometry.coordinates.forEach((coord: number[]) => {
                coords.push({
                longitude: coord[0],
                latitude: coord[1],
                });
            });
            }
        });
    
        if (coords.length > 0) {
            setRouteCoordinates(coords);
        } else {
            console.warn('도보 경로 좌표 없음');
        }
        } catch (error) {
        console.error('Tmap 도보 API 오류:', error);
        }
    };

    return (
        <View className="bg-white h-full relative">
            <KakaoMap/>
            <View className={`absolute top-[100px] left-6 right-6 rounded-xl shadow bg-white ${
                    sourceAddress?.address && destAddress?.address ? 'h-[113px]' : 'h-[83px]'
            }`}>
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
                {sourceAddress?.address && destAddress?.address && 
                <View className='flex-row ml-[40px] mt-[8px] mr-[18px] items-center'>
                    <Text className='font-regular font-[12px] text-[#4D91FF]'>선택</Text>
                    <TouchableOpacity onPress={() => callTmapPedestrianRoute()}>
                        <Text className='ml-[18px] p-1 font-regular font-[12px] text-[#4D91FF] border-[#4D91FF] border rounded-[5px]'>도보이용</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => callTmapTransitRoute()}>
                        <Text className='ml-[2px] p-1 font-regular font-[12px] text-[#4D91FF] border-[#4D91FF] border rounded-[5px]'>버스이용</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
            {
                sourceAddress?.address && 
                destAddress?.address && 
                routeCoordinates.length > 0 &&
                <View className='absolute top-[213px] right-[24px] w-[72px] h-[32px] bg-[#4D91FF] rounded-[25px] flex items-center justify-center'>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("ChangeSetting");
                    }}>
                        <Text className='text-[18px] font-regular text-center'>완료</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

export default SrcDestinationSetting;
