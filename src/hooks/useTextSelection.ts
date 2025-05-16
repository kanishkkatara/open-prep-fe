// src/hooks/useTextSelection.ts
import { useState, useEffect } from "react";

export function useTextSelection() {
  const [selectionInfo, setSelectionInfo] = useState<{
    text: string;
    rect: DOMRect | null;
  }>({ text: "", rect: null });

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionInfo({
          text: selection.toString(),
          rect,
        });
      } else {
        setSelectionInfo({ text: "", rect: null });
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return selectionInfo;
}
