import React from 'react';
import { TouchableOpacity, View} from 'react-native';
import KakaoMap from '../../components/kakaoMap/KakaoMap';
import Icon from 'react-native-vector-icons/Ionicons';

type DetailKakaoMapProps = {
    navigation: any;
};

const DetailKakaoMap: React.FC<DetailKakaoMapProps> = ({ navigation }) => {
    return (
        <View className='flex-1'>
            <KakaoMap />
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