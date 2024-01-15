import { CustomSelect, ISelectItem } from "./customSelect";
import { useEffect, useMemo, useCallback } from "react";
import { CustomIcon } from "./customIcon";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../helpers/store";

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

        if (res?.SHIFRONIM_CONTACTS?.length) {
          setContacts(res.SHIFRONIM_CONTACTS);
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
          data-tooltip-content={
            isOn
              ? "Выключите Shifronim, чтобы создать новый контакт"
              : "Создать контакт"
          }
          data-tooltip-id="create-contact"
          disabled={isOn}
          onClick={() => setIsWizardActive(true)}
        >
          <CustomIcon icon="newContact" />
          <Tooltip id="create-contact" place="bottom" />
        </button>
        <button
          data-tooltip-content={
            isOn
              ? "Выключите Shifronim, чтобы перейти на страницу контактов"
              : "Контакты"
          }
          data-tooltip-id="contacts"
          disabled={isOn}
          onClick={() => navigate("/contacts")}
        >
          <CustomIcon icon="contactsBook" />
          <Tooltip id="contacts" place="bottom" />
        </button>
      </div>
    </>
  );
};
