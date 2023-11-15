import { FC } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { copyPublicKey, saveWizardState } from "../../helpers/common";
import { StepWrapper } from "./stepWrapper";

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
      <button
        onClick={() =>
          copyPublicKey({ successText: "Публичный ключ успешно скопирован" })
        }
      >
        Cкопировать публичный ключ
      </button>
      <div>
        <button onClick={prevStep}>Назад</button>
        <button disabled={!wizardOptions.info.name} onClick={handleNext}>
          следующий шаг
        </button>
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
        "вы получатель"
      )}
    </>
  );
};
