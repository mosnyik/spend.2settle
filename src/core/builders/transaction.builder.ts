import {
  BuilderTransaction,
  TransactionStatus,
} from "@/types/core_types/builder_types";

export class TransactionBuilder {
  private transaction: Partial<BuilderTransaction> = {
    status: "Uncompleted", // Default value
  };

  setCrypto(crypto: string) {
    this.transaction.crypto = crypto;
    return this;
  }

  setNetwork(network: string) {
    this.transaction.network = network;
    return this;
  }

  setEstimation(estimation: string) {
    this.transaction.estimation = estimation;
    return this;
  }

  setAmount(amount: string) {
    this.transaction.Amount = amount;
    return this;
  }

  setCharges(charges: string) {
    this.transaction.charges = charges;
    return this;
  }
  setStatus(status: TransactionStatus) {
    this.transaction.status = status;
    return this;
  }

  setModeOfPayment(mode: string) {
    this.transaction.mode_of_payment = mode;
    return this;
  }

  setBankAcctNumb(acct_number: string) {
    this.transaction.acct_number = acct_number;
    return this;
  }
  setBankName(bank_name: string) {
    this.transaction.bank_name = bank_name;
    return this;
  }
  setReceiverName(receiver_name: string) {
    this.transaction.receiver_name = receiver_name;
    return this;
  }

  setReceiverAmount(receiver_amount: string) {
    this.transaction.receiver_amount = receiver_amount;
    return this;
  }

  setCryptoSent(crypto_sent: string) {
    this.transaction.crypto_sent = crypto_sent;
    return this;
  }

  setWalletAddress(wallet_address: string | undefined) {
    this.transaction.wallet_address = wallet_address;
    return this;
  }

  setDate(date: string) {
    this.transaction.Date = date;
    return this;
  }

  setReceiverPhoneNumber(receiver: string) {
    this.transaction.receiver_phoneNumber = receiver;
    return this;
  }
  setCustomerPhoneNumber(customer: string) {
    this.transaction.customer_phoneNumber = customer;
    return this;
  }

  setTransacId(transac_id: string) {
    this.transaction.transac_id = transac_id;
    return this;
  }
  setRequestId(request_id: string) {
    this.transaction.request_id = request_id;
    return this;
  }
  setChatId(chat_id: string) {
    this.transaction.chat_id = chat_id;
    return this;
  }

  setCurrentRate(current_rate: string) {
    this.transaction.current_rate = current_rate;
    return this;
  }

  setMerchantRate(merchant_rate: string) {
    this.transaction.merchant_rate = merchant_rate;
    return this;
  }

  setProfitRates(profit_rate: string) {
    this.transaction.profit_rate = profit_rate;
    return this;
  }

  setName(name: string) {
    this.transaction.name = name;
    return this;
  }

  setAssetPrice(asset_price: string) {
    this.transaction.asset_price = asset_price;
    return this;
  }

  setSettleWalletLink(link: string | undefined) {
    this.transaction.settle_walletLink = link;
    return this;
  }

  setGiftStatus(gift_status: TransactionStatus | undefined) {
    this.transaction.gift_status = gift_status;
    return this;
  }
  setGiftChatID(gift_chatID: string) {
    this.transaction.gift_chatID = gift_chatID;
    return this;
  }

  setRefCode(ref_code: string) {
    this.transaction.ref_code = ref_code;
    return this;
  }

  setEffort(effort: string) {
    this.transaction.effort = effort;
    return this;
  }

  buildTransaction(): BuilderTransaction {
    // Validate required fields if needed here
    return this.transaction as BuilderTransaction;
  }
}
