import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { copyPublicKey } from "../helpers/common";
import { CustomIcon } from "../components/customIcon";
import { RsaSection } from "../components/rsaSection";
import { PasswordInput } from "../components/passwordInput";
import { useAppStore } from "../helpers/store";
import { ContactsSection } from "../components/contactsSection";
import { useNavigate } from "react-router-dom";

const MainSection = memo(() => {
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

  const clearWord = async () => {
    if (isOn) return;
    setActiveContact({ ...activeContact, secretWord: "" });
    await chrome.storage.local.remove(["SHIFRONIM_MESSAGE_KEY"]);
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
    <section className="section">
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

        <Tooltip id="copy-public" />
        <Tooltip id="info-page" />
      </div>
      <ContactsSection />
      <label>Секретное слово</label>
      <div className="turn-on-off-wrapper">
        <input
          disabled={isOn}
          type="text"
          placeholder="Секретное слово для шифрования"
          value={activeContact?.secretWord}
          onChange={(e) =>
            !isOn &&
            setActiveContact({ ...activeContact, secretWord: e.target.value })
          }
        />
        <Tooltip id="turnOn" place="bottom" />
        <Tooltip id="clear-word-btn" place="bottom" />
        <button
          disabled={isOn}
          onClick={clearWord}
          className="clear-word-btn"
          data-tooltip-id="clear-word-btn"
          data-tooltip-content="Удалить секретное слово"
        >
          <CustomIcon icon="cross" />
        </button>
        {activeContact.secretWord && (
          <button
            disabled={loading}
            onClick={() => (isOn ? turnOff() : turnOn())}
            className={`turn-on-off-btn ${isOn ? "active" : ""}`}
            data-tooltip-id="turnOn"
            data-tooltip-content={
              isOn ? "Выключить Shifronim" : "Включить Shifronim"
            }
          >
            <CustomIcon icon={isOn ? "off" : "on"} />
          </button>
        )}
      </div>
    </section>
  );
});

const DecryptSection = memo(() => {
  const [encryptedSecretWord, setEncryptedSecretWord] = useState("");

  const decryptRSAWord = () => {
    if (!encryptedSecretWord) return;

    chrome.runtime.sendMessage(
      {
        action: "SHIFRONIM_DECRYPT_RSA",
        encryptedSecretWord: encryptedSecretWord.trim(),
      },
      async (res) => {
        if (res?.text) {
          setEncryptedSecretWord("");
          await navigator.clipboard.writeText(res.text);
          toast.success("Дешифрованное слово скопировано в буфер обмена");
          return;
        }

        toast.error("Что-то пошло не так");
      }
    );
  };

  return (
    <>
      <label>Зашифрованное секретное слово</label>
      <div className="decrypt-input-wrapper">
        <Tooltip id="decrypt-rsa-word" />
        <PasswordInput
          name="encryptedSecretWord"
          placeholder="Секретное слово"
          value={encryptedSecretWord}
          onChange={(e) => setEncryptedSecretWord(e.target.value)}
        />
        <button
          data-tooltip-content="Дешифровать секретное слово"
          data-tooltip-id="decrypt-rsa-word"
          onClick={decryptRSAWord}
        >
          <CustomIcon icon="unlock" />
        </button>
      </div>
    </>
  );
});

export const MainPage = memo(() => {
  const { setIsOn } = useAppStore();
  const [url, setUrl] = useState("");

  const isPermissionDenied = !url || url.includes("chrome:");

  useEffect(() => {
    const checkForActive = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs?.[0].url || "";
        setUrl(url);
      });
      const res = await chrome.storage.local.get(["SHIFRONIM_IS_ACTIVE"]);

      setIsOn(!!res.SHIFRONIM_IS_ACTIVE);
    };

    checkForActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isPermissionDenied ? (
        <h2 style={{ textAlign: "center" }}>
          На этой странице расширение&nbsp;недоступно
        </h2>
      ) : (
        <>
          <MainSection />
          <RsaSection />
          <DecryptSection />
        </>
      )}
    </>
  );
});
