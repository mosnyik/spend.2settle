import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TransactionEndActions } from "@/components/chatbot/TransactionEndActions";
import useChatStore from "stores/chatStore";

beforeEach(() => {
  useChatStore.setState({ messages: [], serialized: [] });
});

afterEach(cleanup);

describe("transaction end actions", () => {
  it("retries the same transaction with its previous values and a fresh form", () => {
    const initialValues = {
      amount: "2500",
      crypto: "TRX",
      network: "TRC20",
    };

    render(
      <TransactionEndActions
        retryTransaction={{ paymentType: "gift", initialValues }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry transaction" }));

    const messages = useChatStore.getState().messages;
    expect(messages).toHaveLength(2);
    expect(messages[1].intent).toMatchObject({
      kind: "component",
      name: "GiftForm",
      props: { initialValues },
      persist: true,
    });
    expect(messages[1].intent?.kind === "component" && messages[1].intent.props?.formId)
      .toMatch(/^gift-/);
    expect(screen.getByRole("status").textContent).toContain(
      "A new transaction form has been opened below.",
    );
  });

  it("lets the user choose a different kind of new transaction", () => {
    render(<TransactionEndActions />);

    fireEvent.click(
      screen.getByRole("button", { name: "Create new transaction" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Send money" }));

    const messages = useChatStore.getState().messages;
    expect(messages[1].intent).toMatchObject({
      kind: "component",
      name: "TransferForm",
      persist: true,
    });
    expect(messages[1].intent?.kind === "component" && messages[1].intent.props?.formId)
      .toMatch(/^transfer-/);
  });
});
