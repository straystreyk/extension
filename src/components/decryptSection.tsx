import { memo, useState } from "react";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { PasswordInput } from "./passwordInput";
import { CustomIcon } from "./customIcon";

export const DecryptSection = memo(() => {
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
