import { useEffect, useState } from "react";
import { TronWeb } from "tronweb";

export function useTronWeb() {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined" && window.tronWeb) {
        const tron = window.tronWeb;
        setIsInstalled(true);

        if (tron.defaultAddress.base58) {
          setTronWeb(tron);
          setIsReady(true);

          console.log("TronWeb initialized:", tron.defaultAddress.base58);
        }
      }
    };

    check();

    const interval = setInterval(() => {
      if (!isReady) check();
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);
  return { tronWeb, isInstalled, isReady };
}
