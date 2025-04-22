import { create } from "zustand";


type WakeUpTimeStore = {
    wakeUpTime : Date;
    setWakeUpTime : (data : Date) => void;
};

export const useWakeUpTimeStore = create<WakeUpTimeStore>((set) => ({
    wakeUpTime : new Date(),
    setWakeUpTime: (date: Date) => set({ wakeUpTime: date })
}));