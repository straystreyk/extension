import { FC, useState } from "react";
import { IWizard, IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { copyPublicKey, saveWizardState } from "../../helpers/common";
import { StepWrapper } from "./stepWrapper";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { CustomIcon } from "../customIcon";

const SenderStep3: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const { prevStep, nextStep } = wizardOptions;

  const handleNext = async () => {
    await saveWizardState({
      info: wizardOptions.info as IWizardInfo,
      step: wizardOptions.step + 1,
    });
    nextStep();
  };

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <h3 className="wizard-title">
        Шаг 3: Скопируйте свой ключ, нажав на иконку и перешлите свой ключ
        собеседнику.{" "}
        <span className="red">
          Внимание: для пересылки ключа не рекомендуется использовать тот же
          мессенджер, в котором ведется переписка!
        </span>
      </h3>
      <button
        className="wizard-btn"
        onClick={() =>
          copyPublicKey({ successText: "Публичный ключ успешно скопирован" })
        }
      >
        <CustomIcon icon="key" />
        Cкопировать публичный ключ
      </button>
      <div className="wizard-main-btns">
        <button onClick={prevStep}>Назад</button>
        <button onClick={handleNext}>Далее</button>
      </div>
    </StepWrapper>
  );
};

const RecipientStep3: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const { prevStep, nextStep, setWizardOption } = wizardOptions;
  const [value, setValue] = useState("");

  const handleNext = async () => {
    if (!value) return;

    const secretWord = nanoid(15);
    const prefix = nanoid(10);

    await chrome.runtime.sendMessage(
      {
        action: "SHIFRONIM_ENCRYPT_RSA",
        publicKey: value.trim(),
        secretWord: prefix + ":" + secretWord + ":" + "shifronim",
      },
      async (res) => {
        if (res.text) {
          setValue("");
          await navigator.clipboard.writeText(res.text);
          let newWizardInfo: null | IWizard<IWizardInfo> = null;

          setWizardOption((p) => {
            const newState: IWizard<IWizardInfo> = {
              ...p,
              info: {
                ...p.info,
                prefix,
                secretWord,
                encryptedText: res.text,
              } as IWizardInfo,
            };
            newWizardInfo = newState;

            return newState;
          });

          if (newWizardInfo) {
            await saveWizardState({
              ...(newWizardInfo as IWizard<IWizardInfo>),
              step: (newWizardInfo as IWizard<IWizardInfo>).step + 1,
            } as IWizard<IWizardInfo>);
            toast.success("Зашифрованное слово скопировано");
            nextStep();
          }

          return;
        }

        toast.error(
          "Произошла ошибка. Возможно вы передали неправильный публичный ключ"
        );
        setValue("");
      }
    );
  };

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <h3 className="wizard-title">
        Шаг 3: Вствьте публичный ключ, полученный от собеседника.
      </h3>
      <div className="rsa-section-input-wrapper">
        <textarea
          placeholder="Вставьте публичный ключ"
          className="wizard-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="wizard-main-btns">
        <button onClick={prevStep}>Назад</button>
        <button onClick={handleNext}>Далее</button>
      </div>
    </StepWrapper>
  );
};

export const Step3: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const {
    info: { isSender },
  } = wizardOptions;

  return (
    <>
      {isSender ? (
        <SenderStep3 wizardOptions={wizardOptions} />
      ) : (
        <RecipientStep3 wizardOptions={wizardOptions} />
      )}
    </>
  );
};
