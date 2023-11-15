import * as cryptoJS from "crypto-js";
import {
  decryptRSAMessage,
  encryptRSAMessage,
  generateAndStoreKeyPairs,
} from "./helpers";

const activateShifronim = async (key: string) => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.storage.local.set({
      SHIFRONIM_IS_ACTIVE: true,
      SHIFRONIM_MESSAGE_KEY: key,
    });

    await chrome.tabs.sendMessage(tab.id as number, {
      action: "START_SHIFR",
    });
    await chrome.action.setBadgeText({ text: "ON", tabId: tab.id });

    return { success: true };
  } catch (e) {
    console.log(e.message, "from activateShifronim");
    return { success: false };
  }
};

const deactivateShifronim = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (tab.id) {
      await chrome.action.setBadgeText({ text: "", tabId: tab.id });
      await chrome.tabs.sendMessage(tab.id as number, {
        action: "STOP_SHIFR",
      });
    }

    await chrome.storage.local.set({
      SHIFRONIM_IS_ACTIVE: false,
    });
    return { success: true };
  } catch (e) {
    console.log(e.message, "from deactivateShifronim");
    return { success: false };
  }
};

const checkForActive = async () => {
  chrome.storage.local
    .get(["SHIFRONIM_IS_ACTIVE", "SHIFRONIM_MESSAGE_KEY"])
    .then((res) => {
      if (!res.SHIFRONIM_IS_ACTIVE) return deactivateShifronim();

      if (res.SHIFRONIM_IS_ACTIVE && res.SHIFRONIM_MESSAGE_KEY) {
        activateShifronim(res.SHIFRONIM_MESSAGE_KEY);
      }
    });
};

const decryptMessage = async (text: string) => {
  const res = await chrome.storage.local.get(["SHIFRONIM_MESSAGE_KEY"]);

  if (!res.SHIFRONIM_MESSAGE_KEY) return "";

  const replaced = text.replace(/!\?!SHIFRONIM!\?!/g, "");
  if (!replaced) return "";

  try {
    const decrypted = cryptoJS.AES.decrypt(
      replaced.trim(),
      res.SHIFRONIM_MESSAGE_KEY
    ).toString(cryptoJS.enc.Utf8);
    return JSON.parse(decrypted).text;
  } catch (e) {
    return text;
  }
};
const encryptMessage = async (text: string) => {
  const res = await chrome.storage.local.get(["SHIFRONIM_MESSAGE_KEY"]);
  if (!res.SHIFRONIM_MESSAGE_KEY) return "";

  const encrypted = cryptoJS.AES.encrypt(
    JSON.stringify({ text }),
    res.SHIFRONIM_MESSAGE_KEY
  ).toString();
  return "!?!SHIFRONIM!?!" + encrypted;
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) checkForActive();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.url) checkForActive();
  });

  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  await generateAndStoreKeyPairs();

  const contentScripts = chrome.runtime.getManifest()?.content_scripts;
  if (!contentScripts) return;

  for (const cs of contentScripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      if (tab.id) {
        if (cs?.js?.length) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: cs.js,
          });
        }

        if (cs?.css?.length) {
          chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: cs.css,
          });
        }
      }
    }
  }

  return true;
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "SHIFRONIM_DECRYPT") {
    decryptMessage(msg.text).then((replaced) => {
      sendResponse({ text: replaced || "" });
    });
  }
  if (msg.action === "SHIFRONIM_ENCRYPT") {
    encryptMessage(msg.text).then((replaced) => {
      sendResponse({ text: replaced || "" });
    });
  }
  if (msg.action === "SHIFRONIM_ACTIVATE") {
    activateShifronim(msg.key).then((res) => {
      sendResponse(res);
    });
  }
  if (msg.action === "SHIFRONIM_DEACTIVATE") {
    deactivateShifronim().then(sendResponse);
  }
  if (msg.action === "SHIFRONIM_ENCRYPT_RSA") {
    encryptRSAMessage(msg.secretWord, msg.publicKey)
      .then(async (text) => {
        sendResponse({ success: true, text });
      })
      .catch(() => sendResponse({ success: false }));
  }
  if (msg.action === "SHIFRONIM_DECRYPT_RSA") {
    decryptRSAMessage(msg.encryptedSecretWord)
      .then(async (text) => {
        sendResponse({ success: true, text });
      })
      .catch(() => sendResponse({ success: false }));
  }

  return true;
});
