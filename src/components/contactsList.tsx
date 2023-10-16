import { useEffect } from "react";
import { IContactItem, useAppStore } from "../helpers/store";
import { useNavigate } from "react-router-dom";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";

export const ContactsList = () => {
  const { setContacts, contacts } = useAppStore();
  const navigate = useNavigate();

  const deleteContact = async (item: IContactItem) => {
    if (confirm(`Вы действительно хотите удалить контакт ${item.name}`)) {
      try {
        const newContacts = contacts.filter(
          (i) => i.publicKey !== item.publicKey
        );
        await chrome.storage.local.set({ SHIFRONIM_CONTACTS: newContacts });

        setContacts(newContacts);
      } catch (e) {
        console.log("Error in deleteContact");
        console.log(e.message);
        toast.error("Произошла ошибка");
      }
    }
  };

  useEffect(() => {
    const getContacts = async () => {
      const res = await chrome.storage.local.get(["SHIFRONIM_CONTACTS"]);

      if (res?.SHIFRONIM_CONTACTS?.length) setContacts(res.SHIFRONIM_CONTACTS);
    };

    getContacts();
  }, [setContacts]);

  return (
    <section className="contacts-list-section">
      <h2>
        <button onClick={() => navigate("/")}>
          <CustomIcon icon="arrowLeft" />
        </button>
        Список контактов
      </h2>
      <div className="contacts-list">
        {!contacts.length && <h2>Здесь еще нет контактов</h2>}
        {!!contacts?.length &&
          contacts.map((item) => {
            return (
              <div className="contacts-list-item">
                <span>{item.name}</span>
                <div className="contacts-list-item-btns">
                  <button
                    onClick={() => navigate(`/contacts/edit/${item.publicKey}`)}
                  >
                    <CustomIcon icon="edit" />
                  </button>
                  <button
                    className="contacts-list-item-delete-btn"
                    onClick={() => deleteContact(item)}
                  >
                    <CustomIcon icon="trash" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
