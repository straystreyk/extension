import { nanoid } from "nanoid";
import { memo, useState } from "react";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { PasswordInput } from "./passwordInput";
import { useAppStore } from "../helpers/store";

export const RsaSection = memo(() => {
  const { activeContact } = useAppStore();
  const [secretWord, setSecretWord] = useState("");

  return (
    <section className="section">
      <label>Публичный ключ собеседника</label>
      <div className="rsa-section-inputs">
        <div className="rsa-section-input-wrapper">
          <Tooltip id="public-key-tooltip" place="top" />
          <input
            type="text"
            name="publicKey"
            disabled
            placeholder="Вставьте публичный ключ"
            value={activeContact?.publicKey}
            data-tooltip-id="public-key-tooltip"
            data-tooltip-content="Отредактировать публичный ключ можно через редактирование контактов"
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
            if (!secretWord || !activeContact.publicKey)
              return toast.error("Введите публичный ключ и секретное слово");

            chrome.runtime.sendMessage(
              {
                action: "SHIFRONIM_ENCRYPT_RSA",
                publicKey: activeContact.publicKey.trim(),
                secretWord: secretWord.trim(),
              },
              async (res) => {
                if (res.text) {
                  setSecretWord("");
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
});
