import { memo, useState } from "react";
import { useAppStore } from "../helpers/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CustomIcon } from "./customIcon";
import { Tooltip } from "react-tooltip";
import { ContactsSection } from "./contactsSection";
import { CreateContactWizard } from "./contactsCreateSteps/createContactWizard";
import { importContacts } from "../helpers/common";

export const MainSection = memo(() => {
  const {
    isOn,
    setIsOn,
    activeContact,
    setActiveContact,
    setContacts,
    contacts,
    setIsWizardActive,
  } = useAppStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isContactsExists = contacts.length > 0;

  const turnOn = async () => {
    setLoading(true);
    const newContacts = contacts.map((item) =>
      item.id === activeContact.id ? activeContact : item
    );

    await chrome.storage.local.set({
      SHIFRONIM_ACTIVE_CONTACT: activeContact,
      SHIFRONIM_CONTACTS: newContacts,
    });

    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_ACTIVATE", key: activeContact.secretWord },
      async (res) => {
        if (res.success) {
          toast.success("Shifronim включен");
          setIsOn(true);

          setContacts(newContacts);
          setActiveContact(activeContact);
        }
        setLoading(false);
      }
    );
  };

  const turnOff = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_DEACTIVATE" },
      async (res) => {
        if (res.success) {
          toast.success("Shifronim выключен", {
            icon: <CustomIcon icon="cross" />,
          });
          setIsOn(false);
        }
        setLoading(false);
      }
    );
  };

  return (
    <section>
      <Tooltip id="copy-public" />
      <Tooltip id="info-page" />
      <div className="turn-on-off-title">
        <h2
          dangerouslySetInnerHTML={{
            __html: isContactsExists
              ? "Выберите контакт и&nbsp;запустите Shifronim"
              : "Для работы с Shifronim создайте или импортируйте контакты",
          }}
        />
        <button
          data-tooltip-id="info-page"
          data-tooltip-content="Инструкция по использованию"
          onClick={() => navigate("/info")}
        >
          <CustomIcon icon="info" />
        </button>
      </div>
      <div style={{ display: !isContactsExists ? "none" : "block" }}>
        <ContactsSection />
      </div>
      {isContactsExists ? (
        <>
          <div className="turn-on-off-wrapper">
            <button
              disabled={loading || !activeContact.secretWord}
              onClick={() => (isOn ? turnOff() : turnOn())}
              className={`turn-on-off-btn ${isOn ? "active" : ""}`}
            >
              <CustomIcon icon="on" />
            </button>
            <h4 className={`${isOn ? "active" : ""}`}>
              Shifronim {isOn ? "включен" : "выключен"}
            </h4>
          </div>
        </>
      ) : (
        <div className="no-contacts-section">
          <Tooltip id="contact-import-btn" />
          <button onClick={() => setIsWizardActive(true)}>
            Создать контакт <CustomIcon icon="newContact" />
          </button>
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
            Импортировать контакты <CustomIcon icon="import" />
          </label>
          <input
            onChange={importContacts}
            className="contact-import-input"
            type="file"
            multiple={false}
            accept="application/json"
            id="contact-import"
          />
        </div>
      )}
      <CreateContactWizard />
    </section>
  );
});
