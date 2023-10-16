import { create } from "zustand";

export interface IContactItem {
  name: string;
  publicKey: string;
  secretWord: string;
  isActive?: boolean;
}

interface Store {
  isOn: boolean;
  contacts: IContactItem[];
  setContacts: (newContacts: IContactItem[]) => void;
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
