import { create } from "zustand";

export interface IContactItem {
  id: string;
  name: string;
  secretWord: string;
  isDefault?: boolean;
}

interface Store {
  isOn: boolean;
  isWizardActive: boolean;
  contacts: IContactItem[];
  activeContact: IContactItem;
  setContacts: (newContacts: IContactItem[]) => void;
  setActiveContact: (activeContact: IContactItem) => void;
  setIsOn: (isOn: boolean) => void;
  setIsWizardActive: (isWizardActive: boolean) => void;
}

export const useAppStore = create<Store>((set) => ({
  isOn: false,
  isWizardActive: false,
  contacts: [],
  activeContact: { id: "", name: "", secretWord: "" },

  setIsOn: (isOn) => set(() => ({ isOn })),
  setIsWizardActive: (isWizardActive) => set(() => ({ isWizardActive })),
  setContacts: (contacts) => set(() => ({ contacts })),
  setActiveContact: (activeContact) => set(() => ({ activeContact })),
}));
