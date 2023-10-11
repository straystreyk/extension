import "./styles/App.scss";
import { useEffect, useState } from "react";
import { copyPublicKey } from "./helpers/common";
import { RsaSection } from "./components/rsaSection";
import { CustomIcon } from "./components/customIcon";
import { toast } from "sonner";

export const App = () => {
  const [isOn, setIsOn] = useState(false);
  const [key, setKey] = useState("");
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
  }, []);

  return (
    <div id="___SHIFRONIM_APP___">
      {isPermissionDenied ? (
        <h2 style={{ color: "#fff", textAlign: "center" }}>
          На этой странице расширение&nbsp;недоступно
        </h2>
      ) : (
        <>
          <section className="section">
            <h2 className="turn-on-off-title">
              Введите секретное слово и&nbsp;запустите Shifronim
              <button onClick={() => copyPublicKey()}>
                <CustomIcon icon="copy" />
              </button>
            </h2>
            <div className="turn-on-off-wrapper">
              <input
                disabled={isOn}
                type="text"
                placeholder="Секретное слово для шифрования"
                value={key}
                onChange={(e) => !isOn && setKey(e.target.value)}
              />
              {key && (
                <button
                  disabled={loading}
                  onClick={() => (isOn ? turnOff() : turnOn())}
                  className={`turn-on-off-btn ${isOn ? "active" : ""}`}
                >
                  <CustomIcon icon={isOn ? "off" : "on"} />
                </button>
              )}
            </div>
          </section>
          <RsaSection />
          <div className="rsa-section-inputs">
            <input
              type="text"
              name="encryptedSecretWord"
              placeholder="Дешифровать секретное слово"
              value={encryptedSecretWord}
              onChange={(e) => setEncryptedSecretWord(e.target.value)}
            />
            <button onClick={decryptRSAWord}>Дешифровать</button>
          </div>
        </>
      )}
    </div>
  );
};
