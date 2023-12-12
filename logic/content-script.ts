let observer: MutationObserver | undefined = undefined;
const container = document.createElement("div");
const shadowRoot = container?.attachShadow({
  mode: "open",
  delegatesFocus: true,
});
const contentContainer = document.createElement("div");
const textAreaElement = document.createElement("div");
const button = document.createElement("button");

contentContainer.setAttribute("part", "shifronim-content-div");
contentContainer.classList.add("shifronim-content-div");
textAreaElement.setAttribute("part", "shifronim-content-textarea");
textAreaElement.classList.add("shifronim-content-textarea");
textAreaElement.contentEditable = "true";
button.setAttribute("part", "shifronim-content-button");
button.classList.add("shifronim-content-button");
button.innerText = "Зашифровать";
const prefix = "!?!SHIFRONIM!?!";

const keyDownStopPropagation = (e: KeyboardEvent) => {
  e.stopPropagation();
};

const btnClick = async () => {
  const inputValue = textAreaElement.innerText;
  if (!inputValue) return;

  try {
    button.disabled = true;
    const { text } = await chrome.runtime.sendMessage({
      action: "SHIFRONIM_ENCRYPT",
      text: inputValue,
    });
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.log(e.message);
    console.log("#CODE_CONTENT_BTN_CLICK");
  }

  button.innerText = "Скопировано в буфер обмена";

  setTimeout(() => {
    button.innerText = "Зашифровать";
    button.disabled = false;
  }, 1000);

  textAreaElement.innerText = "";
};

const createShifronimTextField = () => {
  const shifronimApp = document.getElementById("___SHIFRONIM_WRAPPER___");
  const shifronimAlreadyInPage = !!shifronimApp;
  if (shifronimAlreadyInPage) shifronimApp.remove();

  button.addEventListener("click", btnClick);
  textAreaElement.addEventListener("keydown", keyDownStopPropagation);
  document.body.addEventListener("keydown", keyDownStopPropagation, true);
  window.addEventListener("keydown", keyDownStopPropagation, true);
  textAreaElement.addEventListener("keypress", keyDownStopPropagation);
  document.body.addEventListener("keypress", keyDownStopPropagation, true);
  window.addEventListener("keypress", keyDownStopPropagation, true);

  container.id = "___SHIFRONIM_WRAPPER___";
  contentContainer.appendChild(textAreaElement);
  contentContainer.appendChild(button);

  shadowRoot.appendChild(contentContainer);

  document.body.prepend(container);
};
const removeShifronimTextField = () => {
  button?.removeEventListener("click", btnClick);
  textAreaElement?.removeEventListener("keydown", keyDownStopPropagation);
  document?.body?.removeEventListener("keydown", keyDownStopPropagation, true);
  window?.removeEventListener("keydown", keyDownStopPropagation, true);
  textAreaElement?.removeEventListener("keypress", keyDownStopPropagation);
  document?.body?.removeEventListener("keypress", keyDownStopPropagation, true);
  window?.removeEventListener("keypress", keyDownStopPropagation, true);

  container.remove();
};

const replaceTextToInitial = () => {
  const allEncrypted = document.querySelectorAll("[data-shifronim-encrypted]");
  allEncrypted.forEach((item: HTMLDivElement) => {
    item.classList.remove("SHIFRONIM_ENCRYPTED_MESSAGE");
    for (let i = 0; i < item.childNodes.length; i++) {
      if (item.childNodes[i].nodeType === Node.TEXT_NODE) {
        item.childNodes[i].textContent = item.dataset
          .shifronimEncrypted as string;
      }
    }
    item.removeAttribute("data-shifronim-encrypted");
  });
};

async function replaceTextInElement(element: HTMLElement, pr: string = prefix) {
  if (element.nodeType === Node.TEXT_NODE) {
    if (element?.textContent?.includes(pr)) {
      if (
        element?.parentElement?.isContentEditable ||
        ["INPUT", "TEXTAREA"].indexOf(
          (element.parentElement as HTMLElement).tagName
        ) >= 0
      )
        return;
      (element?.parentElement as HTMLElement).classList.add(
        "SHIFRONIM_ENCRYPTED_MESSAGE"
      );
      (element.parentElement as HTMLElement).dataset.shifronimEncrypted =
        element.textContent;

      const { text } = await chrome.runtime.sendMessage({
        action: "SHIFRONIM_DECRYPT",
        text: element.textContent,
        prefix: pr,
      });

      if (text && element.parentElement) {
        element.textContent = text;
      }
    }
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    for (let i = 0; i < element.childNodes.length; i++) {
      await replaceTextInElement(element.childNodes[i] as HTMLElement, pr);
    }
  }
}

function watchForDynamicContent(prefix: string) {
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function (node) {
          replaceTextInElement(node as HTMLElement, prefix);
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "START_SHIFR" && !observer) {
    createShifronimTextField();
    replaceTextInElement(document.body, request.prefix).then(() => {
      watchForDynamicContent(request.prefix);
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
