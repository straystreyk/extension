import { CustomSelect, ISelectItem } from "./customSelect";
import { useEffect, useMemo, useCallback } from "react";
import { CustomIcon } from "./customIcon";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../helpers/store";

export const ContactsSection = () => {
  const navigate = useNavigate();
  const { contacts, setContacts, setPublicKeyValue } = useAppStore();

  const activeContact = contacts.filter((item) => item?.isActive)?.[0];

  const items: ISelectItem[] = useMemo(
    () => contacts.map((item) => ({ name: item.name, value: item.publicKey })),
    [contacts]
  );

  const onChange = useCallback(
    async (item: ISelectItem) => {
      try {
        const newContacts = contacts.map((i) =>
          i.publicKey === item.value
            ? { ...item, isActive: true }
            : { ...item, item: false }
        );
        await chrome.storage.local.set({
          SHIFRONIM_CONTACTS: newContacts,
        });
        setPublicKeyValue(item.value);
      } catch (e) {
        toast.error(`"Произошла ошибка: ${e?.message || ""}`);
        console.log(e, "from onChange contacts");
      }
    },
    [contacts, setPublicKeyValue]
  );

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await chrome.storage.local.get([
          "SHIFRONIM_CONTACTS",
          "SHIFRONIM_ACTIVE_CONTACT",
        ]);

        if (res?.SHIFRONIM_CONTACTS?.length)
          setContacts(res.SHIFRONIM_CONTACTS);

        if (res?.SHIFRONIM_ACTIVE_CONTACT)
          await onChange(res.SHIFRONIM_ACTIVE_CONTACT);
      } catch (e) {
        toast.error("Ошибка при загрузке контактов");
      }
    };

    getContacts();
  }, [onChange, setContacts]);

  return (
    <>
      <label>Список контактов</label>
      <div className="contacts">
        <CustomSelect
          placeholder="Выберите из списка или создайте новый контакт"
          value={{
            name: activeContact?.name || "",
            value: activeContact?.publicKey || "",
          }}
          onChange={onChange}
          items={items}
        />
        <button
          data-tooltip-content="Создать контакт"
          data-tooltip-id="create-contact"
          onClick={() => navigate("/contacts/create")}
        >
          <CustomIcon icon="newContact" />
          <Tooltip id="create-contact" place="bottom" />
        </button>
        <button
          data-tooltip-content="Контакты"
          data-tooltip-id="contacts"
          onClick={() => navigate("/contacts")}
        >
          <CustomIcon icon="contactsBook" />
          <Tooltip id="contacts" place="bottom" />
        </button>
        {/*<button*/}
        {/*  data-tooltip-content="Экспортировать контакты"*/}
        {/*  data-tooltip-id="export-contacts"*/}
        {/*>*/}
        {/*  <CustomIcon icon="download" />*/}
        {/*  <Tooltip id="export-contacts" place="bottom" />*/}
        {/*</button>*/}
      </div>
    </>
  );
};
