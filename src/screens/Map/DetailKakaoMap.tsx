import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View} from 'react-native';
import KakaoMap from '../../components/kakaoMap/KakaoMap';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLocationStore } from '../../stores/locationStore';
import axios from 'axios';
import { REACT_APP_ITS_OPEN_API_KEY } from '@env';
import { CctvItem } from '../../types/cctv';

type DetailKakaoMapProps = {
    navigation: any;
};

const DetailKakaoMap: React.FC<DetailKakaoMapProps> = ({ navigation }) => {
    const {routeCoordinates} = useLocationStore();
    const [cctvList, setCctvList] = useState<CctvItem []>([]);
    
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
                
                console.log(minLatitude, maxLatitude, minLongitude, maxLongitude);
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

        getCctvInfo();
    }, []);

    return (
        <View className='flex-1'>
            <KakaoMap cctvList={cctvList} />
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