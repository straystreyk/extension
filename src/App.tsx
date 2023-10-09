import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [isOn, setIsOn] = useState(false);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicKeyValue, setPublicKeyValue] = useState("");
  const [encryptedSecretWord, setEncryptedSecretWord] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [url, setUrl] = useState("");

  const isPermissionDenied = !url || url.includes("chrome:");

  const turnOn = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_ACTIVATE", key },
      async (res) => {
        if (res.success) {
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
          setIsOn(false);
        }
        setLoading(false);
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
    <div id="___APP___">
      <button
        onClick={async () => {
          const { publicKey } = await chrome.storage.local.get(["publicKey"]);
          navigator.clipboard.writeText(publicKey);
        }}
      >
        скопировать свой публичный ключ
      </button>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          name="publicKey"
          placeholder="publicKey"
          value={publicKeyValue}
          onChange={(e) => setPublicKeyValue(e.target.value)}
        />
        <input
          type="text"
          name="text"
          placeholder="secretWord"
          value={secretWord}
          onChange={(e) => setSecretWord(e.target.value)}
        />
        <button
          onClick={() => {
            if (!secretWord || !publicKeyValue) return;

            chrome.runtime.sendMessage(
              {
                action: "SHIFRONIM_ENCRYPT_RSA",
                publicKey: publicKeyValue.trim(),
                secretWord: secretWord.trim(),
              },
              async (res) => {
                if (res.text) {
                  setSecretWord("");
                  setPublicKeyValue("");
                  navigator.clipboard.writeText(res.text);
                }
              }
            );
          }}
        >
          Зашифровать секретное слово
        </button>
      </div>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          name="encryptedSecretWord"
          placeholder="EncryptedSecretWord"
          value={encryptedSecretWord}
          onChange={(e) => setEncryptedSecretWord(e.target.value)}
        />
        <button
          onClick={() => {
            if (!encryptedSecretWord) return;

            chrome.runtime.sendMessage(
              {
                action: "SHIFRONIM_DECRYPT_RSA",
                encryptedSecretWord: encryptedSecretWord.trim(),
              },
              async (res) => {
                if (res.text) {
                  setEncryptedSecretWord("");
                  navigator.clipboard.writeText(res.text);
                }
              }
            );
          }}
        >
          Дешифровать секретное слово
        </button>
      </div>
      {isPermissionDenied ? (
        <h2 style={{ color: "grey" }}>
          На этой странице расширение недоступно
        </h2>
      ) : (
        <>
          <h2 style={{ color: isOn ? "lightgreen" : "grey" }}>
            <>{isOn ? "Шифроним включен" : "Шифроним выключен"}</>
          </h2>
          <input
            disabled={isOn}
            type="text"
            value={key}
            onChange={(e) => !isOn && setKey(e.target.value)}
          />
          {key && (
            <button
              disabled={loading}
              onClick={() => (isOn ? turnOff() : turnOn())}
            >
              {isOn ? "Выключить" : "Включить"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
