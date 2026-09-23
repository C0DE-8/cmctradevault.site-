import { useEffect } from "react";

const SMARTSUPP_KEY = "5687507bd691b294ca90956800e268b8b47fdeeb";
const SCRIPT_ID = "smartsupp-live-chat";

export default function SmartsuppChat() {
  useEffect(() => {
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_KEY;

    if (typeof window.smartsupp !== "function") {
      const queue = (...args) => queue._.push(args);
      queue._ = [];
      window.smartsupp = queue;
    }

    const showChat = () => window.smartsupp?.("chat:show");
    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      showChat();
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.async = true;
      script.src = "https://www.smartsuppchat.com/loader.js?";
      script.addEventListener("load", showChat, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      window.smartsupp?.("chat:hide");
    };
  }, []);

  return null;
}
