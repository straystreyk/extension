import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import Wizard from "../wizard";
import { useEffect, useState } from "react";
import { useAppStore } from "../../helpers/store";

export interface IWizardInfo {
  name: string;
  isSender: boolean;
  secretWord: string;
  prefix: string;
  encryptedText?: string;
}

const initial = {
  step: 0,
  info: {
    name: "",
    isSender: true,
    prefix: "",
    secretWord: "",
    encryptedText: "",
  },
};

export const CreateContactWizard = () => {
  const { isWizardActive, setIsWizardActive } = useAppStore();
  const [initialWizard, setInitialWizard] = useState(initial);

  useEffect(() => {
    const resetInitial = async () => {
      const res = await chrome.storage.local.get([
        "SHIFRONIM_CONTACT_WIZARD_STATE",
      ]);

      if (res.SHIFRONIM_CONTACT_WIZARD_STATE) {
        setInitialWizard(res.SHIFRONIM_CONTACT_WIZARD_STATE);
        setIsWizardActive(true);
      }
    };

    resetInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wizard<IWizardInfo>
      className={`create-contact-wizard ${isWizardActive ? "active" : ""}`}
      initial={initialWizard}
      initialForReset={initial}
      onResetWizard={async () => {
        await chrome.storage.local.remove(["SHIFRONIM_CONTACT_WIZARD_STATE"]);
        setIsWizardActive(false);
      }}
    >
      <Step1 wizardOptions={undefined as never} />
      <Step2 wizardOptions={undefined as never} />
      <Step3 wizardOptions={undefined as never} />
      <Step4 wizardOptions={undefined as never} />
    </Wizard>
  );
};
