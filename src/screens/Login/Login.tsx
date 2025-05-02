import React, {useState} from 'react';
import {View, Text, SafeAreaView, Image, TextInput, TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginProps = {
  navigation: any; // 필요하다면 any 대신 정확한 타입 사용
};

enum LoginError {
  InvalidCredentials = '아이디 또는 비밀번호를 확인해주세요.',
  ServerError = '로그인 중 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
}

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080/api/authenticate', {
        email,
        password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('jwt-token', token);
      navigation.navigate('Home');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          setErrorMessage(LoginError.InvalidCredentials);
        } else {
          setErrorMessage(LoginError.ServerError);
        }
      } else {
        setErrorMessage(LoginError.ServerError);
      }
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className='h-[355px] flex-1 items-center justify-center'>
        <Image source={require("./../../assets/images/vertical-main-logo.png")} 
          width={165} height={82}
        />
      </View>

      <View className='items-center'>
        <TextInput className="w-[334px] h-[52px] font-regular text-[20px] border-b border-[#3B82F6]" 
                    placeholder='이메일을 입력하세요'
                    value={email}
                    onChangeText={setEmail}            
        />
        
        <TextInput className="w-[334px] h-[52px] font-regular text-[20px] border-b border-[#3B82F6] mt-[52px]" 
                    placeholder='비밀번호를 입력하세요' 
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}  
        
        />

        {(errorMessage === LoginError.InvalidCredentials || 
          errorMessage === LoginError.ServerError
        ) && 
        (
          <Text className="text-[#ff0101] font-light text-[12px] mt-[21px] text-center">
            {errorMessage}
          </Text>
        )}

        <TouchableOpacity className='mt-[52px]' onPress={handleLogin}>
          <View className="w-[334px] h-[52px] bg-[#3B82F6] rounded-md justify-center">
            <Text className='text-white font-semibold text-[20px] text-center'>로그인</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className='mt-[54px] flex-row mb-[163px] justify-center'>
          <TouchableOpacity>
            <Text className='text-[#767676]'>회원가입</Text>
          </TouchableOpacity>
          <Text className='text-[#767676]'> | </Text>
          <TouchableOpacity>
            <Text className='text-[#767676]'>비밀번호 찾기</Text>
          </TouchableOpacity>
          
        </View>
    </SafeAreaView>
  );
};

export default Login;
