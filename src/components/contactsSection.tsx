import { CustomSelect, ISelectItem } from "./customSelect";
import { useEffect, useMemo, useCallback } from "react";
import { CustomIcon } from "./customIcon";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../helpers/store";
import { v4 } from "uuid";
import { nanoid } from "nanoid";

export const ContactsSection = () => {
  const navigate = useNavigate();
  const {
    isOn,
    contacts,
    setContacts,
    setActiveContact,
    activeContact,
    setIsWizardActive,
  } = useAppStore();

  const items: ISelectItem[] = useMemo(
    () => contacts.map((item) => ({ value: item.id, ...item })),
    [contacts]
  );

  const onChange = useCallback(
    (item: ISelectItem) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setActiveContact(item as any);
      } catch (e) {
        toast.error(`"Произошла ошибка: ${e?.message || ""}`);
        console.log(e, "from onChange contacts");
      }
    },
    [setActiveContact]
  );

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await chrome.storage.local.get([
          "SHIFRONIM_CONTACTS",
          "SHIFRONIM_ACTIVE_CONTACT",
        ]);

        const defaultContact = {
          id: v4(),
          name: "Контакт по умолчанию",
          secretWord: nanoid(15),
          prefix: nanoid(10),
          isDefault: true,
        };

        if (res?.SHIFRONIM_CONTACTS?.length) {
          setContacts(res.SHIFRONIM_CONTACTS);
        } else {
          await chrome.storage.local.set({
            SHIFRONIM_CONTACTS: [defaultContact],
            SHIFRONIM_ACTIVE_CONTACT: defaultContact,
          });
          setContacts([defaultContact]);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange(defaultContact as any);
          return;
        }

        if (res.SHIFRONIM_ACTIVE_CONTACT)
          onChange(res.SHIFRONIM_ACTIVE_CONTACT);
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
          disabled={isOn}
          placeholder="Выберите из списка или создайте новый контакт"
          value={{
            name: activeContact?.name || "",
            value: activeContact?.id || "",
          }}
          onChange={onChange}
          items={items}
        />
        <button
          data-tooltip-content="Создать контакт"
          data-tooltip-id="create-contact"
          onClick={() => setIsWizardActive(true)}
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
      </div>
    </>
  );
};
