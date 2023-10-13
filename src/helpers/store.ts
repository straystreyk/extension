import { create } from "zustand";

interface Store {
  isOn: boolean;
  contacts: { name: string; publicKey: string; secretWord: string }[];
  setContacts: (
    newContacts: { name: string; publicKey: string; secretWord: string }[]
  ) => void;
  key: string;
  publicKeyValue: string;
  setIsOn: (isOn: boolean) => void;
  setKey: (key: string) => void;
  setPublicKeyValue: (publicKey: string) => void;
}

export const useAppStore = create<Store>((set) => ({
  isOn: false,
  key: "",
  publicKeyValue: "",
  contacts: [],

  setIsOn: (isOn) => set(() => ({ isOn })),
  setKey: (key) => set(() => ({ key })),
  setPublicKeyValue: (publicKeyValue) => set(() => ({ publicKeyValue })),
  setContacts: (contacts) => set(() => ({ contacts })),
}));
