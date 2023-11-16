import { FC, ReactNode } from "react";
import { IWizardChildrenOptions } from "../wizard";
import { IWizardInfo } from "./createContactWizard";
import { CustomIcon } from "../customIcon";
import { Tooltip } from "react-tooltip";

export const StepWrapper: FC<{
  wizardOptions: IWizardChildrenOptions<IWizardInfo>;
  children: ReactNode;
}> = ({ wizardOptions, children }) => {
  const { resetWizard } = wizardOptions;

  return (
    <div className="wizard-step-wrapper">
      <Tooltip id="reset-wizard" place="right" />
      <button
        data-tooltip-id="reset-wizard"
        data-tooltip-content="Отменить создание контакта"
        onClick={resetWizard}
      >
        <CustomIcon icon="cancel" />
      </button>
      <div className="wizard-step-content">{children}</div>
    </div>
  );
};
