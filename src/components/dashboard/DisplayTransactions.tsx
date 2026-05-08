import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import useTransactionDashboardData from "@/hooks/dashboard/useTransactionDashboardData";
import DashboardFilteredTransactions from "./DashboardFilteredTransactions";


const DisplayTransactions = () => {
  const { data: filteredTransactions, isLoading, isError } =
    useTransactionDashboardData();

  const hasTransactions =
    filteredTransactions?.transactions &&
    filteredTransactions.transactions.length > 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Tx Type</TableHead>
          <TableHead className="hidden md:table-cell">Tx ID</TableHead>
          <TableHead>Naira Amount</TableHead>
          <TableHead>Crypto Amount</TableHead>
          <TableHead className="hidden md:table-cell">Rate</TableHead>
          <TableHead className="hidden md:table-cell">Charge</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // <DashboardSkeleton />
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Loading...
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-4">
              Unable to load transactions. Please try again later.
            </TableCell>
          </TableRow>
        ) : hasTransactions ? (
          <DashboardFilteredTransactions
            filteredTransactions={filteredTransactions}
          />
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-4">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DisplayTransactions;
