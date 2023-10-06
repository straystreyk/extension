let observer: MutationObserver | undefined = undefined;
const container = document.createElement("div");
const shadowRoot = container.attachShadow({
  mode: "open",
  delegatesFocus: true,
});
const contentContainer = document.createElement("div");
const textAreaElement = document.createElement("textarea");
const button = document.createElement("button");

contentContainer.setAttribute("part", "shifronim-content-div");
contentContainer.classList.add("shifronim-content-div");
textAreaElement.setAttribute("part", "shifronim-content-textarea");
textAreaElement.classList.add("shifronim-content-textarea");
button.setAttribute("part", "shifronim-content-button");
button.classList.add("shifronim-content-button");
button.innerText = "Encrypt";

const keyDownStopPropagation = (e: KeyboardEvent) => e.stopPropagation();

const btnClick = async () => {
  const inputValue = textAreaElement.value;
  button.disabled = true;
  try {
    const { text } = await chrome.runtime.sendMessage({
      action: "SHIFRONIM_ENCRYPT",
      text: inputValue,
    });
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.log(e.message);
    console.log("#CODE_CONTENT_BTN_CLICK");
  }

  button.disabled = false;
  textAreaElement.value = "";
};

const createShifronimTextField = () => {
  button.addEventListener("click", btnClick);
  textAreaElement.addEventListener("keydown", keyDownStopPropagation);

  container.id = "___SHIFRONIM_WRAPPER___";
  contentContainer.appendChild(textAreaElement);
  contentContainer.appendChild(button);

  shadowRoot.appendChild(contentContainer);

  document.body.prepend(container);
};
const removeShifronimTextField = () => {
  button.removeEventListener("click", btnClick);
  textAreaElement.removeEventListener("keydown", keyDownStopPropagation);

  container.remove();
};

const replaceTextToInitial = () => {
  const allEncrypted = document.querySelectorAll("[data-shifronim-encrypted]");
  allEncrypted.forEach((item: HTMLDivElement) => {
    for (let i = 0; i < item.childNodes.length; i++) {
      if (item.childNodes[i].nodeType === Node.TEXT_NODE) {
        item.childNodes[i].textContent = item.dataset.shifronimEncrypted;
      }
    }
    item.removeAttribute("data-shifronim-encrypted");
  });
};

async function replaceTextInElement(element) {
  if (element.nodeType === Node.TEXT_NODE) {
    if (element?.textContent?.includes("!?!SHIFRONIM!?!")) {
      if (
        element.parentElement.isContentEditable ||
        ["INPUT", "TEXTAREA"].indexOf(element.parentElement.tagName) >= 0
      )
        return;

      element.parentElement.dataset.shifronimEncrypted = element.textContent;
      const { text } = await chrome.runtime.sendMessage({
        action: "SHIFRONIM_DECRYPT",
        text: element.textContent,
      });

      if (text && element.parentElement) {
        element.textContent = text;
      }
    }
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    for (let i = 0; i < element.childNodes.length; i++) {
      await replaceTextInElement(element.childNodes[i]);
    }
  }
}

function watchForDynamicContent() {
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function (node) {
          replaceTextInElement(node);
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "START_SHIFR" && !observer) {
    createShifronimTextField();
    replaceTextInElement(document.body).then(() => {
      watchForDynamicContent();
      sendResponse({ success: true });
    });

    return true;
  }
  if (request.action === "STOP_SHIFR") {
    observer?.disconnect();
    observer = undefined;
    removeShifronimTextField();
    replaceTextToInitial();

    sendResponse({ success: true });
  }
});
