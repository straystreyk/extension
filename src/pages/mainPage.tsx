import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { copyPublicKey } from "../helpers/common";
import { CustomIcon } from "../components/customIcon";
import { RsaSection } from "../components/rsaSection";
import { PasswordInput } from "../components/passwordInput";
import { useAppStore } from "../helpers/store";
import { ContactsSection } from "../components/contactsSection";

export const MainPage = () => {
  const { isOn, setIsOn, key, setKey } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [encryptedSecretWord, setEncryptedSecretWord] = useState("");
  const [url, setUrl] = useState("");

  const isPermissionDenied = !url || url.includes("chrome:");

  const turnOn = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_ACTIVATE", key },
      async (res) => {
        if (res.success) {
          toast.success("Shifronim активирован");
          setIsOn(true);
        }
        setLoading(false);
      }
    );
  };

  const clearWord = async () => {
    if (isOn) return;
    await chrome.storage.local.remove(["SHIFRONIM_MESSAGE_KEY"]);
    setKey("");
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

  useEffect(() => {
    const checkForActive = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs?.[0].url || "";
        setUrl(url);
      });
      const res = await chrome.storage.local.get([
        "SHIFRONIM_IS_ACTIVE",
        "SHIFRONIM_MESSAGE_KEY",
      ]);
      if (res.SHIFRONIM_MESSAGE_KEY) setKey(res.SHIFRONIM_MESSAGE_KEY);
      setIsOn(!!res.SHIFRONIM_IS_ACTIVE);
    };

    checkForActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isPermissionDenied ? (
        <h2 style={{ color: "#fff", textAlign: "center" }}>
          На этой странице расширение&nbsp;недоступно
        </h2>
      ) : (
        <>
          <section className="section">
            <div className="turn-on-off-title">
              <h2>Введите секретное слово и&nbsp;запустите Shifronim</h2>
              <button
                data-tooltip-id="copyPublic"
                data-tooltip-content="Скопировать публичный ключ"
                onClick={() => copyPublicKey()}
              >
                <CustomIcon icon="key" />
              </button>
              <Tooltip id="copyPublic" />
            </div>
            <ContactsSection />
            <div className="turn-on-off-wrapper">
              <input
                disabled={isOn}
                type="text"
                placeholder="Секретное слово для шифрования"
                value={key}
                onChange={(e) => !isOn && setKey(e.target.value)}
              />
              <Tooltip id="turnOn" place="bottom" />
              <Tooltip id="clear-word-btn" />
              {key && (
                <>
                  <button
                    disabled={isOn}
                    onClick={clearWord}
                    className="clear-word-btn"
                    data-tooltip-id="clear-word-btn"
                    data-tooltip-content="Удалить секретное слово"
                  >
                    <CustomIcon icon="cross" />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => (isOn ? turnOff() : turnOn())}
                    className={`turn-on-off-btn ${isOn ? "active" : ""}`}
                    data-tooltip-id="turnOn"
                    data-tooltip-content="Включить Shifronim"
                  >
                    <CustomIcon icon={isOn ? "off" : "on"} />
                  </button>
                </>
              )}
            </div>
          </section>
          <>
            <RsaSection />
            <div className="rsa-section-inputs">
              <PasswordInput
                name="encryptedSecretWord"
                placeholder="Секретное слово"
                value={encryptedSecretWord}
                onChange={(e) => setEncryptedSecretWord(e.target.value)}
              />
              <button onClick={decryptRSAWord}>
                Дешифровать секретное слово
              </button>
            </div>
          </>
        </>
      )}
    </>
  );
};
