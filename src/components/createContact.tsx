import { useNavigate } from "react-router-dom";
import { useAppStore } from "../helpers/store";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const initialFormState = { name: "", publicKey: "" };

export const CreateContact = () => {
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
      const newContacts = [
        ...contacts,
        {
          name: formState.name,
          publicKey: formState.publicKey,
          isActive: false,
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
      <h2>Создание контакта</h2>
      <form onSubmit={handleCreate} className="create-contacts">
        <input
          name="name"
          value={formState.name}
          required
          placeholder="Имя контакта"
          onChange={handleChange}
        />
        <input
          name="publicKey"
          value={formState.publicKey}
          required
          placeholder="Публичный ключ контакта"
          onChange={handleChange}
        />
        <button type="submit">Создать</button>
        <button onClick={() => navigate("/")} type="button">
          Назад
        </button>
      </form>
    </>
  );
};
