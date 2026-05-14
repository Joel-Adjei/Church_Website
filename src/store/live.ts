import { create } from "zustand";
import type { LiveStatus } from "@/types";

type actions = {
  setLiveStatus: (status: LiveStatus) => void;
};

export const useLiveStore = create<LiveStatus & actions>((set) => ({
  isLive: false,
  streamUrl: "",
  nextService: "",
  stream: null,
  setLiveStatus: (status) => set(status),
}));
