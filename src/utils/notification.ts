import PushNotification from "react-native-push-notification";

export const configurePushNotification = () => {
    PushNotification.configure({
        onRegister: function (token : any) {
            console.log('TOKEN:', token);
        },
        onNotification: function (notification :any) {
            console.log('NOTIFICATION:', notification);
        },
        requestPermissions: true,
    });

    PushNotification.createChannel(
        {
            channelId : "carryon-alert",
            channelName : "챙겨요 알람 체널",
            channelDescription : "챙겨요 알람을 받는 체널",
            soundName : 'default',
            importance : 4,
            vibrate : true
        },
    )
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
        repeatType : 'day'
    })
}