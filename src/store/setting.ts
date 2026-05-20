import { Settings } from "@/types";
import { create } from "zustand";

interface Values {
  church_name: string;
  tagline: string;
  logo_url: string;
  banner_image_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  service_times: string[];
  social_links?: Record<string, string>;
  footer_note?: string;
}

interface Actions {
  setData: (data: Settings) => void;
}

const initialValues: Settings = {
  church_name: "",
  tagline: "",
  logo_url: "",
  banner_image_url: "",
  phone: "",
  email: "",
  address: "",
  service_times: [],
  social_links: {},
  footer_note: "",
  id: 0,
  updated_at: "",
};

export const useSiteSetting = create<Values & Actions>((set) => ({
  ...initialValues,
  setData: (data) => set(data),
}));
