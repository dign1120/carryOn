import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View} from 'react-native';
import KakaoMap from '../../components/kakaoMap/KakaoMap';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLocationStore } from '../../stores/locationStore';
import axios from 'axios';
import { REACT_APP_ITS_OPEN_API_KEY } from '@env';
import { CctvItem, NearestCctvDto } from '../../types/cctv';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DetailKakaoMapProps = {
    navigation: any;
};

const DetailKakaoMap: React.FC<DetailKakaoMapProps> = ({ navigation }) => {
    const {routeCoordinates} = useLocationStore();
    const [cctvList, setCctvList] = useState<CctvItem []>([]);
    const [nearestCctvList, setNearestCctvList] = useState<NearestCctvDto []>([]);
    
    useEffect(() => {
        const findMinMaxLatLongitude = () => {
            const latitudes = routeCoordinates.map(coord => coord.latitude);
            const longitudes = routeCoordinates.map(coord => coord.longitude);
    
            const minLatitude = Math.min(...latitudes);
            const maxLatitude = Math.max(...latitudes);
            const minLongitude = Math.min(...longitudes);
            const maxLongitude = Math.max(...longitudes);
            return { minLatitude, maxLatitude, minLongitude, maxLongitude }
        } 
    
        const getCctvInfo = async () => {
            try {
                const { minLatitude, maxLatitude, minLongitude, maxLongitude } = findMinMaxLatLongitude();
                const response = await axios.get('https://openapi.its.go.kr:9443/cctvInfo', {
                params: {
                    apiKey: REACT_APP_ITS_OPEN_API_KEY,
                    type: 'its',
                    cctvType: '1',
                    minX: minLongitude -0.1,
                    maxX: maxLongitude + 0.1,
                    minY: minLatitude -0.1,
                    maxY: maxLatitude + 0.1,
                    getType: 'json'
                },
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8'
                }
                });

                setCctvList(response.data.response.data);
            
            } catch (error) {
                console.warn('api 호출 에러:', error);
            }
        };

        const getNearestCctvInfo = async () => {
            try {
                const { minLatitude, maxLatitude, minLongitude, maxLongitude } = findMinMaxLatLongitude();
        
                const token = await AsyncStorage.getItem("jwt-token");
                const response = await axios.post(
                    'http://127.0.0.1:8080/api/map-cctv',
                    {
                        min_x: minLongitude,
                        max_x: maxLongitude,
                        min_y: minLatitude,
                        max_y: maxLatitude,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
        
                const nearestCctvList = response.data;

                const filteredNearestCctvList = nearestCctvList.filter((nearest: NearestCctvDto) => {
                    return !cctvList.some((cctv : CctvItem) =>
                    cctv.coordx === nearest.XCOORD && cctv.coordy === nearest.YCOORD
                    );
                });

                setNearestCctvList(filteredNearestCctvList);
            } catch (error) {
                console.warn('API 호출 에러:', error);
            }
        };
        

        getCctvInfo();
        getNearestCctvInfo();
    }, []);

    return (
        <View className='flex-1'>
            <KakaoMap cctvList={cctvList} nearestCctvList = {nearestCctvList}/>
            <TouchableOpacity
                className="absolute top-10 left-5 bg-black/60 p-2 rounded-full z-10"
                onPress={() => navigation.goBack()}
            >
                <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

export default DetailKakaoMap;