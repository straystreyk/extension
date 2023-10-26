import { useNavigate } from "react-router-dom";
import { IContactItem, useAppStore } from "../helpers/store";
import { ChangeEvent, FormEvent, memo, useState } from "react";
import { toast } from "sonner";
import { CustomIcon } from "./customIcon";
import { v4 } from "uuid";

export const initialFormState = {
  id: "",
  name: "",
  publicKey: "",
  secretWord: "",
};

export const CreateContact = memo(() => {
  const navigate = useNavigate();
  const { setContacts } = useAppStore();
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.name || !formState.publicKey) return;

    try {
      let contacts = [];
      const res = await chrome.storage.local.get(["SHIFRONIM_CONTACTS"]);
      if (res.SHIFRONIM_CONTACTS) contacts = res.SHIFRONIM_CONTACTS;
      const newContacts: IContactItem[] = [
        ...contacts,
        {
          id: v4(),
          name: formState.name,
          publicKey: formState.publicKey,
          secretWord: formState.secretWord || "",
        },
      ];

      await chrome.storage.local.set({ SHIFRONIM_CONTACTS: newContacts });
      setContacts(newContacts);
      setFormState(initialFormState);
      toast.success("Новый контакт успешно создан");
    } catch (e) {
      console.log(e.message);
      toast.error("Произошла ошибка");
    }
  };

  return (
    <>
      <div className="page-title-with-back-btn">
        <h2>
          <button onClick={() => navigate(-1)}>
            <CustomIcon icon="arrowLeft" />
          </button>
          Создание контакта
        </h2>
      </div>
      <form onSubmit={handleCreate} className="create-contacts">
        <div className="label-input-wrapper">
          <label>Имя контакта</label>
          <input
            name="name"
            value={formState.name}
            required
            placeholder="Имя контакта"
            onChange={handleChange}
          />
        </div>
        <div className="label-input-wrapper">
          <label>Публичный ключ контакта</label>
          <input
            name="publicKey"
            value={formState.publicKey}
            required
            placeholder="Публичный ключ контакта"
            onChange={handleChange}
          />
        </div>
        <div className="label-input-wrapper">
          <label>Секретное слово для шифрования</label>
          <input
            name="secretWord"
            value={formState.secretWord}
            required
            placeholder="Секретное слово для шифрования"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Создать</button>
      </form>
    </>
  );
});
