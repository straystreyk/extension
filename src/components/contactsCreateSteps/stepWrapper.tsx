import { FC, ReactNode } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";

export const StepWrapper: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
  children: ReactNode;
}> = ({ wizardOptions, children }) => {
  const { resetWizard } = wizardOptions;

  return (
    <div>
      <button onClick={resetWizard}>off wizard</button>
      {children}
    </div>
  );
};
