import { Result } from "@/types/general_types";
import { useBankStore } from "stores/bankStore";
import useChatStore, { MessageType } from "stores/chatStore";

export const displaySearchBank = async () => {
  const { addMessages } = useChatStore.getState();

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter the first three letters of your Bank name.
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  console.log("Next is selectBank");
  addMessages(newMessages);
};

export const displaySelectBank = () => {
  const { addMessages } = useChatStore.getState();
  const { setBankCodes, bankList } = useBankStore.getState();

  const results: Result[] = [];
  var bankCodes: string[] = [];

  bankList.forEach((bank) => {
    console.log({ bank });
    const match = bank.match(/^(\d+\.\s.+)\s(\d+)$/);
    console.log("each bank match", match);
    if (match) {
      results.push({
        name: match[1],
        code: match[2],
      });
    }
  });
  // console.log({ bankList });
  // console.log({ results });

  if (results.length === 0) {
    const retryMessages: MessageType[] = [
      {
        type: "incoming",
        content: "No banks matched your input. Please try again:",
        timestamp: new Date(),
      },
    ];
    addMessages(retryMessages);

    return;
  }

  const bankOptions = results.map((result, index) => (
    <span key={index}>
      {result.name}
      <br />
    </span>
  ));

  results.map((result, index) => {
    bankCodes.push(results[index].code);
  });

  setBankCodes(bankCodes);
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: "Enter the number of your bank:",
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: <span>{bankOptions}</span>,
      timestamp: new Date(),
    },
  ];
  console.log("Next is enterAccountNumber");
  addMessages(newMessages);
};

export const displayEnterAccountNumber = (input: string) => {
  const { bankCodes, bankNames, setSelectedBankCode, setSelectedBankName } =
    useBankStore.getState();
  const { addMessages } = useChatStore.getState();

  if (input.trim() !== "0") {
    // console.log("The length of sharedBankCode is: ", bankCodes.length);
    var parsedInput = parseInt(input.trim());

    // Check if the parsed input is within the valid range
    if (parsedInput > 0 && parsedInput <= bankCodes.length) {
      // console.log("Bank code is: ", bankCodes[parsedInput - 1]);
      // console.log("Bank name is: ", bankNames[parsedInput - 1]);
      setSelectedBankName(bankNames[parsedInput - 1]);
      setSelectedBankCode(bankCodes[parsedInput - 1]);
    } else {
      // The selected bank is not in the list
      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: <span>Please make sure you choose from the list</span>,
          timestamp: new Date(),
        },
      ];
      addMessages(newMessages);
      return;
    }
  } else {
    // The selected bank is not in the list
    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: <span>Please make sure you choose from the list</span>,
        timestamp: new Date(),
      },
    ];
    addMessages(newMessages);
    return;
  }

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter the account number you'd like to receive the payment
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is continueToPay");

  addMessages(newMessages);
};
