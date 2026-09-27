"use client";

import { useEffect, useState } from "react";
import LogisticsWishPopup from "./LogisticsWishPopup";

type PublicPopupSettings = {
  popupEnabled: boolean;
  popupImageUrl: string;
  popupTitle: string;
};

export default function LogisticsWishPopupHost() {
  const [settings, setSettings] = useState<PublicPopupSettings>({
    popupEnabled: false,
    popupImageUrl: "",
    popupTitle: "",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/logistics/settings?public=1", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok || !json.success || cancelled) return;

        const d = json.data || {};
        setSettings({
          popupEnabled: Boolean(d.popupEnabled),
          popupImageUrl: String(d.popupImageUrl || "").trim(),
          popupTitle: String(d.popupTitle || "").trim(),
        });
      } catch {
        /* ignore — no popup */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LogisticsWishPopup
      enabled={settings.popupEnabled}
      imageUrl={settings.popupImageUrl}
      title={settings.popupTitle || undefined}
    />
  );
}