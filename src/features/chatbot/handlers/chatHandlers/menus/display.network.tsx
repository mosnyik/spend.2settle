import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

export const displayNetwork = () => {
  const { next, addMessages } = useChatStore.getState();
  const { paymentMode } = usePaymentStore.getState();
  const isRequest = paymentMode.toLowerCase() === "payrequest";

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          select Network: <br />
          <br />
          1. ERC20 <br />
          2. TRC20 <br />
          3. BEP20
          <br /> <br />
          0. Go back <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  console.log("Next is payOptions");
  console.log({isRequest})
  isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });

  addMessages(newMessages);
};
