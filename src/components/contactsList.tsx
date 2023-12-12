import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IContactItem, useAppStore } from "../helpers/store";
import { useNavigate } from "react-router-dom";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { importContacts } from "../helpers/common";

export const ContactsList = () => {
  const { setContacts, contacts, isOn, setActiveContact } = useAppStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredContacts = useMemo(
    () =>
      contacts.filter((item) =>
        item.name.toLowerCase().startsWith(search.toLowerCase())
      ),
    [search, contacts]
  );

  const deleteContact = async (item: IContactItem) => {
    if (confirm(`Вы действительно хотите удалить контакт ${item.name}?`)) {
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
      const content = JSON.stringify(res.SHIFRONIM_CONTACTS, null, 2);
      const a = document.createElement("a");
      const file = new Blob([content], { type: "application/json" });
      a.href = URL.createObjectURL(file);
      a.download = `contacts-${new Date(Date.now()).toLocaleDateString()}.json`;
      a.click();
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
      <div className="page-title-with-back-btn">
        <Tooltip id="contact-import-btn" />
        <Tooltip id="export-contact-btn" />
        <Tooltip id="delete-item-btn" place="top" />
        <Tooltip id="edit-item-btn" place="top" />
        <h2>
          <button onClick={() => navigate("/")}>
            <CustomIcon icon="arrowLeft" />
          </button>
          Список контактов
        </h2>
        <div className="contacts-list-header-btns">
          <label
            id="contact-import-btn"
            htmlFor="contact-import"
            className="button download-btn"
            data-tooltip-id="edit-item-btn"
            data-tooltip-content={
              isOn
                ? "Нельзя импортировать контакты пока расширение включено"
                : "Импортировать контакты"
            }
          >
            <CustomIcon icon="import" />
          </label>
          <input
            disabled={isOn}
            onChange={importContacts}
            className="contact-import-input"
            type="file"
            multiple={false}
            accept="application/json"
            id="contact-import"
          />
          <button
            id="export-contact-btn"
            onClick={contactsExport}
            className="download-btn"
            data-tooltip-content="Экспортировать контакты"
            data-tooltip-id="export-contact-btn"
          >
            <CustomIcon icon="download" />
          </button>
        </div>
      </div>
      <div className="contacts-list">
        {!contacts.length && <h2>Здесь еще нет контактов</h2>}
        {!!contacts?.length && (
          <>
            <input
              type="text"
              placeholder="Поиск контакта"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!filteredContacts.length && (
              <h2 style={{ textAlign: "center" }}>
                Контакт с таким именем не&nbsp;найден
              </h2>
            )}
            {filteredContacts.map((item) => {
              return (
                <div className="contacts-list-item">
                  <span>{item.name}</span>
                  <div className="contacts-list-item-btns">
                    <button
                      disabled={isOn}
                      onClick={() => navigate(`/contacts/edit/${item.id}`)}
                      data-tooltip-id="edit-item-btn"
                      data-tooltip-content={
                        isOn
                          ? "Нельзя редактировать контакт пока расширение включено"
                          : "Редактировать контакт"
                      }
                    >
                      <CustomIcon icon="edit" />
                    </button>
                    {!item.isDefault && (
                      <button
                        data-tooltip-id="delete-item-btn"
                        data-tooltip-content={
                          isOn
                            ? "Нельзя удалить контакт контакт пока расширение включено"
                            : "Удалить контакт"
                        }
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
          </>
        )}
      </div>
    </section>
  );
};
