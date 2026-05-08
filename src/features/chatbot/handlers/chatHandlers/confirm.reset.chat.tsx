import { StepId } from "@/core/machines/steps";
import { redisplayStepMenu } from "@/utils/redisplayStepMenu";
import useChatStore from "stores/chatStore";
import { proceedWithWelcome } from "./menus/welcome";
import { greetings } from "../../helpers/ChatbotConsts";

/**
 * Handle user's choice when they have an ongoing transaction and said "hi"
 * 1. Start fresh (reset current transaction)
 * 2. Continue with current transaction
 */
export const handleConfirmResetChat = (chatInput: string) => {
  const { addMessages, prev, stepHistory } = useChatStore.getState();
  const choice = chatInput.trim();

  // If user says hi again, just re-show the confirmation
  if (greetings.includes(choice.toLowerCase())) {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Please choose an option:
            <br />
            <br />
            1. Start fresh (reset current transaction) <br />
            2. Continue with current transaction
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    return;
  }

  if (choice === "1") {
    // User wants to reset - proceed with normal welcome flow
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Alright! Let&apos;s start fresh.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    proceedWithWelcome();
  } else if (choice === "2" || choice === "0") {
    // User wants to continue with current transaction
    // Get the step before confirmResetChat (the one they were on)
    const previousStepIndex = stepHistory.length - 2;
    const previousStep = previousStepIndex >= 0
      ? stepHistory[previousStepIndex]
      : null;

    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Okay, let&apos;s continue where you left off.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);

    // Go back to previous step
    prev();

    // Redisplay the menu for the previous step so user knows what to do
    if (previousStep?.stepId) {
      redisplayStepMenu(previousStep.stepId as StepId);
    }
  } else {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Invalid choice. Please reply with:
            <br />
            <br />
            1. Start fresh (reset current transaction) <br />
            2. Continue with current transaction
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};
