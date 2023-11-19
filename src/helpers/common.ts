import { toast } from "sonner";
import { IWizard } from "../components/wizard";
import { IWizardInfo } from "../components/contactsCreateSteps/createContactWizard";
import { IContactItem, useAppStore } from "./store";
import { ChangeEvent } from "react";

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

export const saveWizardState = async (state: IWizard<IWizardInfo>) => {
  try {
    await chrome.storage.local.set({ SHIFRONIM_CONTACT_WIZARD_STATE: state });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const importContacts = async (e: ChangeEvent<HTMLInputElement>) => {
  const reader = new FileReader();
  const file = e.target?.files?.[0];
  if (!file) return;

  reader.onload = async (event) => {
    if (event.target?.result) {
      try {
        const json: IContactItem[] = JSON.parse(event.target.result as string);
        if (!json.length) return toast.error("Список контактов пуст");
        const activeContact = json[0];

        await chrome.storage.local.set({
          SHIFRONIM_CONTACTS: json,
          SHIFRONIM_ACTIVE_CONTACT: activeContact,
        });

        useAppStore.setState({ contacts: json, activeContact });
      } catch (e) {
        console.log(e.message);
        toast.error("Что-то пошло не так...");
      }

      toast.success("Контакты успешно импортированы");
    }
  };

  reader.readAsText(file);
};
