import { ChangeEvent, useEffect } from "react";
import { IContactItem, useAppStore } from "../helpers/store";
import { useNavigate } from "react-router-dom";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";

export const ContactsList = () => {
  const { setContacts, contacts, isOn, setActiveContact } = useAppStore();
  const navigate = useNavigate();

  const deleteContact = async (item: IContactItem) => {
    if (confirm(`Вы действительно хотите удалить контакт ${item.name}`)) {
      try {
        let contactToDeleteId = undefined;
        let defaultContact = undefined;
        const newContacts = contacts.filter((i) => {
          if (i.id === item.id) contactToDeleteId = i.id;

          return i.id !== item.id;
        });
        let updatedInfo: {
          SHIFRONIM_CONTACTS: IContactItem[];
          SHIFRONIM_ACTIVE_CONTACT?: IContactItem;
        } = { SHIFRONIM_CONTACTS: newContacts };

        // Если человек удалил активный контакт - ставим дефолтный
        if (contactToDeleteId) {
          defaultContact = contacts.find((item) => item.isDefault);

          if (defaultContact) {
            updatedInfo = {
              ...updatedInfo,
              SHIFRONIM_ACTIVE_CONTACT: defaultContact,
            };
          }
        }

        await chrome.storage.local.set(updatedInfo);

        setContacts(newContacts);
        defaultContact && setActiveContact(defaultContact);
      } catch (e) {
        console.log("Error in deleteContact");
        console.log(e.message);
        toast.error("Произошла ошибка");
      }
    }
  };

  const contactsExport = async () => {
    const res = await chrome.storage.local.get(["SHIFRONIM_CONTACTS"]);

    if (res.SHIFRONIM_CONTACTS) {
      const content = JSON.stringify(res.SHIFRONIM_CONTACTS);
      const a = document.createElement("a");
      const file = new Blob([content], { type: "application/json" });
      a.href = URL.createObjectURL(file);
      a.download = "contacts.json";
      a.click();
    }
  };

  const contactsImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = e.target?.files?.[0];
    if (!file) return;

    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const json: IContactItem[] = JSON.parse(
            event.target.result as string
          );
          const defaultContact = json.find((item) => item.isDefault);

          await chrome.storage.local.set({
            SHIFRONIM_CONTACTS: json,
            SHIFRONIM_ACTIVE_CONTACT: defaultContact,
          });

          setContacts(json);

          if (defaultContact) {
            setActiveContact(defaultContact);
          }
        } catch (e) {
          console.log(e.message);
          toast.error("Что-то пошло не так...");
        }

        toast.success("Контакты успешно импортированы");
      }
    };

    reader.readAsText(file);
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
      <div className="page-title-with-back-btn">
        <h2>
          <button onClick={() => navigate("/")}>
            <CustomIcon icon="arrowLeft" />
          </button>
          Список контактов
        </h2>
        <div className="contacts-list-header-btns">
          <label htmlFor="contact-import" className="button download-btn">
            <CustomIcon icon="import" />
          </label>
          <input
            disabled={isOn}
            onChange={contactsImport}
            className="contact-import-input"
            type="file"
            multiple={false}
            accept="application/json"
            id="contact-import"
          />
          <button onClick={contactsExport} className="download-btn">
            <CustomIcon icon="download" />
          </button>
        </div>
      </div>
      <div className="contacts-list">
        {!contacts.length && <h2>Здесь еще нет контактов</h2>}
        {!!contacts?.length &&
          contacts.map((item) => {
            return (
              <div className="contacts-list-item">
                <span>{item.name}</span>
                <div className="contacts-list-item-btns">
                  <Tooltip id="delete-item-btn" place="top" />
                  <Tooltip id="edit-item-btn" place="top" />
                  <Tooltip id="copy-contact" place="top" />

                  <button
                    disabled={isOn}
                    onClick={() => navigate(`/contacts/edit/${item.id}`)}
                    data-tooltip-id="edit-item-btn"
                    data-tooltip-content="Редактировать контакт"
                  >
                    <CustomIcon icon="edit" />
                  </button>
                  <button
                    disabled={isOn}
                    data-tooltip-id="copy-contact"
                    data-tooltip-content="Скопировать публичный ключ"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(item.publicKey);
                        toast.success("Публичный ключ успешно скопирован");
                      } catch (e) {
                        console.log(e);
                        toast.error("Что-то пошло не так...");
                      }
                    }}
                  >
                    <CustomIcon icon="key" />
                  </button>
                  {!item.isDefault && (
                    <button
                      data-tooltip-id="delete-item-btn"
                      data-tooltip-content="Удалить контакт"
                      disabled={isOn}
                      className="contacts-list-item-delete-btn"
                      onClick={() => deleteContact(item)}
                    >
                      <CustomIcon icon="trash" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
