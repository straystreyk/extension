import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [isOn, setIsOn] = useState(false);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  const turnOn = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_ACTIVATE", key },
      async (res) => {
        if (res.success) {
          setIsOn(true);
        }
        setLoading(false);
      }
    );
  };

  const turnOff = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: "SHIFRONIM_DEACTIVATE" },
      async (res) => {
        if (res.success) {
          setIsOn(false);
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const checkForActive = async () => {
      const res = await chrome.storage.local.get([
        "SHIFRONIM_IS_ACTIVE",
        "SHIFRONIM_MESSAGE_KEY",
      ]);
      if (res.SHIFRONIM_MESSAGE_KEY) setKey(res.SHIFRONIM_MESSAGE_KEY);
      setIsOn(!!res.SHIFRONIM_IS_ACTIVE);
    };

    checkForActive();
  }, []);

  return (
    <div id="___APP___">
      <h2 style={{ color: isOn ? "lightgreen" : "grey" }}>
        <>{isOn ? "Шифроним включен" : "Шифроним выключен"}</>
      </h2>

      <input
        disabled={isOn}
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      {key && (
        <button
          disabled={loading}
          onClick={() => (isOn ? turnOff() : turnOn())}
        >
          {isOn ? "Выключить" : "Включить"}
        </button>
      )}
    </div>
  );
}

export default App;
