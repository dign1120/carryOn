import { create } from "zustand";

type Coordinates = {
    latitude : number;
    longitude : number;
}

type Address = {
    searchText : string;
    address : string | null;
    coordinates?: Coordinates | null;
}

type LocationStore = {
    sourceAddress : Address | null;
    destAddress : Address | null;
    routeCoordinates: Coordinates[];
    setSourceAddress : (data : Address) => void;
    setDestAddress : (data : Address) => void;
    setRouteCoordinates: (coords: Coordinates[]) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
    sourceAddress : {
        searchText : "출발지를 입력하세요",
        address : null
    },
    destAddress : {
        searchText : "도착지를 입력하세요",
        address : null
    },
    routeCoordinates: [],
    setSourceAddress: (data) => set({ sourceAddress : data}),
    setDestAddress : (data) => set({ destAddress : data}),
    setRouteCoordinates: (coords) => set({ routeCoordinates: coords })
}));