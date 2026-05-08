import { z } from "zod";
import { amountStr, dateField, longStr, shortStr } from "./helpers";

export const payerSchema = z
  .object({
    chat_id: shortStr(50).optional(),
    customer_phoneNumber: shortStr(20).optional(),
  })
  .superRefine((val, ctx) => {
    const hasValue = Object.values(val).some(
      (v) => v !== undefined && v !== null && v !== "",
    );

    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payer must have at least one identifier",
      });
    }
  });

// const payerSchema = z.object({
//   chat_id: shortStr(50),
//   customer_phoneNumber: shortStr(20),
// });

export const receiverSchema = z
  .object({
    acct_number: shortStr(20).optional(),
    bank_name: shortStr(50).optional(),
    receiver_name: shortStr(80).optional(),
    receiver_phoneNumber: shortStr(20).optional(),
    is_vendor: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const hasValue = Object.values(val).some(
      (v) => v !== undefined && v !== null && v !== "",
    );

    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Receiver must have at least one field",
      });
    }
  });

export const summarySchema = z
  .object({
    transaction_type: shortStr(30).optional(),
    total_dollar: amountStr().optional(),
    total_naira: amountStr().optional(),
    effort: shortStr(50).optional(),
    merchant_id: shortStr(50).optional(),
    ref_code: shortStr(50).optional(),
    asset_price: amountStr().optional(),
    status: shortStr(20).optional(),
  })
  .superRefine((val, ctx) => {
    const hasValue = Object.values(val).some(
      (v) => v !== undefined && v !== null && v !== "",
    );

    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Summary must have at least one field",
      });
    }
  });

//   const receiverSchema = z.object({
//   acct_number: shortStr(20).optional(),
//   bank_name: shortStr(50).optional(),
//   receiver_name: shortStr(100).optional(),
//   receiver_phoneNumber: shortStr(20).optional(),
//   is_vendor: z.boolean().optional(),
// });

export const transferSchema = z
  .object({
    crypto: shortStr(20).optional(),
    network: shortStr(20).optional(),
    estimate_asset: shortStr(20).optional(),

    amount_payable: amountStr().optional(),
    crypto_amount: amountStr().optional(),
    estimate_amount: amountStr().optional(),
    charges: amountStr().optional(),

    date: dateField.optional(),
    transfer_id: shortStr(50).optional(),

    current_rate: amountStr().optional(),
    merchant_rate: amountStr().optional(),
    profit_rate: amountStr().optional(),

    wallet_address: longStr(120).optional(),
    status: shortStr(20).optional(),

    payer: payerSchema,

    receiver: receiverSchema,
    summary: summarySchema,
  })
  .superRefine((val, ctx) => {
    const { payer, receiver, summary, ...transfer } = val;

    const hasTransferField = Object.values(transfer).some(
      (v) => v !== undefined && v !== null && v !== "",
    );

    if (!hasTransferField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one transfer field must be provided",
      });
    }
  });

//   const transferSchema = z.object({
//   crypto: shortStr(20).optional(),
//   network: shortStr(20).optional(),
//   estimate_asset: shortStr(20).optional(),

//   amount_payable: amountStr().optional(),
//   crypto_amount: amountStr().optional(),
//   estimate_amount: amountStr().optional(),
//   charges: amountStr().optional(),

//   date: dateField,
//   transfer_id: shortStr(50).optional(),

//   receiver_id: shortStr(50).optional(),
//   payer_id: shortStr(50).optional(),

//   current_rate: amountStr().optional(),
//   merchant_rate: amountStr().optional(),
//   profit_rate: amountStr().optional(),

//   wallet_address: longStr(120).optional(),
//   status: shortStr(20).optional(),
// });

export const giftSchema = z
  .object({
    gift_id: shortStr(50).optional(),
    gift_status: shortStr(20).optional(),
    crypto: shortStr(20).optional(),
    network: shortStr(20).optional(),
    estimate_asset: shortStr(20).optional(),
    estimate_amount: amountStr().optional(),
    amount_payable: amountStr().optional(),
    charges: amountStr().optional(),
    crypto_amount: amountStr().optional(),
    date: dateField,

    receiver_id: z.number().optional(),
    payer_id: z.number().optional(),

    current_rate: amountStr().optional(),
    merchant_rate: amountStr().optional(),
    profit_rate: amountStr().optional(),

    wallet_address: longStr(120).optional(),
    status: shortStr(20).optional(),

    payer: payerSchema,

    summary: summarySchema,
  })
  .superRefine((val, ctx) => {
    const { payer, summary, ...gift } = val;

    const hasgiftField = Object.values(gift).some(
      (v) => v !== undefined && v !== null && v !== "",
    );

    if (!hasgiftField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one gift field must be provided",
      });
    }
  });

export const requestSchema = z
  .object({
    request_id: shortStr(50).optional(),
    request_status: shortStr(20).optional(),

    crypto: shortStr(20).optional(),
    network: shortStr(20).optional(),
    estimate_asset: shortStr(20).optional(),

    estimate_amount: amountStr().optional(),
    amount_payable: amountStr().optional(),
    charges: amountStr().optional(),
    crypto_amount: amountStr().optional(),

    date: dateField,

    // receiver_id: z.number().optional(),
    // payer_id: z.number().optional(),

    current_rate: amountStr().optional(),
    merchant_rate: amountStr().optional(),
    profit_rate: amountStr().optional(),

    wallet_address: longStr(120).optional(),
    status: shortStr(20).optional(),

    receiver: receiverSchema,
    summary: summarySchema,
  })
  .superRefine((val, ctx) => {
    const { receiver, summary, ...request } = val;

    const hasRequestField = Object.values(request).some(
      (v) => v !== undefined && v !== null && v !== "",
    );

    if (!hasRequestField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one request field must be provided",
      });
    }
  });

// export const summarySchema = z.object({
//   total_dollar: amountStr().optional(),
//   total_naira: amountStr().optional(),
//   effort: shortStr(50).optional(),
//   merchant_id: z.number().optional(),
//   ref_code: shortStr(50).optional(),
//   asset_price: amountStr().optional(),
//   status: shortStr(20).optional(),
// });

export const giftUpdateSchema = z
  .object({
    gift_id: giftSchema.shape.gift_id,
    receiver: receiverSchema.optional(),
    giftUpdates: giftSchema.partial(),
  })
  .refine(
    (data) => data.giftUpdates && Object.keys(data.giftUpdates).length > 0,
    { message: "No gift fields to update", path: ["giftUpdates"] },
  );

export const requestUpdateSchema = requestSchema
  .partial()
  .extend({
    request_id: requestSchema.shape.request_id,
  })
  .refine(
    (data) => {
      const { request_id, ...updates } = data;
      return Object.keys(updates).length > 0;
    },
    {
      message: "No fields provided to update",
      path: ["request_id"],
    },
  );


