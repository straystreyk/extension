import { toast } from "sonner";
import { IWizard } from "../components/wizard";
import { IWizardInfo } from "../components/contactsCreateSteps/createContactWizard";

type TCopyTextOpts = {
  text: string;
  successText?: string;
  onError?: () => void;
  onSuccess?: () => void;
};

export const copyText: (opts: TCopyTextOpts) => void = async ({
  text,
  onSuccess,
  onError,
  successText,
}) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successText || "Успешно скопировано");
    onSuccess && onSuccess();
  } catch (e) {
    console.log(e.message);
    onError && onError();
  }
};

export const copyPublicKey: (
  opts?: Omit<TCopyTextOpts, "text">
) => void = async (opts) => {
  const { onSuccess, onError } = opts || {
    onSuccess: undefined,
    onError: undefined,
  };
  try {
    const { publicKey } = await chrome.storage.local.get(["publicKey"]);
    if (!publicKey) return;

    await copyText({
      text: publicKey,
      successText: "Публичный ключ скопирован в буфер обмена",
    });
    onSuccess && onSuccess();
  } catch (e) {
    onError && onError();
  }
};

export const saveWizardState = async (state: {
  info: IWizardInfo;
  step: number;
}) => {
  try {
    await chrome.storage.local.set({ SHIFRONIM_CONTACT_WIZARD_STATE: state });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
