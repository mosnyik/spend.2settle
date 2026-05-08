"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Snackbar,
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloseIcon from "@mui/icons-material/Close";
import { phoneNumberPattern } from "@/utils/utilities";
import {
  checkUserHasHistory,
  sendOTPWithTwilio,
} from "@/helpers/api_call/history_page_calls";
import { Skeleton } from "../ui/skeleton";
import { PaginationInfo } from "@/types/history_types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
};

type ToastType = "success" | "error" | "warning" | "info";
type AuthMethod = "wallet" | "phone";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userOTPEntry, setUserOTPEntry] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const router = useRouter();
  const account = useAccount();
  const wallet = account.address;

  const populateHistory = useCallback(
    async (phoneNumber?: string, walletAddress?: string) => {
      if (!phoneNumber && !walletAddress) {
        console.error(
          "Either phone number or wallet address must be provided."
        );
        return;
      }

      try {
        setIsLoading(true);
        const userHistory = await checkUserHasHistory(
          phoneNumber,
          walletAddress,
          currentPage,
          itemsPerPage
        );

        if (userHistory.exists && Array.isArray(userHistory.transactions)) {
          const newTransactions = userHistory.transactions.map(
            (transaction, index) => ({
              id: index + 1,
              type: transaction.mode_of_payment,
              amount: transaction.Amount,
              currency: transaction.crypto,
              date: transaction.Date,
              status: transaction.status,
            })
          );
          setTransactions(newTransactions);
          setPaginationInfo(userHistory.pagination);
        } else {
          console.log("No transactions found for the user.");
          setTransactions([]);
          setPaginationInfo({
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  const loadTransactions = useCallback(async () => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedAuthMethod = localStorage.getItem(
      "authMethod"
    ) as AuthMethod | null;
    const storedPhone = localStorage.getItem("phoneNumber");
    const storedWallet = localStorage.getItem("walletAddress");

    if (storedAuth === "true" && storedAuthMethod) {
      setIsAuthenticated(true);
      setAuthMethod(storedAuthMethod);
      if (storedAuthMethod === "phone" && storedPhone) {
        setPhoneNumber(storedPhone);
        await populateHistory(storedPhone, undefined);
      } else if (storedAuthMethod === "wallet" && storedWallet) {
        await populateHistory(undefined, storedWallet);
      }
    } else if (account.isConnected && account.address) {
      setIsAuthenticated(true);
      setAuthMethod("wallet");
      await populateHistory(undefined, account.address);
    } else {
      setTransactions([]);
      setIsAuthenticated(false);
      setAuthMethod(null);
    }
    setIsLoading(false);
  }, [account.isConnected, account.address, populateHistory]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadTransactions();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadTransactions]);

  const handleAuthentication = async (method: AuthMethod) => {
    setIsAuthenticated(true);
    setAuthMethod(method);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authMethod", method);
    if (method === "phone") {
      localStorage.setItem("phoneNumber", phoneNumber);
      await populateHistory(phoneNumber, undefined);
    } else if (method === "wallet" && wallet) {
      localStorage.setItem("walletAddress", wallet);
      await populateHistory(undefined, wallet);
    }
    showToast(
      transactions.length > 0
        ? "Here is your transaction history 😉 "
        : "You need to do better jare, try do transaction!! 😔 ",
      "success"
    );
  };

  const handleWalletAuthentication = async () => {
    if (account.isConnected && wallet) {
      await handleAuthentication("wallet");
    }
  };

  const sendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (phoneNumber !== "") {
      if (!phoneNumberPattern.test(phoneNumber)) {
        showToast("Please enter a valid Phone number.", "error");
        return;
      }
      try {
        const generatedOTP = await sendOTPWithTwilio(phoneNumber);
        setOtp(generatedOTP);
        setOtpSent(true);
        showToast(`OTP sent to ${phoneNumber}`, "success");
      } catch (error) {
        console.error("Error sending OTP:", error);
        showToast("Failed to send OTP. Please try again.", "error");
      }
    } else {
      showToast("You must enter a Phone number.", "error");
    }
  };

  const verifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (userOTPEntry === otp) {
      if (otpSent) {
        setUserOTPEntry("");
      }
      await handleAuthentication("phone");
    } else {
      showToast("Invalid OTP. Please try again.", "error");
    }
  };

  const showToast = (message: string, type: ToastType = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleCloseToast = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  const getToastColor = (type: ToastType) => {
    const colors = {
      success: "bg-green-600",
      error: "bg-red-600",
      warning: "bg-yellow-600",
      info: "bg-blue-600",
    };
    return colors[type] || colors.info;
  };

  const handleSwitchAccount = () => {
    setIsAuthenticated(false);
    setOtpSent(false);
    setPhoneNumber("");
    setOtp("");
    setUserOTPEntry("");
    setAuthMethod(null);
    setTransactions([]);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authMethod");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("walletAddress");
    showToast("Please authenticate again", "info");
  };

  const LoadingSkeleton = () => (
    <tr className="border-b last:border-b-0">
      <td className="py-2 px-4">
        <Skeleton className="h-6 w-24" />
      </td>
      <td className="py-2 px-4">
        <Skeleton className="h-6 w-20" />
      </td>
      <td className="py-2 px-4">
        <Skeleton className="h-6 w-16" />
      </td>
      <td className="py-2 px-4">
        <Skeleton className="h-6 w-24" />
      </td>
      <td className="py-2 px-4">
        <Skeleton className="h-6 w-20" />
      </td>
    </tr>
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setItemsPerPage(event.target.value as number);
    setCurrentPage(1);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.currency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date?.includes(searchTerm) ||
      transaction.amount?.toString().includes(searchTerm);
    const matchesType =
      filterType === "all" || transaction.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const renderAuthenticationForm = () => (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100 flex items-center justify-center">
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            className="text-center"
          >
            Authentication Required
          </Typography>
          {!otpSent ? (
            <form onSubmit={sendOTP}>
              <TextField
                type="tel"
                label="Enter your phone number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4"
              />
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                className="text-center"
              >
                Or
              </Typography>
              <div
                className="mb-3 text-white pl-14"
                style={{ backgroundColor: "rgb(13, 118, 252)" }}
              >
                <ConnectButton />
              </div>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="text-white font-bold"
                style={{ backgroundColor: "rgb(13, 118, 252)" }}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOTP}>
              <TextField
                type="text"
                label="Enter OTP"
                variant="outlined"
                fullWidth
                value={userOTPEntry}
                onChange={(e) => setUserOTPEntry(e.target.value)}
                className="mb-4"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="text-white"
                style={{ backgroundColor: "rgb(13, 118, 252)" }}
              >
                Verify OTP
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactionHistory = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-500">
          Transaction History
        </h1>
        <Button
          variant="outlined"
          onClick={handleSwitchAccount}
          className="text-blue-500 border-blue-500 text-xs md:text-lg"
        >
          Switch Account
        </Button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <TextField
            type="text"
            placeholder="Search by amount, crypto or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <TextField
            select
            fullWidth
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="all">All Transactions</option>
            <option value="paid">Paid</option>
            <option value="received">Received</option>
            <option value="gifts sent">Gifts Sent</option>
            <option value="gifts received">Gifts Received</option>
          </TextField>
        </div>
      </div>
      <Card>
        <CardContent>
          <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {isLoading ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Crypto</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <LoadingSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            ) : filteredTransactions.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Crypto</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            {transaction.type === "Paid" ||
                            transaction.type === "Gifts Sent" ? (
                              <ArrowUpwardIcon className="mr-2 h-4 w-4 text-red-500" />
                            ) : (
                              <ArrowDownwardIcon className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            {transaction.type}
                          </div>
                        </td>
                        <td className="py-2 px-4">{transaction.amount}</td>
                        <td className="py-2 px-4">{transaction.currency}</td>
                        <td className="py-2 px-4">{transaction.date}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === "Successful"
                                ? "bg-green-200 text-green-800"
                                : transaction.status === "Pending" ||
                                  transaction.status === "Processing"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                    .reverse()}
                </tbody>
              </table>
            ) : (
              <Typography
                variant="body1"
                align="center"
                sx={{ py: 4 }}
                className="text-blue-500 font-semibold text-lg"
              >
                No transactions yet.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      {renderPagination()}
      <div className="mt-6 flex justify-center mb-30">
        <Button
          variant="contained"
          onClick={() => {
            router.push("/");
            showToast("Returning to Home", "info");
          }}
        >
          Back to Home
        </Button>
      </div>
    </>
  );

  // const renderPagination = () => (
  //   <div className="mt-4 flex justify-between items-center">
  //     <Pagination>
  //       <PaginationContent>
  //         <PaginationItem>
  //           <PaginationPrevious
  //             onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
  //             aria-disabled={currentPage === 1}
  //             className={
  //               currentPage === 1 ? "pointer-events-none opacity-50" : ""
  //             }
  //           />
  //         </PaginationItem>
  //         {Array.from(
  //           { length: paginationInfo.totalPages },
  //           (_, i) => i + 1
  //         ).map((page) => (
  //           <PaginationItem key={page}>
  //             <PaginationLink
  //               href="#"
  //               onClick={() => handlePageChange(page)}
  //               isActive={currentPage === page}
  //             >
  //               {page}
  //             </PaginationLink>
  //           </PaginationItem>
  //         ))}
  //         <PaginationItem>
  //           <PaginationNext
  //             onClick={() =>
  //               handlePageChange(
  //                 Math.min(paginationInfo.totalPages, currentPage + 1)
  //               )
  //             }
  //             aria-disabled={currentPage === paginationInfo.totalPages}
  //             className={
  //               currentPage === paginationInfo.totalPages
  //                 ? "pointer-events-none opacity-50"
  //                 : ""
  //             }
  //           />
  //         </PaginationItem>
  //       </PaginationContent>
  //     </Pagination>
  //     {/* <TextField
  //       select
  //       value={itemsPerPage}
  //       onChange={handleItemsPerPageChange}
  //       label="Items per page"
  //       variant="outlined"
  //       size="small"
  //     >
  //       <option value={10}>10</option>
  //       <option value={20}>20</option>
  //       <option value={50}>50</option>
  //     </TextField> */}
  //     <div className="mt-4 flex justify-end">
  //       <Select
  //         value={itemsPerPage.toString()}
  //         onValueChange={(value) => {
  //           setItemsPerPage(parseInt(value));
  //           setCurrentPage(1);
  //           // fetchTransactions(1, parseInt(value));
  //         }}
  //       >
  //         <SelectTrigger className="w-[100px]">
  //           <SelectValue />
  //         </SelectTrigger>
  //         <SelectContent>
  //           <SelectItem value="10">10 / page</SelectItem>
  //           <SelectItem value="20">20 / page</SelectItem>
  //           <SelectItem value="50">50 / page</SelectItem>
  //         </SelectContent>
  //       </Select>
  //     </div>
  //   </div>
  // );

  const renderPagination = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationEllipsis />;

    // const handlePageChange = (page) => {
    //   if (page !== currentPage) {
    //     setCurrentPage(page);
    //     // fetchTransactions(page, itemsPerPage);
    //   }
    // };

    if (paginationInfo.totalPages <= maxVisiblePages) {
      // If total pages are less than max visible pages, show all
      for (let i = 1; i <= paginationInfo.totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Add first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Start ellipsis
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">{ellipsis}</PaginationItem>
        );
      }

      // Dynamic range in the middle
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(paginationInfo.totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // End ellipsis
      if (currentPage < paginationInfo.totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">{ellipsis}</PaginationItem>
        );
      }

      // Add last page
      items.push(
        <PaginationItem key={paginationInfo.totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(paginationInfo.totalPages)}
            isActive={currentPage === paginationInfo.totalPages}
          >
            {paginationInfo.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <div className="mt-4 flex flex-col items-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {items}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(paginationInfo.totalPages, currentPage + 1)
                  )
                }
                aria-disabled={currentPage === paginationInfo.totalPages}
                className={
                  currentPage === paginationInfo.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="mt-4 flex justify-end">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      {isAuthenticated
        ? renderTransactionHistory()
        : renderAuthenticationForm()}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        message={toastMessage}
        ContentProps={{
          className: `${getToastColor(toastType)} text-white`,
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseToast}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}
