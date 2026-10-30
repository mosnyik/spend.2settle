"use client";

import React, { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import useChatStore, { type MessageType } from "stores/chatStore";

export type RetryableTransactionType = "transfer" | "gift" | "request";

export type RetryTransactionConfig = {
  paymentType: RetryableTransactionType;
  initialValues?: object;
};

const TRANSACTION_FORMS: Record<
  RetryableTransactionType,
  { component: string; title: string; action: string }
> = {
  transfer: {
    component: "TransferForm",
    title: "Enter your transfer details below.",
    action: "Send money",
  },
  gift: {
    component: "GiftForm",
    title: "Enter your gift details below.",
    action: "Create gift",
  },
  request: {
    component: "RequestPaymentForm",
    title: "Enter your payment request details below.",
    action: "Request payment",
  },
};

const createFormId = (type: RetryableTransactionType) =>
  `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function TransactionEndActions({
  retryTransaction,
}: {
  retryTransaction?: RetryTransactionConfig;
}) {
  const [choosingNewType, setChoosingNewType] = useState(false);
  const [started, setStarted] = useState(false);

  const startTransaction = (
    paymentType: RetryableTransactionType,
    initialValues?: object,
    outgoingLabel?: string,
  ) => {
    const form = TRANSACTION_FORMS[paymentType];
    const messages: MessageType[] = [
      {
        type: "outgoing",
        content: <span>{outgoingLabel ?? form.action}</span>,
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: <span>{form.title}</span>,
        intent: {
          kind: "component",
          name: form.component,
          props: {
            initialValues,
            formId: createFormId(paymentType),
          },
          persist: true,
        },
        timestamp: new Date(),
      },
    ];

    useChatStore.getState().addMessages(messages);
    setStarted(true);
  };

  if (started) {
    return (
      <p role="status" className="text-[11px] font-medium text-green-700">
        A new transaction form has been opened below.
      </p>
    );
  }

  return (
    <div
      aria-label="Transaction actions"
      className="border-t border-gray-100 pt-2.5"
    >
      <p className="mb-2 text-[11px] text-gray-600">
        What would you like to do next?
      </p>

      {!choosingNewType ? (
        <div className="grid grid-cols-2 gap-2">
          {retryTransaction && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                startTransaction(
                  retryTransaction.paymentType,
                  retryTransaction.initialValues,
                  "Retry transaction",
                )
              }
              className="h-9 border-blue-200 px-2 text-xs text-blue-700 hover:bg-blue-50"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Retry transaction
            </Button>
          )}
          <Button
            type="button"
            onClick={() => setChoosingNewType(true)}
            className={`h-9 bg-blue-500 px-2 text-xs text-white hover:bg-blue-600 ${
              retryTransaction ? "" : "col-span-2"
            }`}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Create new transaction
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(TRANSACTION_FORMS) as RetryableTransactionType[]).map(
            (paymentType) => (
              <Button
                key={paymentType}
                type="button"
                variant="outline"
                onClick={() => startTransaction(paymentType)}
                className="h-auto min-h-9 whitespace-normal border-blue-200 px-1.5 py-2 text-[10px] leading-4 text-blue-700 hover:bg-blue-50"
              >
                {TRANSACTION_FORMS[paymentType].action}
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
