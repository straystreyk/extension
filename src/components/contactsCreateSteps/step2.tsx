import { FC } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { saveWizardState } from "../../helpers/common";
import { StepWrapper } from "./stepWrapper";
import { Checkbox } from "../checkbox";
import { Tooltip } from "react-tooltip";

export const Step2: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const {
    nextStep,
    prevStep,
    info: { isSender },
    setWizardOption,
  } = wizardOptions;

  const handleNext = async () => {
    await saveWizardState({
      info: wizardOptions.info as IWizardInfo,
      step: wizardOptions.step + 1,
    });
    nextStep();
  };

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <Tooltip id="wizard-sender" />
      <Tooltip id="wizard-recipient" />
      <h3 className="wizard-title">
        Шаг 2: Установить связь по обмену публичным ключом. Выберете каким
        способом вы планируете установить связь:
      </h3>
      <div className="checkbox-wizard-element">
        <div
          data-tooltip-content="Отправитель - это пользователь, который отправляет свой ключ для генерации секретного слова своему собеседнику"
          data-tooltip-id="wizard-sender"
        >
          <Checkbox
            id="wizard-sender-checkbox"
            text="Отправитель"
            checked={isSender}
            onChange={() =>
              setWizardOption((p) => ({
                ...p,
                info: {
                  ...p.info,
                  name: p.info.name,
                  isSender: true,
                } as IWizardInfo,
              }))
            }
          />
        </div>
      </div>
      <div className="checkbox-wizard-element">
        <div
          data-tooltip-content="Получатель - это пользователь, который получает публичный ключ собеседника и зашифровывает секретное слово"
          data-tooltip-id="wizard-recipient"
        >
          <Checkbox
            id="wizard-recipient-checkbox"
            checked={!isSender}
            text="Получатель"
            onChange={() =>
              setWizardOption((p) => ({
                ...p,
                info: {
                  ...p.info,
                  name: p.info.name,
                  isSender: false,
                } as IWizardInfo,
              }))
            }
          />
        </div>
      </div>
      <div className="wizard-main-btns">
        <button onClick={prevStep}>Назад</button>
        <button onClick={handleNext}>Далее</button>
      </div>
    </StepWrapper>
  );
};
