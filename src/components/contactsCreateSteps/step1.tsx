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
      Введите имя контакта
      <input
        type="text"
        value={wizardOptions.info.name}
        onChange={(e) =>
          setWizardOption((p) => ({
            ...p,
            info: { name: e.target.value, isSender: p.info.isSender },
          }))
        }
      />
      <div>
        <button onClick={resetWizard}>Отменить</button>
        <button disabled={!wizardOptions.info.name} onClick={handleNext}>
          следующий шаг
        </button>
      </div>
    </StepWrapper>
  );
};
