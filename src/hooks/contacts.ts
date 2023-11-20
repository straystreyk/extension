import { IContactItem, useAppStore } from "../helpers/store";
import { v4 } from "uuid";
import { toast } from "sonner";

export const useCreateContact = () => {
  const { setContacts, setActiveContact, isOn } = useAppStore();

  const handleCreate = async (
    name: string,
    secretWord: string,
    prefix: string
  ) => {
    if (!name || isOn) return;

    try {
      let contacts = [];
      const res = await chrome.storage.local.get(["SHIFRONIM_CONTACTS"]);
      if (res.SHIFRONIM_CONTACTS) contacts = res.SHIFRONIM_CONTACTS;
      const id = v4();
      const newContact = {
        id,
        name,
        secretWord: secretWord || "",
        prefix,
      };
      const newContacts: IContactItem[] = [...contacts, newContact];

      await chrome.storage.local.set({
        SHIFRONIM_CONTACTS: newContacts,
        SHIFRONIM_ACTIVE_CONTACT: newContact,
      });
      setContacts(newContacts);
      setActiveContact(newContact);

      toast.success("Новый контакт успешно создан");
      return id;
    } catch (e) {
      console.log(e.message);
      toast.error("Произошла ошибка");
    }
  };

  return {
    handleCreate,
  };
};
