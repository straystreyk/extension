import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import Wizard from "../wizard";
import { useEffect, useState } from "react";

export interface IWizardInfo {
  name: string;
  isSender: boolean;
}

const initial = {
  step: 0,
  info: { name: "", isSender: true },
};

export const CreateContactWizard = () => {
  const [initialWizard, setInitialWizard] = useState(initial);

  useEffect(() => {
    const resetInitial = async () => {
      const res = await chrome.storage.local.get([
        "SHIFRONIM_CONTACT_WIZARD_STATE",
      ]);

      if (res.SHIFRONIM_CONTACT_WIZARD_STATE) {
        setInitialWizard(res.SHIFRONIM_CONTACT_WIZARD_STATE);
      }
    };

    resetInitial();
  }, []);

  return (
    <Wizard<IWizardInfo>
      initial={initialWizard}
      initialForReset={initial}
      onResetWizard={() => {
        chrome.storage.local.remove(["SHIFRONIM_CONTACT_WIZARD_STATE"]);
      }}
    >
      <Step1 wizardOptions={undefined as never} />
      <Step2 wizardOptions={undefined as never} />
      <Step3 wizardOptions={undefined as never} />
      <Step4 wizardOptions={undefined as never} />
    </Wizard>
  );
};
