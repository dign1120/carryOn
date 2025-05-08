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