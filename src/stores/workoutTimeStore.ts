import { create } from "zustand";


type workoutTimeStore = {
    workoutTime : Date;
    setWorkoutTime : (data : Date) => void;
};

export const useworkoutTimeStore = create<workoutTimeStore>((set) => ({
    workoutTime : new Date(),
    setWorkoutTime: (date: Date) => set({ workoutTime: date })
}));
