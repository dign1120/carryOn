import React from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import { REACT_APP_KAKAO_MAP_JAVASCRIPT_API_KEY, REACT_APP_KAKAO_MAP_REST_API_KEY } from '@env';
import { useLocationStore } from '../../stores/locationStore';

export default function KakaoMap() {
    const {sourceAddress, destAddress} = useLocationStore();

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
            function sendToReactNative(message) {
                window.ReactNativeWebView.postMessage(message);
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

                            sendToReactNative(label + ' 위치: ' + result.address_name);

                            // 두 마커가 다 찍힌 이후에 지도 bounds 조정
                            if (label === '도착') {
                                setTimeout(() => {
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
            }
        };
        </script>
    </body>
    </html>
    `;

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
        onMessage={(event) => console.log(event.nativeEvent.data)}
    />
    </View>
);
}