import * as crypto from "crypto-js";

const activateShifronim = async (key: string) => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await chrome.storage.local.set({
      SHIFRONIM_IS_ACTIVE: true,
      SHIFRONIM_MESSAGE_KEY: key,
    });
    await chrome.tabs.sendMessage(tab.id, {
      action: "START_SHIFR",
    });
    await chrome.action.setBadgeText({ text: "ON", tabId: tab.id });

    return { success: true };
  } catch (e) {
    console.log(e.message);
    return { success: false };
  }
};

const deactivateShifronim = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await chrome.action.setBadgeText({ text: "", tabId: tab.id });
    await chrome.storage.local.set({
      SHIFRONIM_IS_ACTIVE: false,
    });
    await chrome.tabs.sendMessage(tab.id, {
      action: "STOP_SHIFR",
    });
    return { success: true };
  } catch (e) {
    console.log(e.message);
    return { success: false };
  }
};

const checkForActive = () => {
  chrome.storage.local
    .get(["SHIFRONIM_IS_ACTIVE", "SHIFRONIM_MESSAGE_KEY"])
    .then((res) => {
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
    const decrypted = crypto.AES.decrypt(
      replaced.trim(),
      res.SHIFRONIM_MESSAGE_KEY
    ).toString(crypto.enc.Utf8);
    return JSON.parse(decrypted).text;
  } catch (e) {
    return text;
  }
};
const encryptMessage = async (text: string) => {
  const res = await chrome.storage.local.get(["SHIFRONIM_MESSAGE_KEY"]);
  if (!res.SHIFRONIM_MESSAGE_KEY) return "";

  const encrypted = crypto.AES.encrypt(
    JSON.stringify({ text }),
    res.SHIFRONIM_MESSAGE_KEY
  ).toString();
  return "!?!SHIFRONIM!?!" + encrypted;
};

chrome.tabs.onUpdated.addListener(() => {
  checkForActive();
});

chrome.tabs.onActivated.addListener(() => {
  checkForActive();
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "1",
    title: "Зашифровать",
    contexts: ["selection"],
  });
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

  return true;
});
