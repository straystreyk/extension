import { FC, useState } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { StepWrapper } from "./stepWrapper";
import { toast } from "sonner";
import { useCreateContact } from "../../hooks/contacts";
import { CustomIcon } from "../customIcon";
import { copyText } from "../../helpers/common";

const SenderStep4: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const [value, setValue] = useState("");
  const { handleCreate: handleCreateContact } = useCreateContact();
  const { prevStep, resetWizard } = wizardOptions;

  const handleComplete = () => {
    if (!value) return;

    chrome.runtime.sendMessage(
      {
        action: "SHIFRONIM_DECRYPT_RSA",
        encryptedSecretWord: value.trim(),
      },
      async (res) => {
        const text: string | undefined = res?.text;

        if (text) {
          setValue("");
          const textArr = text.split(":");
          if (
            textArr?.[textArr.length - 1] !== "shifronim" ||
            !textArr?.[0] ||
            !textArr?.[1]
          ) {
            setValue("");
            return toast.error("Некорректное слово для шифрования");
          }

          await handleCreateContact(
            wizardOptions.info.name,
            //secret word
            textArr[1],
            //prefix
            textArr[0]
          );

          resetWizard();
          return;
        }

        setValue("");
        return toast.error("Некорректное слово для шифрования");
      }
    );
  };

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <h3 className="wizard-title">
        Шаг 4: Вставьте публичный ключ, полученный от собеседника.
      </h3>
      <label>Зашифрованный текст</label>
      <div className="rsa-section-input-wrapper">
        <textarea
          className="wizard-textarea"
          placeholder="Введите публичный ключ"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="wizard-main-btns">
        <button onClick={prevStep}>Назад</button>
        <button disabled={!value} onClick={handleComplete}>
          Готово
        </button>
      </div>
    </StepWrapper>
  );
};

const RecipientStep4: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const { handleCreate: handleCreateContact } = useCreateContact();
  const { prevStep, resetWizard } = wizardOptions;

  const handleComplete = async () => {
    await handleCreateContact(
      wizardOptions.info.name,
      //secret word
      wizardOptions.info.secretWord,
      //prefix
      wizardOptions.info.prefix
    );

    resetWizard();
    return;
  };

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <h3 className="wizard-title">
        Шаг 4: Скопируйте и отправьте зашифрованный текст собеседнику. После
        отправки нажмите кнопку Готово.
      </h3>
      <button
        className="wizard-btn"
        onClick={() =>
          copyText({ text: wizardOptions.info?.encryptedText || "" })
        }
      >
        <CustomIcon icon="key" />
        Скопировать
      </button>
      <div className="wizard-main-btns">
        <button onClick={prevStep}>Назад</button>
        <button onClick={handleComplete}>Готово</button>
      </div>
    </StepWrapper>
  );
};

export const Step4: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const {
    info: { isSender },
  } = wizardOptions;

  return (
    <>
      {isSender ? (
        <SenderStep4 wizardOptions={wizardOptions} />
      ) : (
        <RecipientStep4 wizardOptions={wizardOptions} />
      )}
    </>
  );
};
