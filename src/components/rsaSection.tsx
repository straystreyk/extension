import { nanoid } from "nanoid";
import { useState } from "react";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { PasswordInput } from "./passwordInput";
import { useAppStore } from "../helpers/store";

export const RsaSection = () => {
  const { publicKeyValue, setPublicKeyValue } = useAppStore();
  const [secretWord, setSecretWord] = useState("");

  return (
    <section className="section">
      <label>Публичный ключ собеседника</label>
      <div className="rsa-section-inputs">
        <div className="rsa-section-input-wrapper">
          <input
            type="text"
            name="publicKey"
            placeholder="Вставьте публичный ключ"
            value={publicKeyValue}
            onChange={(e) => setPublicKeyValue(e.target.value)}
          />
        </div>
        <div>
          <label>Придумайте секретное слово</label>
          <div className="rsa-section-input-wrapper">
            <PasswordInput
              name="text"
              placeholder="Секретное слово"
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value)}
            />
            <Tooltip id="secretKey" />
            <button
              onClick={() => setSecretWord(nanoid(20))}
              data-tooltip-id="secretKey"
              data-tooltip-content="Сгенерировать секретный ключ"
            >
              <CustomIcon icon="plus" />
            </button>
          </div>
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
