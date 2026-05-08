import { StepId } from "@/core/machines/steps";
import useChatStore from "stores/chatStore";

/**
 * Mapping of step IDs to their display functions.
 * These functions show the menu/options for each step without advancing to the next step.
 */
const stepDisplayFunctions: Partial<Record<StepId, () => void>> = {
  makeAChoice: () => redisplayMakeChoice(),
  chooseTransactionType: () => redisplayTransactCrypto(),
  transactCrypto: () => redisplayTransactCrypto(),
  network: () => redisplayNetwork(),
  payOptions: () => redisplayPaymentOptions(),
  charge: () => redisplayCharge(),
  enterBankSearchWord: () => redisplayBankSearch(),
  selectBank: () => redisplayBankSearch(),
  enterAccountNumber: () => redisplayContinueToPay(),
  continueToPay: () => redisplayContinueToPay(),
  enterPhone: () => redisplayEnterPhone(),
  claimGift: () => redisplayEnterId(),
  payRequest: () => redisplayEnterId(),
};

// Redisplay functions that show the menu without calling next()
function redisplayMakeChoice() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          What would you like to do?
          <br />
          <br />
          1. Transact Crypto
          <br />
          2. Request for paycard
          <br />
          3. Customer support
          <br />
          4. Transaction ID
          <br />
          5. Reportly
          <br />
          0. Back
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayTransactCrypto() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Choose a transaction type:
          <br />
          <br />
          1. Transfer (send crypto to bank)
          <br />
          2. Gift (send crypto as gift)
          <br />
          3. Request (request payment)
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayNetwork() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Select Network:
          <br />
          <br />
          1. ERC20
          <br />
          2. TRC20
          <br />
          3. BEP20
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayPaymentOptions() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          How do you want to estimate your payment?
          <br />
          <br />
          1. In Naira
          <br />
          2. In Dollar
          <br />
          3. In Crypto
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayCharge() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Enter the amount you want to send:
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayBankSearch() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Enter bank name to search:
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayContinueToPay() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Enter your account number:
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayEnterPhone() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Enter your phone number:
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

function redisplayEnterId() {
  const { addMessages } = useChatStore.getState();
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          Enter the ID to continue:
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}

/**
 * Redisplay the menu for a given step without advancing to the next step.
 * This is useful when the user wants to continue their current transaction.
 */
export const redisplayStepMenu = (stepId: StepId) => {
  const displayFn = stepDisplayFunctions[stepId];

  if (displayFn) {
    displayFn();
  } else {
    // Fallback: show a generic message
    const { addMessages } = useChatStore.getState();
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Please continue with your input:
            <br />
            <br />
            0. Go back
            <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};
