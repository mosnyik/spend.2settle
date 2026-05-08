import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionTableData } from "@/types/transaction_types.ts/transaction_dashboard";
import { formatCurrency } from "@/helpers/format_currency";
import { getFormattedDateTime } from "@/helpers/format_date";
import { capitalize } from "lodash";

interface Props {
  filteredTransactions:
    | {
        transactions: TransactionTableData[];
      }
    | undefined;
}



const DashboardFilteredTransactions = ({ filteredTransactions }: Props) => {
  return filteredTransactions?.transactions
    .slice(0, 20)
    .map((transaction, index) => (
      <TableRow key={index} className="text-black">
        <TableCell>{getFormattedDateTime(transaction.date) || "N/A"}</TableCell>
        <TableCell>
          {capitalize(transaction.transaction_type) || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {transaction.transac_id || "N/A"}
        </TableCell>
        <TableCell>
          {formatCurrency(transaction.amount_payable!, "NGN", "en-NG") || "N/A"}
        </TableCell>
        <TableCell>
          {`${transaction.crypto_amount} ${transaction.crypto}` || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {formatCurrency(transaction.current_rate!, "NGN", "en-NG") || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {/* {`${transaction.charges} ${transaction.crypto}` || "N/A"}m */}
          {formatCurrency(transaction.charges!, "NGN", "en-NG") || "N/A"}
        </TableCell>
      </TableRow>
    ));
};

export default DashboardFilteredTransactions;
