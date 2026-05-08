import { apiURL } from "@/constants/constants";
import { TransactionTableData } from "@/types/transaction_types.ts/transaction_dashboard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useTransactionDashboardData = () => {
  return useQuery<{ transactions: TransactionTableData[] }, Error>({
    queryKey: ["dashboardData"],
    queryFn: () =>
      axios
        .get<{ transactions: TransactionTableData[] }>(
          `${apiURL}/api/history?status=Successful&limit=20`
        )
        .then((response) => {
          if (!response.data) throw new Error("No data received");
          return response.data;
        }),
  });
};

export default useTransactionDashboardData;
