import useChatStore from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import {
  displayEnterAccountNumber,
  displaySearchBank,
  displaySelectBank,
} from "./menus/display.bank.search";
import { fetchBankNames } from "@/services/bank/bank.service";
import { useBankStore } from "stores/bankStore";
import { displayCharge } from "./menus/display.charge";

// Search banks by name keyword — handles the enterBankSearchWord step
export const handleSearchBank = async (chatInput: string) => {
  const { next, prev, addMessages, setLoading } = useChatStore.getState();
  const { setBankList, setBankNames } = useBankStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput.trim() === "00") {
    helloMenu("hi");
  } else if (chatInput.trim() === "0") {
    prev();
  } else {
    let bankList: string[] = [];
    try {
      setLoading(true);
      const result = await fetchBankNames(chatInput.trim());
      bankList = result["message"] ?? [];
      setBankList(bankList);
      const bankNameList = bankList.map((bank: string) =>
        bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, ""),
      );
      setBankNames(bankNameList);
    } catch (error) {
      console.error("Failed to fetch bank names:", error);
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              Bank not found. Please check the name and try again.
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      return;
    } finally {
      setLoading(false);
    }

    displaySelectBank();
    next({ stepId: "enterAccountNumber" });
  }
};

// HELP USER SELECT BANK FROM LIST
export const handleSelectBank = async (chatInput: string) => {
  const { next, prev, addMessages } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      prev();
      //TODO: replace the chatInput with the provided amount
      displayCharge(chatInput);
    })();
  } else if (chatInput != "0") {
    const { setBankList, setBankNames } = useBankStore.getState();
    const { setLoading } = useChatStore.getState();
    let bankList: string[] = [];

    try {
      setLoading(true);
      const bankNames = await fetchBankNames(chatInput.trim());

      if (bankNames) {
        bankList = bankNames["message"];
        setBankList(bankList);
      }

      if (Array.isArray(bankList)) {
        const bankNameList = bankList.map((bank: string) =>
          bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, ""),
        );
        setBankNames(bankNameList);
      } else {
        bankList = [];
        console.error("The fetched bank names are not in the expected format.");
      }
    } catch (error) {
      console.error("Failed to fetch bank names:", error);
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              There was an error fetching your bank. <br />
              Please check to be sure the bank is a valid Nigerian Bank or MSB,
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      return;
    } finally {
      setLoading(false);
    }

    displaySelectBank();
    next({ stepId: "enterAccountNumber" });
  }
};

//GET USER BANK DATA AFTER COLLECTING ACCOUNT NUMBER
export const handleBankAccountNumber = (chatInput: string) => {
  const { prev, next } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("THIS IS WHERE WE ARE");

      prev();
      displaySelectBank();
    })();
  } else if (chatInput != "0") {
    console.log(chatInput.trim());

    displayEnterAccountNumber(chatInput);
    next({ stepId: "continueToPay" });
  }
};
