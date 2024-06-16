'use client'
import { StoreContext } from "@/store/context";
import { Experience, Participant, ScheduledExperience } from "@/types";
import axios from "axios";
import { useContext } from "react";
import useSWR from "swr";

interface InitialDataProviderProps {
    children: React.ReactNode;
}

export function InitialDataProvider({ children }: InitialDataProviderProps) {
    const [{ schedulerLoading }, setStore] = useContext(StoreContext);
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    useSWR('/api/participants', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 60000, // Re-fetch the data if it's older than 1 minute
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, participants: data, participantsLoading: false }));
        }
    });

    useSWR('/api/scheduled', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 60000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, scheduled: data, schedulerLoading: false }));
        }
    });

    useSWR('/api/experiences', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 60000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, experiences: data, experiencesLoading: false }));
        }
    });

    return <>{children}</>
}