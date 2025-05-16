import PushNotification from "react-native-push-notification";
import { Platform, PermissionsAndroid } from "react-native";

async function requestAndroidNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
            title: '알림 권한 요청',
            message: '알림을 받으려면 권한이 필요합니다.',
            buttonPositive: '허용',
        }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // 그 외는 권한 필요 없으니 true 반환
}

export const configurePushNotification = async () => {
    PushNotification.configure({
        onRegister: function (token: any) {
        console.log('TOKEN:', token);
        },
        onNotification: function (notification: any) {
        console.log('NOTIFICATION:', notification);
        },
        requestPermissions: Platform.OS === 'ios',  // iOS에서만 권한 요청
    });

    if (Platform.OS === 'android') {
        if(Platform.Version >=33){
            const hasPermission = await requestAndroidNotificationPermission();
            if (!hasPermission) {
            return; 
            }
        }

        PushNotification.createChannel({
            channelId: "carryon-alert",
            channelName: "챙겨요 알람 체널",
            channelDescription: "챙겨요 알람을 받는 체널",
            soundName: 'default',
            importance: 4,
            vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    }
};

export const scheduleLocalNotification = (date : Date) => {
    PushNotification.cancelAllLocalNotifications();

    const now = new Date();
    const adjustedTime = new Date(date.getTime() - 5 * 60 * 1000); // 5분 = 5 * 60 * 1000ms
    
    let alarmTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        adjustedTime.getHours(),
        adjustedTime.getMinutes(),
        0,
        0
    )

    if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    PushNotification.localNotificationSchedule({
        channelId: "carryon-alert",
        title : "챙겨요",
        message : "오늘은 우산을 챙겨야 할까요? 확인해보세요!",
        date : alarmTime,
        allowWhileIdle : true,
        repeatType : 'day',
        smallIcon : "ic_notification"
    })
}