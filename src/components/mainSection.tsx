import { memo, useState } from "react";
import { useAppStore } from "../helpers/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { copyPublicKey } from "../helpers/common";
import { CustomIcon } from "./customIcon";
import { Tooltip } from "react-tooltip";
import { ContactsSection } from "./contactsSection";

export const MainSection = memo(() => {
  const {
    isOn,
    setIsOn,
    activeContact,
    setActiveContact,
    setContacts,
    contacts,
  } = useAppStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const turnOn = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_ACTIVATE", key: activeContact.secretWord },
      async (res) => {
        if (res.success) {
          toast.success("Shifronim активирован");
          setIsOn(true);
          const newContacts = contacts.map((item) =>
            item.id === activeContact.id ? activeContact : item
          );

          await chrome.storage.local.set({
            SHIFRONIM_ACTIVE_CONTACT: activeContact,
            SHIFRONIM_CONTACTS: newContacts,
          });

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
          toast.success("Shifronim выключен");
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
        <h2>Введите секретное слово и&nbsp;запустите Shifronim</h2>
        <button
          data-tooltip-id="copy-public"
          data-tooltip-content="Скопировать собственный публичный ключ"
          onClick={() => copyPublicKey()}
        >
          <CustomIcon icon="key" />
        </button>
        <button
          data-tooltip-id="info-page"
          data-tooltip-content="Инструкция по использованию"
          onClick={() => navigate("/info")}
        >
          <CustomIcon icon="info" />
        </button>
      </div>
      <ContactsSection />
      <div className="turn-on-off-wrapper">
        {activeContact.secretWord && (
          <button
            disabled={loading}
            onClick={() => (isOn ? turnOff() : turnOn())}
            className={`turn-on-off-btn ${isOn ? "active" : ""}`}
            // data-tooltip-content={
            //   isOn ? "Выключить Shifronim" : "Включить Shifronim"
            // }
          >
            <CustomIcon icon={isOn ? "off" : "on"} />
          </button>
        )}
        <h4 className={`${isOn ? "active" : ""}`}>
          Shifronim {isOn ? "включен" : "выключен"}
        </h4>
      </div>
    </section>
  );
});
