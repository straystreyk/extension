import { create } from "zustand";

export interface IContactItem {
  id: string;
  name: string;
  publicKey: string;
  secretWord: string;
  isDefault?: boolean;
}

interface Store {
  isOn: boolean;
  contacts: IContactItem[];
  activeContact: IContactItem;
  setContacts: (newContacts: IContactItem[]) => void;
  setActiveContact: (activeContact: IContactItem) => void;
  setIsOn: (isOn: boolean) => void;
}

export const useAppStore = create<Store>((set) => ({
  isOn: false,
  contacts: [],
  activeContact: { id: "", name: "", secretWord: "", publicKey: "" },

  setIsOn: (isOn) => set(() => ({ isOn })),
  setContacts: (contacts) => set(() => ({ contacts })),
  setActiveContact: (activeContact) => set(() => ({ activeContact })),
}));
