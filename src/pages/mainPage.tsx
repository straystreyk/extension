import { memo, useEffect, useState } from "react";
import { useAppStore } from "../helpers/store";
import { MainSection } from "../components/mainSection";
import { RsaSection } from "../components/rsaSection";

export const MainPage = memo(() => {
  const { setIsOn } = useAppStore();
  const [url, setUrl] = useState("");

  const isPermissionDenied = !url || url.includes("chrome:");

  useEffect(() => {
    const checkForActive = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs?.[0].url || "";
        setUrl(url);
      });
      const res = await chrome.storage.local.get(["SHIFRONIM_IS_ACTIVE"]);

      setIsOn(!!res.SHIFRONIM_IS_ACTIVE);
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
          {/*<RsaSection />*/}
          <MainSection />
        </>
      )}
    </>
  );
});
