import { nanoid } from "nanoid";
import { memo, useState } from "react";
import { CustomIcon } from "./customIcon";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { PasswordInput } from "./passwordInput";

export const RsaSection = memo(() => {
  const [secretWord, setSecretWord] = useState("");
  const [publicKey, setPublicKey] = useState("");

  return (
    <section className="section">
      <label>Публичный ключ собеседника</label>
      <div className="rsa-section-inputs">
        <div className="rsa-section-input-wrapper">
          <input
            type="text"
            name="publicKey"
            placeholder="Вставьте публичный ключ"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </div>
        <div>
          <label>Придумайте секретное слово</label>
          <div className="rsa-section-input-wrapper">
            <Tooltip id="encrypt-secret-word" />
            <Tooltip id="secretKey" />

            <PasswordInput
              name="text"
              placeholder="Секретное слово"
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value)}
            />
            <button
              onClick={() => setSecretWord(nanoid(20))}
              data-tooltip-id="secretKey"
              data-tooltip-content="Сгенерировать секретный ключ"
            >
              <CustomIcon icon="plus" />
            </button>
            <button
              data-tooltip-content="Зашифровать секретное слово"
              data-tooltip-id="encrypt-secret-word"
              onClick={() => {
                if (!secretWord || !publicKey)
                  return toast.error(
                    "Введите публичный ключ и секретное слово"
                  );

                chrome.runtime.sendMessage(
                  {
                    action: "SHIFRONIM_ENCRYPT_RSA",
                    publicKey: publicKey.trim(),
                    secretWord: secretWord.trim(),
                  },
                  async (res) => {
                    if (res.text) {
                      setSecretWord("");
                      await navigator.clipboard.writeText(res.text);
                      toast.success("Зашифрованное слово скопировано");

                      return;
                    }

                    toast.error(
                      "Произошла ошибка. Возможно вы передали нерпавильный публичный ключ"
                    );
                  }
                );
              }}
            >
              <CustomIcon icon="lock" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
