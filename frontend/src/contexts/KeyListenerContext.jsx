import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
const KeyListenerContext = createContext();

// Context provider
export function KeyListenerProvider({ children }) {

    const [enabled, setEnabled] = useState(true);
    const [keydown, setKeyDown] = useState("");
    
    useEffect(() => {

      if (!enabled) return;


      const handleKeyDown = (e) => {
        console.log(e.key);
        setKeyDown(e.key);
        const tagName = e.target.tagName.toLowerCase();
        const isInput = tagName === "input" || tagName === "textarea" || e.target.isContentEditable;
        if (!isInput) {
        e.preventDefault();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [enabled]);


    const KeyListenerHandler = {
      enableListener: () => setEnabled(true),
      disableListener: () => setEnabled(false),
      isEnabled: enabled,
    };

    return (
      <KeyListenerContext.Provider value={[KeyListenerHandler, keydown, setKeyDown]}>
        {children}
      </KeyListenerContext.Provider>
    );
}

export default KeyListenerContext;