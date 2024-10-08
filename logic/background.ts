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

    const res = await chrome.storage.local.get([
      "SHIFRONIM_ACTIVE_CONTACT",
      "SHIFRONIM_ACTIVE_TABS",
    ]);
    if (!res.SHIFRONIM_ACTIVE_CONTACT) return { success: false };

    // табы где включен шифроним
    const activeTabs = res?.SHIFRONIM_ACTIVE_TABS
      ? res.SHIFRONIM_ACTIVE_TABS
      : {};

    if (tab.id) {
      await chrome.storage.local.set({
        SHIFRONIM_MESSAGE_KEY: key,
        SHIFRONIM_ACTIVE_TABS: { ...activeTabs, [tab.id]: { active: true } },
      });
      await chrome.tabs.sendMessage(tab.id, {
        action: "START_SHIFR",
        prefix: res.SHIFRONIM_ACTIVE_CONTACT.prefix,
      });
      await chrome.action.setBadgeText({ text: "ON", tabId: tab.id });

      return { success: true };
    } else {
      return { success: false };
    }
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

    if (tab?.id) {
      await chrome.action.setBadgeText({ text: "", tabId: tab.id });
      await deleteTabInfo(tab.id);
      await chrome.tabs.sendMessage(tab.id as number, {
        action: "STOP_SHIFR",
      });
    }

    return { success: true };
  } catch (e) {
    console.log(e.message, "from deactivateShifronim");
    return { success: false };
  }
};

const checkForActive = async (tabId: number) => {
  chrome.storage.local
    .get(["SHIFRONIM_ACTIVE_TABS", "SHIFRONIM_MESSAGE_KEY"])
    .then((res) => {
      if (!res.SHIFRONIM_ACTIVE_TABS) return;

      if (res.SHIFRONIM_ACTIVE_TABS[tabId] && res.SHIFRONIM_MESSAGE_KEY) {
        activateShifronim(res.SHIFRONIM_MESSAGE_KEY);
      }
    });
};

const decryptMessage = async (text: string, prefix: string) => {
  const res = await chrome.storage.local.get(["SHIFRONIM_MESSAGE_KEY"]);

  if (!res.SHIFRONIM_MESSAGE_KEY) return "";
  const regex = new RegExp(`${prefix}`, "");
  const replaced = text.replace(regex, "");

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
  const res = await chrome.storage.local.get([
    "SHIFRONIM_MESSAGE_KEY",
    "SHIFRONIM_ACTIVE_CONTACT",
  ]);
  if (!res.SHIFRONIM_MESSAGE_KEY || !res.SHIFRONIM_ACTIVE_CONTACT) return "";

  const encrypted = cryptoJS.AES.encrypt(
    JSON.stringify({ text }),
    res.SHIFRONIM_MESSAGE_KEY
  ).toString();
  return res.SHIFRONIM_ACTIVE_CONTACT.prefix + encrypted;
};

const deleteTabInfo = async (tabId: number) => {
  const res = await chrome.storage.local.get(["SHIFRONIM_ACTIVE_TABS"]);

  if (!res.SHIFRONIM_ACTIVE_TABS) return;
  const obj = { ...res.SHIFRONIM_ACTIVE_TABS };
  delete obj[tabId];

  await chrome.storage.local.set({
    SHIFRONIM_ACTIVE_TABS: obj,
  });
};

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await deleteTabInfo(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) checkForActive(tabId);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.url) checkForActive(activeInfo.tabId);
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
    decryptMessage(msg.text, msg.prefix).then((replaced) => {
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

  if (msg.action === "GET_TAB_INFO") {
    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then(async (tab) => {
        if (tab[0]) {
          sendResponse({ success: true, tab: tab[0] });
        } else {
          sendResponse({ success: false });
        }
      })
      .catch(() => sendResponse({ success: false }));
  }

  return true;
});
