import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const Join = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [emailSuccess, setEmailSuccess] = useState('');
    const [nicknameSuccess, setNicknameSuccess] = useState('');

    const validateEmail = async () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
        setEmailError('이메일이 형식에 맞지 않습니다.');
        setEmailSuccess('');
        return;
        }

        try {
            const res = await axios.post('http://127.0.0.1:8080/api/exist-email', null, {
                params : {email}
            });
            if (res.data.exists) {
                setEmailError('이미 가입된 이메일이 존재합니다.');
                setEmailSuccess('');
            } else {
                setEmailError('');
                setEmailSuccess('사용 가능한 이메일입니다.');
            }
        } catch {
        setEmailError('이메일 확인 중 오류가 발생했습니다.');
        setEmailSuccess('');
        }
    };

    const validateNickname = async () => {
        if (nickname.length > 15) {
        setNicknameError('닉네임은 최대 15자리까지 가능합니다.');
        setNicknameSuccess('');
        return;
        }

        try {
        const res = await axios.post('http://127.0.0.1:8080/api/exist-nickname', null,{
            params : {nickname}
        });
        if (res.data.exists) {
            setNicknameError('이미 가입된 닉네임이 존재합니다.');
            setNicknameSuccess('');
        } else {
            setNicknameError('');
            setNicknameSuccess('사용 가능한 닉네임입니다.');
        }
        } catch {
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
        setNicknameSuccess('');
        }
    };

    const validatePasswords = () => {
        if (password !== confirmPassword) {
        setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
        setConfirmPasswordError('');
        }

        if (!password) {
        setPasswordError('비밀번호를 입력해주세요.');
        } else {
        setPasswordError('');
        }
    };

    const getBorderColor = (error: string, success: string) => {
        if (error) return 'border-red-500';
        if (success) return 'border-green-500';
        return 'border-[#3B82F6]';
    };

    // 유효성 검사 통과 여부
    const isFormValid =
        emailSuccess !== '' &&
        nicknameSuccess !== '' &&
        password &&
        confirmPassword &&
        password === confirmPassword &&
        !passwordError &&
        !confirmPasswordError;

    return (
        <SafeAreaView className="bg-white h-full">
            <TouchableOpacity 
                className='ml-5'
                onPress={() => navigation.navigate("Login")}>
                <Icon name="chevron-back" size={30} color="#000" />
            </TouchableOpacity>
            <View className="items-center mb-8">
                <Image
                    source={require('./../../assets/images/vertical-main-logo.png')}
                    style={{ width: 160, height: 210, resizeMode: 'contain' }}
                />
            </View>
            <View className="items-center">
                {/* 이메일 */}
                <TextInput
                className={`w-[334px] h-[52px] text-[20px] border-b ${getBorderColor(emailError, emailSuccess)}`}
                placeholder="이메일을 입력하세요"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                    setEmailSuccess('');
                }}
                onBlur={validateEmail}
                />
                {emailError ? (
                <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
                ) : emailSuccess ? (
                <Text className="text-green-500 text-sm mt-1">{emailSuccess}</Text>
                ) : null}

                {/* 닉네임 */}
                <TextInput
                className={`w-[334px] h-[52px] text-[20px] border-b mt-[26px] ${getBorderColor(nicknameError, nicknameSuccess)}`}
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChangeText={(text) => {
                    setNickname(text);
                    setNicknameError('');
                    setNicknameSuccess('');
                }}
                onBlur={validateNickname}
                />
                {nicknameError ? (
                <Text className="text-red-500 text-sm mt-1">{nicknameError}</Text>
                ) : nicknameSuccess ? (
                <Text className="text-green-500 text-sm mt-1">{nicknameSuccess}</Text>
                ) : null}

                {/* 비밀번호 */}
                <TextInput
                className={`w-[334px] h-[52px] text-[20px] border-b mt-[26px] ${getBorderColor(passwordError, '')}`}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                }}
                onBlur={validatePasswords}
                />
                {passwordError ? (
                <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
                ) : null}

                {/* 비밀번호 확인 */}
                <TextInput
                className={`w-[334px] h-[52px] text-[20px] border-b mt-[26px] ${getBorderColor(confirmPasswordError, '')}`}
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError('');
                }}
                onBlur={validatePasswords}
                />
                {confirmPasswordError ? (
                <Text className="text-red-500 text-sm mt-1">{confirmPasswordError}</Text>
                ) : null}

                {/* 회원가입 버튼 */}
            <TouchableOpacity
                className="mt-[52px]"
                onPress={async () => {
                    if (!isFormValid) return;
                    // 서버로 회원가입 요청 보내기
                    try {
                    await axios.post('http://127.0.0.1:8080/api/join', {
                        email,
                        nickname,
                        password,
                    });
                    navigation.navigate('Login');
                    } catch (error) {
                    console.error('회원가입 실패', error);
                    }
                }}
                disabled={!isFormValid}
                >
                <View
                    className={`w-[334px] h-[52px] rounded-md justify-center ${
                    isFormValid ? 'bg-[#3B82F6]' : 'bg-gray-400'
                    }`}
                >
                    <Text className="text-white font-semibold text-[20px] text-center">
                    회원가입
                    </Text>
                </View>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Join;
