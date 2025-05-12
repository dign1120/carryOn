import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Text, TouchableWithoutFeedback} from 'react-native';
import { WebView } from 'react-native-webview';
import { REACT_APP_KAKAO_MAP_JAVASCRIPT_API_KEY, REACT_APP_KAKAO_MAP_REST_API_KEY, REACT_APP_UTIC_OPEN_API_KEY } from '@env';
import { useLocationStore } from '../../stores/locationStore';
import { CctvItem, NearestCctvDto } from '../../types/cctv';
import Icon from 'react-native-vector-icons/Ionicons';

type KakaoMapProps = {
    cctvList?: CctvItem[];
    nearestCctvList?: NearestCctvDto[];
};

export default function KakaoMap({ cctvList = [], nearestCctvList = []}: KakaoMapProps) {
    const {sourceAddress, destAddress, routeCoordinates, setSourceAddress, setDestAddress} = useLocationStore();
    const [selectedCctv, setSelectedCctv] = useState<CctvItem | null>(null);
    const [selectedNearestCctv, setSelectedNearestCctv] = useState<NearestCctvDto | null>(null);
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${REACT_APP_KAKAO_MAP_JAVASCRIPT_API_KEY}&libraries=services"></script>
        <style>
        body { margin: 0; padding: 0; height: 100%; }
        html { height: 100%; }
        #map { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
        window.onload = function() {
            function sendToReactNative(data) {
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }

            if (typeof kakao !== 'undefined' && kakao.maps) {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3
                };
                var map = new kakao.maps.Map(mapContainer, mapOption);

                sendToReactNative('Kakao Map API Loaded');

                const addresses = [
                    { label: '출발', query: "${sourceAddress?.address}" },
                    { label: '도착', query: "${destAddress?.address}" }
                ];

                var bounds = new kakao.maps.LatLngBounds();

                addresses.forEach(({ label, query }) => {
                    fetch('https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURIComponent(query), {
                        headers: {
                            Authorization: 'KakaoAK ${REACT_APP_KAKAO_MAP_REST_API_KEY}'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.documents && data.documents.length > 0) {
                            const result = data.documents[0];
                            const coords = new kakao.maps.LatLng(result.y, result.x);

                            const marker = new kakao.maps.Marker({
                                map: map,
                                position: coords
                            });

                            const infowindow = new kakao.maps.InfoWindow({
                                content: '<div style="width:150px;text-align:center;padding:6px 0;">' + label + '</div>'
                            });
                            infowindow.open(map, marker);

                            bounds.extend(coords); // 좌표 범위 확장

                            sendToReactNative({
                                type: label,
                                address: result.address_name,
                                latitude: parseFloat(result.y),
                                longitude: parseFloat(result.x)
                            });

                            // 두 마커가 다 찍힌 이후에 지도 bounds 조정
                            if (label === '도착') {
                                setTimeout(() => {
                                    drawRoute(${JSON.stringify(routeCoordinates)});
                                    map.setBounds(bounds);
                                }, 300); // fetch가 비동기라 도착쯤에 호출 (보장되진 않지만 간단)
                            }
                        } else {
                            sendToReactNative(label + ' 주소 검색 결과 없음');
                        }
                    })
                    .catch(error => {
                        sendToReactNative(label + ' 주소 검색 실패: ' + error.message);
                    });
                });

                function drawRoute(routeCoords) {
                    // routeCoords는 이미 배열 형태로 전달됨
                    const positions = routeCoords.map(coord => new kakao.maps.LatLng(coord.latitude, coord.longitude));
                    var polyline = new kakao.maps.Polyline({
                        path: positions, // 경로 좌표
                        strokeWeight: 5,  // 선의 두께
                        strokeColor: '#4D91FF',  // 선의 색상
                        strokeOpacity: 1,  // 선의 불투명도
                        strokeStyle: 'solid'  // 선의 스타일
                    });

                    polyline.setMap(map); // 지도에 경로 그리기
                }

                // CCTV 마커 표시
                const cctvList = ${JSON.stringify(cctvList)};
                if (Array.isArray(cctvList)) {
                    const imageSrc = 'https://raw.githubusercontent.com/dign1120/carryOn_app/main/src/assets/icons/cctv-icon.png';
                    const imageSize = new kakao.maps.Size(35, 35); // 마커 이미지 크기
                    const imageOption = { offset: new kakao.maps.Point(35, 35) }; // 이미지 내 기준점

                    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); // 마커 이미지 객체

                    cctvList.forEach(cctv => {
                        const position = new kakao.maps.LatLng(cctv.coordy, cctv.coordx); // CCTV 위치

                        const marker = new kakao.maps.Marker({
                            map: map,
                            position: position,
                            image: markerImage // 이미지 마커 적용
                        });

                        // 클릭 이벤트 추가
                        marker.addListener('click', function() {
                            sendToReactNative({
                                type: 'CCTV Clicked',
                                cctv
                            });
                        });
                    });
                }


                const nearestCctvList = ${JSON.stringify(nearestCctvList)};
                if (Array.isArray(nearestCctvList)) {
                    const imageSrc = 'https://raw.githubusercontent.com/dign1120/carryOn_app/main/src/assets/icons/cctv-icon.png';
                    const imageSize = new kakao.maps.Size(35, 35); // 마커 이미지 크기
                    const imageOption = { offset: new kakao.maps.Point(35, 35) }; // 이미지 내 기준점

                    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); // 마커 이미지 객체

                    nearestCctvList.forEach(cctv => {
                        const position = new kakao.maps.LatLng(cctv.YCOORD, cctv.XCOORD); // CCTV 위치

                        const marker = new kakao.maps.Marker({
                            map: map,
                            position: position,
                            image: markerImage // 이미지 마커 적용
                        });

                        // 클릭 이벤트 추가
                        marker.addListener('click', function() {
                            sendToReactNative({
                                type: 'NEAREST CCTV Clicked',
                                cctv
                            });
                        });
                    });
                }
            }
        };
        </script>
    </body>
    </html>
    `;

        const handleMessage = (event: any) => {
            try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === '출발') {
                    setSourceAddress({
                    ...sourceAddress!,
                    coordinates: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    }
                    });
                } else if (data.type === '도착') {
                    setDestAddress({
                    ...destAddress!,
                    coordinates: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    }
                    });
            } else if (data.type === 'CCTV Clicked') {
                setSelectedCctv(data.cctv);
            } else if (data.type === 'NEAREST CCTV Clicked') {
                setSelectedNearestCctv(data.cctv);
            }
            } catch (err) {
                console.error('Failed to parse message from WebView:', err);
            }
        };

return (
    <View className='flex-1'>
    <WebView
        className='flex-1'
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => console.log('WebView loaded successfully')}
        onError={(e) => console.error('WebView error: ', e.nativeEvent)}
        injectedJavaScript={`(function() {
        window.console.log = function(message) {
            window.ReactNativeWebView.postMessage(message);
        }
        })();`}
        onMessage={handleMessage}
    />

    {/* 모달창 */}
    <Modal
            transparent={true}
            visible={selectedCctv !== null}
            animationType="fade"
            onRequestClose={() => setSelectedCctv(null)}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-1 rounded-lg w-full">
                    {selectedCctv && (
                        <View>
                            <View className="flex-row items-center mb-1 px-2">
                                <TouchableOpacity onPress={() => setSelectedCctv(null)}>
                                    <Icon name="chevron-back" size={24} color="#000" />
                                </TouchableOpacity>

                                <Text className="flex-1 text-center text-base text-gray-800 mr-[24px]">
                                    {selectedCctv.cctvname}
                                </Text>
                            </View>
                            <WebView
                                    source={{uri: selectedCctv.cctvurl}} // 스트리밍 URL
                                    style={{ width: '100%', height: 500 }}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    allowsInlineMediaPlayback={true}
                                    mediaPlaybackRequiresUserAction={false}
                                    onError={(e) => console.error("비디오 스트리밍 에러:", e)}
                                    onLoad={(e) => console.log("비디오 로드됨:", e)}
                            />
                        </View>
                    )}
                    
                </View>
            </View>
    </Modal>

    {/* nearest cctv 모달 */}
    <Modal
    transparent={true}
    visible={selectedNearestCctv !== null}
    animationType="fade"
    onRequestClose={() => setSelectedNearestCctv(null)}
    >
        <TouchableWithoutFeedback onPress={() => setSelectedNearestCctv(null)}>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-1 rounded-lg w-full">
                {selectedNearestCctv && (
                    <View>
                    {/* 상단 헤더 */}
                    <View className="flex-row items-center mb-1 px-2">
                        <TouchableOpacity onPress={() => setSelectedNearestCctv(null)}>
                        <Icon name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>

                        <Text className="flex-1 text-center text-base text-gray-800 mr-[24px]">
                        {selectedNearestCctv.CCTVNAME}
                        </Text>
                    </View>

                    {/* WebView (영상) */}
                    <WebView
                        source={{
                        uri: `http://www.utic.go.kr/jsp/map/openDataCctvStream.jsp?key=${REACT_APP_UTIC_OPEN_API_KEY}&cctvid=${selectedNearestCctv.CCTVID}&cctvname=${encodeURIComponent(selectedNearestCctv.CCTVNAME)}&kind=${selectedNearestCctv.KIND}&id=${selectedNearestCctv.ID}&cctvip=${selectedNearestCctv.CCTVIP}&cctvch=${selectedNearestCctv.CH}`,
                        }}
                        originWhitelist={['*']}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        style={{ width: '100%', height: 500 }}
                        onLoad={() => console.log("CCTV 웹뷰 로드 완료")}
                        onError={(e) => console.error("웹뷰 로드 에러:", e.nativeEvent)}
                        injectedJavaScript={`(function() {
                            // CCTV 비디오 확대 기능
                            const cctvVideo = document.querySelector('video');

                            if (cctvVideo) {
                                cctvVideo.style.position = 'absolute';
                                cctvVideo.style.top = '50%';
                                cctvVideo.style.left = '50%';
                                cctvVideo.style.transform = 'translate(-50%, -50%) scale(3)';
                                cctvVideo.style.transformOrigin = 'center';
                            }
                        })();`}
                    />
                    </View>
                )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>

    </View>
);
}