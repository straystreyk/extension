document.addEventListener("DOMContentLoaded", () => {
  let observer: MutationObserver | undefined = undefined;
  const div = document.createElement("div");
  const textAreaElement = document.createElement("input");
  const button = document.createElement("button");
  button.innerText = "Encrypt";

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

    div.id = "SHIFRONIM_TEXT_WRAPPER";
    div.style.cssText =
      "position: fixed; top: 0; left: 50%; z-index: 9999; transform: translateX(-50%); background-color: #000; padding: 20px";
    div.appendChild(textAreaElement);
    div.appendChild(button);

    document.body.prepend(div);
  };
  const removeShifronimTextField = () => {
    button.removeEventListener("click", btnClick);
    div.remove();
  };

  const replaceTextToInitial = () => {
    const allEncrypted = document.querySelectorAll(
      "[data-shifronim-encrypted]"
    );
    allEncrypted.forEach((item: HTMLDivElement) => {
      item.textContent = item.dataset.shifronimEncrypted;
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
        if (text && element.parentElement)
          element.parentElement.textContent = text;
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

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "START_SHIFR" && !observer) {
      createShifronimTextField();
      replaceTextInElement(document.body).then(() => {
        watchForDynamicContent();
        sendResponse({ success: true });
      });
    }
    if (request.action === "STOP_SHIFR") {
      observer?.disconnect();
      observer = undefined;
      removeShifronimTextField();
      replaceTextToInitial();
      sendResponse({ success: true });
    }

    return true;
  });
});
