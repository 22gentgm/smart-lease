"use client";

import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isInstalled) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333] text-white text-sm font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
      >
        <Download size={16} strokeWidth={2.5} />
        Get the App
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 pb-8 shadow-2xl animate-slide-up">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-4">
              Install SmartLease
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8200] text-white text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <p className="text-sm text-[#4B4B4B] pt-0.5">
                  Tap the{" "}
                  <Share
                    size={14}
                    className="inline text-[#007AFF] -mt-0.5"
                  />{" "}
                  <strong>Share</strong> button in Safari&apos;s toolbar
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8200] text-white text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <p className="text-sm text-[#4B4B4B] pt-0.5">
                  Scroll down and tap{" "}
                  <strong>&quot;Add to Home Screen&quot;</strong>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8200] text-white text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <p className="text-sm text-[#4B4B4B] pt-0.5">
                  Tap <strong>&quot;Add&quot;</strong> — that&apos;s it!
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="text-xs text-[#6B6B6B] bg-[#FAF8F5] rounded-lg px-4 py-2">
                SmartLease will appear as an app on your home screen
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
