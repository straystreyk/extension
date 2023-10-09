// Генерация пары ключей и сохранение их в storage
export const generateAndStoreKeyPairs = async () => {
  try {
    // Генерируем пару ключей для шифрования и расшифровки
    const encryptionKeyPair = await self.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Преобразовываем ключи в формат, который можно сохранить в storage
    const encryptionPublicKeyExport = await self.crypto.subtle.exportKey(
      "spki",
      encryptionKeyPair.publicKey
    );
    const encryptionPrivateKeyExport = await self.crypto.subtle.exportKey(
      "pkcs8",
      encryptionKeyPair.privateKey
    );

    // преобразуем в вид строки
    const encryptionPublicKeyExportString = btoa(
      String.fromCharCode.apply(null, new Uint8Array(encryptionPublicKeyExport))
    );
    const encryptionPrivateKeyExportString = btoa(
      String.fromCharCode.apply(
        null,
        new Uint8Array(encryptionPrivateKeyExport)
      )
    );

    // Сохраняем ключи в Storage
    await chrome.storage.local.set({
      publicKey: encryptionPublicKeyExportString,
      privateKey: encryptionPrivateKeyExportString,
    });
  } catch (error) {
    console.error("Ошибка при генерации и сохранении ключей:", error);
  }
};

// Функция для загрузки ключей из storage
export const loadKeyPairsFromStorage = async () => {
  try {
    const {
      publicKey: encryptionPublicKeyData,
      privateKey: encryptionPrivateKeyData,
    } = await chrome.storage.local.get(["publicKey", "privateKey"]);

    if (!encryptionPublicKeyData || !encryptionPrivateKeyData) {
      console.error("Ключи не найдены в storage.");
      return null;
    }

    const encryptionPublicKeyArray = new Uint8Array(
      Array.from(atob(encryptionPublicKeyData), (c) => c.charCodeAt(0))
    );
    const encryptionPrivateKeyArray = new Uint8Array(
      Array.from(atob(encryptionPrivateKeyData), (c) => c.charCodeAt(0))
    );

    const encryptionPublicKey = await self.crypto.subtle.importKey(
      "spki",
      encryptionPublicKeyArray,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );

    const encryptionPrivateKey = await self.crypto.subtle.importKey(
      "pkcs8",
      encryptionPrivateKeyArray,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );

    return { encryptionPublicKey, encryptionPrivateKey };
  } catch (error) {
    console.error("Ошибка при извлечении и импорте ключей из storage:", error);
    return null;
  }
};

// Пример использования ключей для шифрования и дешифрования
export const encryptRSAMessage = async (text: string, key: string) => {
  const encryptionPublicKeyArray = new Uint8Array(
    Array.from(atob(key), (c) => c.charCodeAt(0))
  );

  const encryptionPublicKey = await self.crypto.subtle.importKey(
    "spki",
    encryptionPublicKeyArray,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );

  if (encryptionPublicKey) {
    // Шифрование
    const encryptedData = await self.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      encryptionPublicKey,
      new TextEncoder().encode(text)
    );

    return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedData)));
  }

  return "";
};

export const decryptRSAMessage = async (message: string) => {
  const keyPairs = await loadKeyPairsFromStorage();

  const encryptedData = new Uint8Array(
    Array.from(atob(message), (c) => c.charCodeAt(0))
  );

  // Дешифрование
  const decryptedData = await self.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    keyPairs.encryptionPrivateKey,
    encryptedData
  );

  const decryptedText = new TextDecoder().decode(decryptedData);
  return decryptedText;
};

// Вызов функций для создания, сохранения и использования ключей
// generateAndStoreKeyPairs().then(() => exampleUsage("kaif"));
