import React from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import { REACT_APP_KAKAO_MAP_JAVASCRIPT_API_KEY, REACT_APP_KAKAO_MAP_REST_API_KEY } from '@env';
import { useLocationStore } from '../../stores/locationStore';
import { CctvItem } from '../../types/cctv';

type KakaoMapProps = {
    cctvList?: CctvItem[];
};

export default function KakaoMap({ cctvList = []}: KakaoMapProps) {
    const {sourceAddress, destAddress, routeCoordinates, setSourceAddress, setDestAddress} = useLocationStore();

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
                console.log('CCTV Clicked:', data.cctv);
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
    </View>
);
}