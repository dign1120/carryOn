import React from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import { REACT_APP_KAKAO_MAP_API_KEY } from '@env';

type KakaoMapProps = {
    latitude: number;
    longitude: number;
};

export default function KakaoMap({ latitude, longitude }: KakaoMapProps) {
const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${REACT_APP_KAKAO_MAP_API_KEY}&libraries=services"></script>
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
            console.log('Kakao Map API Loaded');
            if (typeof kakao !== 'undefined' && kakao.maps) {
            console.log('Kakao Maps is available');
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);

            // 마커 추가 (선택 사항)
            const markerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
            const marker = new kakao.maps.Marker({
                position: markerPosition
            });
            marker.setMap(map);
            } else {
            console.error('Kakao Maps is not available');
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