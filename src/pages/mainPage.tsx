import { memo, useEffect, useState } from "react";
import { useAppStore } from "../helpers/store";
import { MainSection } from "../components/mainSection";

export const MainPage = memo(() => {
  const { setIsOn } = useAppStore();
  const [url, setUrl] = useState("");

  const isPermissionDenied = !url || url.includes("chrome:");

  useEffect(() => {
    const checkForActive = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const activeTab = tabs?.[0];
        const url = activeTab.url || "";
        setUrl(url);
        const res = await chrome.storage.local.get(["SHIFRONIM_ACTIVE_TABS"]);

        if (!res.SHIFRONIM_ACTIVE_TABS || !activeTab.id) return;

        res.SHIFRONIM_ACTIVE_TABS[activeTab?.id]
          ? setIsOn(true)
          : setIsOn(false);
      });
    };

    checkForActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isPermissionDenied ? (
        <h2 style={{ textAlign: "center" }}>
          На этой странице расширение&nbsp;недоступно
        </h2>
      ) : (
        <>
          <MainSection />
        </>
      )}
    </>
  );
});
