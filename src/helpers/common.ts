import { toast } from "sonner";

type TCopyTextOpts = {
  text: string;
  onError?: () => void;
  onSuccess?: () => void;
};

export const copyText: (opts: TCopyTextOpts) => void = async ({
  text,
  onSuccess,
  onError,
}) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Успешно скопировано");
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

    await copyText({ text: publicKey });
    onSuccess && onSuccess();
  } catch (e) {
    onError && onError();
  }
};
