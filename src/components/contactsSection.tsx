import { CustomSelect, ISelectItem } from "./customSelect";
import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from "react";
import { CustomIcon } from "./customIcon";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../helpers/store";

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
        { name: formState.name, publicKey: formState.publicKey },
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
          Вернуться
        </button>
      </form>
    </>
  );
};

export const ContactsSection = () => {
  const navigate = useNavigate();
  const { contacts, setContacts } = useAppStore();
  const [value, setValue] = useState<ISelectItem>({ name: "", value: "" });

  const items: ISelectItem[] = useMemo(
    () => contacts.map((item) => ({ name: item.name, value: item.publicKey })),
    [contacts]
  );

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await chrome.storage.local.get(["SHIFRONIM_CONTACTS"]);

        if (res?.SHIFRONIM_CONTACTS?.length)
          setContacts(res.SHIFRONIM_CONTACTS);
      } catch (e) {
        toast.error("Ошибка при загрузке контактов");
      }
    };

    getContacts();
  }, [setContacts]);

  return (
    <div className="contacts">
      <CustomSelect
        placeholder="Выберите из списка или создайте новый контакт"
        value={value}
        onChange={(itme) => setValue(itme)}
        items={items}
      />
      <button
        data-tooltip-content="Создать контакт"
        data-tooltip-id="create-contact"
        onClick={() => navigate("/contacts")}
      >
        <CustomIcon icon="newContact" />
        <Tooltip id="create-contact" place="bottom" />
      </button>
      <button
        data-tooltip-content="Экспортировать контакты"
        data-tooltip-id="export-contacts"
      >
        <CustomIcon icon="download" />
        <Tooltip id="export-contacts" place="bottom" />
      </button>
    </div>
  );
};
