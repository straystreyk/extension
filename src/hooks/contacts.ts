import { IContactItem, useAppStore } from "../helpers/store";
import { v4 } from "uuid";
import { toast } from "sonner";

export const useCreateContact = () => {
  const { setContacts } = useAppStore();

  const handleCreate = async (
    name: string,
    secretWord: string,
    prefix: string
  ) => {
    if (!name) return;

    try {
      let contacts = [];
      const res = await chrome.storage.local.get(["SHIFRONIM_CONTACTS"]);
      if (res.SHIFRONIM_CONTACTS) contacts = res.SHIFRONIM_CONTACTS;
      const id = v4();
      const newContacts: IContactItem[] = [
        ...contacts,
        {
          id,
          name,
          secretWord: secretWord || "",
          prefix,
        },
      ];

      await chrome.storage.local.set({ SHIFRONIM_CONTACTS: newContacts });
      setContacts(newContacts);

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
