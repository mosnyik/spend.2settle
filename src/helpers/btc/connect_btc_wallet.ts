import { AddressPurpose, request } from "sats-connect";
import { useBTCWallet } from "../../../stores/btcWalletStore";

export async function connectXverseWallet(): Promise<boolean> {
  try {
    const response = await request("getAccounts", {
      purposes: [
        AddressPurpose.Payment,
        AddressPurpose.Ordinals,
        AddressPurpose.Stacks,
      ],
      message: "Please connect your Xverse Wallet to proceed.",
    });

    if (response.status === "success") {
      const addresses = response.result;

      const paymentAddress = addresses.find(
        (addr) => addr.purpose === AddressPurpose.Payment
      )?.address;
      const ordinalsAddress = addresses.find(
        (addr) => addr.purpose === AddressPurpose.Ordinals
      )?.address;
      const stacksAddress = addresses.find(
        (addr) => addr.purpose === AddressPurpose.Stacks
      )?.address;

      useBTCWallet.getState().setWallet({
        paymentAddress: paymentAddress || "",
        ordinalsAddress: ordinalsAddress || "",
        stacksAddress: stacksAddress || "",
      });
      // return { paymentAddress, ordinalsAddress, stacksAddress };
      return true;
    } else {
      console.log("Error:", response.error);
      // throw new Error(response.error.message);
      if (response.error.code === -32000) {
        throw new Error("User rejected the connection request.");
      } else {
        throw new Error(response.error.message);
      }
    }
  } catch (error) {
    console.error("Connection error", error);
    throw error;
  }
}
