import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_WEATHER_OPEN_API_KEY} from '@env';
import { convertLatLonToGrid } from './convertLatLonToGrid';

export const fetchLocation = async () => {
    const token = await AsyncStorage.getItem('jwt-token');
    const response = await axios.get('http://127.0.0.1:8080/api/my-location', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchCoords = async () => {
    const token = await AsyncStorage.getItem('jwt-token');
    const response = await axios.get('http://127.0.0.1:8080/api/my-coords', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchSearched = async () => {
    const token = await AsyncStorage.getItem('jwt-token');
    const response = await axios.get('http://127.0.0.1:8080/api/my-searched', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchMyWorkoutTime = async () => {
    const token = await AsyncStorage.getItem('jwt-token');
    const response = await axios.get('http://127.0.0.1:8080/api/my-worktime', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchMyRainPercentage = async () => {
    const token = await AsyncStorage.getItem('jwt-token');
    const response = await axios.get('http://127.0.0.1:8080/api/weather', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchWeatherData = async (lat : number, lon : number) => {
    const baseUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

    const getBaseTime = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        let hour = now.getHours();
        if (minutes < 10) {
            hour -= 1;
            }
        if (hour < 0) {
            hour = 23;
        }
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
        return `${formattedHour}00`;
    };
        
    const getBaseDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
        const day = now.getDate();
    
        // 두 자릿수를 맞추기 위해 0을 추가
        const baseDate = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
        return baseDate;
    };
    
    const { x: nx, y: ny } = convertLatLonToGrid(lat, lon);
    const base_date = getBaseDate();
    const base_time = getBaseTime();
    
    const params = {
        serviceKey: decodeURIComponent(REACT_APP_WEATHER_OPEN_API_KEY),
        pageNo: '1',
        numOfRows: '1000',
        dataType: 'json',
        base_date: base_date,
        base_time: base_time,
        nx: nx.toString(),
        ny: ny.toString(),
    };

    try {
    const response = await axios.get(baseUrl, { params });
    return response.data;
    } catch (error) {
    console.error('Weather data fetch error:', error);
    throw error;
    }
};

