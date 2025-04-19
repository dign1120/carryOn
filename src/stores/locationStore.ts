import { create } from "zustand";

type Address = {
    searchText : string;
    address : string;
}

type LocationStore = {
    sourceAddress : Address | null;
    destAddress : Address | null;
    setSourceAddress : (data : Address) => void;
    setDestAddress : (data : Address) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
    sourceAddress : {
        searchText : "출발지를 입력하세요",
        address : ""
    },
    destAddress : {
        searchText : "도착지를 입력하세요",
        address : ""
    },
    setSourceAddress: (data) => set({ sourceAddress : data}),
    setDestAddress : (data) => set({ destAddress : data})
}));