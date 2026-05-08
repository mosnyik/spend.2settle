import { MdKeyboardArrowDown, MdContentCopy, MdLogout } from "react-icons/md";
import { connectXverseWallet } from "@/helpers/btc/connect_btc_wallet";
import ShortenedAddress from "../../helpers/ShortenAddress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBTCWallet } from "stores/btcWalletStore";

const ConnectBTCButton = () => {
  const { paymentAddress, isConnected, disconnect } = useBTCWallet();

  const handleConnectXverse = async () => {
    try {
      await connectXverseWallet();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async () => {
    if (paymentAddress) {
      await navigator.clipboard.writeText(paymentAddress);
      alert("Copied");
    }
  };

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center bg-white px-6 py-1 rounded-xl text-base font-bold border-gray-100 border-2">
            <img
              src="https://img.icons8.com/color/20/000000/bitcoin--v1.png"
              alt="BTC"
              className="h-5 w-5 mr-4"
            />
            Bitcoin
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-gray-100 px-4 py-1 rounded-xl text-base font-bold border-white border-2">
                <div className="flex items-center gap-1">
                  <ShortenedAddress wallet={paymentAddress} />
                  <MdKeyboardArrowDown />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center text-xl font-bold">
                    BTC Wallet
                  </div>
                </DialogTitle>

                <DialogDescription>
                  <div className="text-center mb-4">
                    <div className="text-sm mt-1 font-bold text-black">
                      <ShortenedAddress wallet={paymentAddress} />
                    </div>
                  </div>
                  <div className="flex justify-around mt-6">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <MdContentCopy />
                      Copy
                    </button>
                    <button
                      onClick={disconnect}
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <MdLogout />
                      Disconnect
                    </button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <button
          onClick={handleConnectXverse}
          className="bg-transparent text-white"
        >
          Connect Xverse
        </button>
      )}
    </div>
  );
};

export default ConnectBTCButton;
