import React, { useState, useEffect } from 'react';
import {
View,
Text,
SafeAreaView,
TextInput,
FlatList,
TouchableOpacity,
ActivityIndicator,
Keyboard,
} from 'react-native';
import useSWR from 'swr';
import { axiosFetcher } from './../../utils/fetcher';
import { useLocationStore } from '../../stores/locationStore';
import Icon from 'react-native-vector-icons/Ionicons';
import { REACT_APP_SEARCH_ADDRESS_API_KEY } from '@env';

type DestInputPageProps = {
navigation: any;
};

const DestInputPage: React.FC<DestInputPageProps> = ({ navigation }) => {
const [inputText, setInputText] = useState<string>('');
const [searchText, setSearchText] = useState<string>('');

const {setDestAddress} = useLocationStore();

const { data, error, isLoading } = useSWR(
    searchText.length > 1
    ? `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${REACT_APP_SEARCH_ADDRESS_API_KEY}&currentPage=1&countPerPage=10&keyword=${searchText}&resultType=json`
    : null,
    axiosFetcher
);

const addressList = data?.results?.juso ?? [];
const handleSelectAddress = (address: string) => {
    Keyboard.dismiss();
    setDestAddress({
        searchText : searchText,
        address : address
    })
    navigation.navigate('SrcDestSetting');
};

const handleSearch = () => {
    Keyboard.dismiss();
    setSearchText(inputText);
};

return (
    <SafeAreaView className="bg-white h-full">
    <View className="flex-row justify-between items-center mt-[24px] mb-[30px] px-[24px]">
        <Text className="text-[22px] font-bold">도착지 주소 확인</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SrcDestSetting")}>
            <Icon name="close-outline" size={24} color="#000" />
        </TouchableOpacity>
    </View>

    <View className="flex ml-[24px] mr-[24px] border-b border-[#4D91FF] pb-1">
        <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="주소를 입력하세요"
        onSubmitEditing={handleSearch} // <- 검색 키 누르면 검색
        returnKeyType="search" // <- 키보드에 '검색' 표시
        className="font-regular text-[18px]"
        />
    </View>

    {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
    {error && <Text className="text-red-500 mt-2">주소 검색 오류</Text>}

    {addressList.length > 0 && (
        <FlatList className='ml-[24px] mr-[24px] mt-[38px]'
        data={addressList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity
            className="py-3 border-[#4D91FF] border-b-[0.5px]"
            onPress={() => handleSelectAddress(item.roadAddr)}
            >
            <Text className="text-[18px]">{item.roadAddr}</Text>
            </TouchableOpacity>
        )}
        />
    )}
    </SafeAreaView>
);
};

export default DestInputPage;