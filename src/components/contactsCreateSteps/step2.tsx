import { FC } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { saveWizardState } from "../../helpers/common";
import { StepWrapper } from "./stepWrapper";

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
      <div>
        отправитель
        <input
          type="checkbox"
          checked={isSender}
          onChange={() =>
            setWizardOption((p) => ({
              ...p,
              info: { name: p.info.name, isSender: true },
            }))
          }
        />
      </div>
      <div>
        получатель
        <input
          type="checkbox"
          checked={!isSender}
          onChange={() =>
            setWizardOption((p) => ({
              ...p,
              info: { name: p.info.name, isSender: false },
            }))
          }
        />
      </div>
      <button onClick={prevStep}>Назад</button>
      <button onClick={handleNext}>следующий шаг</button>
    </StepWrapper>
  );
};
