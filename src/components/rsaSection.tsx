import { nanoid } from "nanoid";
import { useState } from "react";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";

export const RsaSection = () => {
  const [publicKeyValue, setPublicKeyValue] = useState("");
  const [secretWord, setSecretWord] = useState("");

  return (
    <section className="section">
      <div className="rsa-section-inputs">
        <input
          type="text"
          name="publicKey"
          placeholder="Вставьте публичный ключ"
          value={publicKeyValue}
          onChange={(e) => setPublicKeyValue(e.target.value)}
        />
        <div className="rsa-section-input-wrapper">
          <input
            type="text"
            name="text"
            placeholder="Секретное слово"
            value={secretWord}
            onChange={(e) => setSecretWord(e.target.value)}
          />
          <button
            onClick={() => setSecretWord(nanoid(20))}
            className="rsa-section-crate-word-btn"
          >
            <CustomIcon icon="plus" />
          </button>
        </div>
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
                  await navigator.clipboard.writeText(res.text);
                  toast.success("Зашифрованное слово скопировано");

                  return;
                }

                toast.error("Произошла ошибка");
              }
            );
          }}
        >
          Зашифровать секретное слово
        </button>
      </div>
    </section>
  );
};
