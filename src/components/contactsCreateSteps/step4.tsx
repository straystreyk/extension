import { FC, useState } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { StepWrapper } from "./stepWrapper";

const SenderStep4: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
}> = ({ wizardOptions }) => {
  const [value, setValue] = useState("");
  const { prevStep } = wizardOptions;

  const handleComplete = () => {};

  return (
    <StepWrapper wizardOptions={wizardOptions}>
      <div>
        Введите полученное от собеседника зашифрованное сообщение.
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={prevStep}>Назад</button>
        <button disabled={!wizardOptions.info.name} onClick={handleComplete}>
          Готово
        </button>
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
        "вы получатель"
      )}
    </>
  );
};
