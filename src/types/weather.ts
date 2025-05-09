type WeatherItem = {
    baseDate: string;
    baseTime: string;
    category: string;
    nx: number;
    ny: number;
    obsrValue: string;
};

export type WeatherResponse = {
response: {
    body: {
    items: {
        item : WeatherItem[]
    };
    };
};
};

export enum PTYCode {
    NONE = 0,
    RAIN = 1,
    RAIN_SNOW = 2,
    SNOW = 3,
    DRIZZLE = 5,
    DRIZZLE_SNOWFLAKE = 6,
    SNOWFLAKE = 7,
}

export function getPTYDescription(code: number): string {
    switch (code) {
        case PTYCode.NONE:
        return '맑음';
        case PTYCode.RAIN:
        return '비';
        case PTYCode.RAIN_SNOW:
        return '비와 눈';
        case PTYCode.SNOW:
        return '눈';
        case PTYCode.DRIZZLE:
        return '빗방울';
        case PTYCode.DRIZZLE_SNOWFLAKE:
        return '빗방울과 눈날림';
        case PTYCode.SNOWFLAKE:
        return '눈날림';
        default:
        return '알 수 없음';
    }
}

export type RainPercentageResponse = {
    id: {
        timestamp: number;
        date: string; // ISO 날짜 문자열
    };
    percentage: number;
    memberId: string;
};