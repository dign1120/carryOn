import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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



