import { FC } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { saveWizardState } from "../../helpers/common";
import { StepWrapper } from "./stepWrapper";

export const Step1: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const { nextStep, setWizardOption, resetWizard } = wizardOptions;

  const handleNext = async () => {
    await saveWizardState({
      info: wizardOptions.info as IWizardInfo,
      step: wizardOptions.step + 1,
    });
    nextStep();
  };

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <h3 className="wizard-title">Шаг 1: Введите имя контакта</h3>
      <label>Имя контакта</label>
      <div className="rsa-section-input-wrapper">
        <input
          type="text"
          value={wizardOptions.info.name}
          placeholder="Введите имя контакта"
          onChange={(e) =>
            setWizardOption((p) => ({
              ...p,
              info: {
                ...p.info,
                name: e.target.value,
                isSender: p.info.isSender,
              } as IWizardInfo,
            }))
          }
        />
      </div>
      <div className="wizard-main-btns">
        <button onClick={resetWizard}>Отменить</button>
        <button disabled={!wizardOptions.info.name} onClick={handleNext}>
          Далее
        </button>
      </div>
    </StepWrapper>
  );
};
