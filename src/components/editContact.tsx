import { useNavigate, useParams } from "react-router-dom";
import { CustomIcon } from "./customIcon";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { initialFormState } from "./createContact";
import { IContactItem, useAppStore } from "../helpers/store";
import { toast } from "sonner";

export const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, setContacts, setActiveContact, activeContact } =
    useAppStore();
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    let activeContactToUpdate = undefined;
    const newContacts = contacts.map((item) => {
      if (item.id === formState.id) {
        const newItem = { ...item, ...formState };
        if (activeContact.id === formState.id) {
          activeContactToUpdate = newItem;
        }

        return newItem;
      }
      return item;
    });
    const objectToUpdate = {
      SHIFRONIM_CONTACTS: newContacts,
      ...(activeContactToUpdate
        ? { SHIFRONIM_ACTIVE_CONTACT: activeContactToUpdate }
        : {}),
    };
    await chrome.storage.local.set(objectToUpdate);

    setContacts(newContacts);
    activeContactToUpdate && setActiveContact(activeContactToUpdate);
    toast.success("Контакт успешно обновлен");
    navigate(-1);
  };

  useEffect(() => {
    const getContact = async () => {
      const res = await chrome.storage.local.get([
        "SHIFRONIM_CONTACTS",
        "SHIFRONIM_ACTIVE_CONTACT",
      ]);

      if (res.SHIFRONIM_CONTACTS) {
        const foundContact = res.SHIFRONIM_CONTACTS.find(
          (item: IContactItem) => item.id === id
        );
        setContacts(res.SHIFRONIM_CONTACTS);
        setFormState(foundContact);
        if (res.SHIFRONIM_ACTIVE_CONTACT)
          setActiveContact(res.SHIFRONIM_ACTIVE_CONTACT);
      }
    };

    getContact();
  }, [id, setActiveContact, setContacts]);

  if (!id) return null;

  return (
    <>
      <div className="page-title-with-back-btn">
        <h2>
          <button onClick={() => navigate(-1)}>
            <CustomIcon icon="arrowLeft" />
          </button>
          Редактирование контакта
        </h2>
      </div>
      <form onSubmit={handleEdit} className="create-contacts">
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
        <button type="submit">Редактировать</button>
      </form>
    </>
  );
};
