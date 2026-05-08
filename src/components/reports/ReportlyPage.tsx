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
import { checkUserReports } from "@/helpers/api_call/reportly_page_calls";
import { sendOTPWithTwilio } from "@/helpers/api_call/history_page_calls";
import { reportData } from "@/types/reportly_types";
import ShortenedAddress from "../../helpers/ShortenAddress";
import TruncatedText from "../../helpers/TruncatedText";
import { Skeleton } from "../ui/skeleton";

type ToastType = "success" | "error" | "warning" | "info";
type AuthMethod = "wallet" | "phone";

export default function ReportlyPage() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<reportData[]>([]);

  const router = useRouter();
  const account = useAccount();
  const wallet = account.address;

  const populateReports = useCallback(
    async (phoneNumber?: string, walletAddress?: string) => {
      if (!phoneNumber && !walletAddress) {
        console.error(
          "Either phone number or wallet address must be provided."
        );
        return;
      }

      try {
        setIsLoading(true);
        const userReports = await checkUserReports(phoneNumber, walletAddress);

        if (userReports.exists && Array.isArray(userReports.reports)) {
          const newReports = userReports.reports.map((report, index) => {
            let complaint = report.complaint;

            switch (complaint) {
              case "Stolen funds | disappear funds":
                complaint = "Stolen funds | disappear funds";
                break;
              case "Track Transaction":
                complaint = "Track Transaction";
                break;
              case "Fraud":
                complaint = "Fraud";
                break;
              default:
                complaint = report.complaint;
            }
            return {
              id: index + 1,
              complaint: complaint,
              wallet_address: report.wallet_address,
              description: report.description,
              fraudster_wallet_address: report.fraudster_wallet_address,
              report_id: report.report_id,
              status: report.status,
            };
          });
          setReports(newReports);
        } else {
          console.log("No reports found for the user.");
          setReports([]);
        }
      } catch (error) {
        console.error("Error fetching user reports:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadReports = useCallback(async () => {
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
        await populateReports(storedPhone, undefined);
      } else if (storedAuthMethod === "wallet" && storedWallet) {
        await populateReports(undefined, storedWallet);
      }
    } else if (account.isConnected && account.address) {
      setIsAuthenticated(true);
      setAuthMethod("wallet");
      await populateReports(undefined, account.address);
    } else {
      setReports([]);
      setIsAuthenticated(false);
      setAuthMethod(null);
    }
    setIsLoading(false);
  }, [account.isConnected, account.address, populateReports]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadReports();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadReports]);

  const handleAuthentication = async (method: AuthMethod) => {
    setIsAuthenticated(true);
    setAuthMethod(method);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authMethod", method);
    if (method === "phone") {
      localStorage.setItem("phoneNumber", phoneNumber);
      await populateReports(phoneNumber, undefined);
    } else if (method === "wallet" && wallet) {
      localStorage.setItem("walletAddress", wallet);
      await populateReports(undefined, wallet);
    }
    reports.length > 0
      ? showToast("Here is your report history 😉 ", "success")
      : showToast("You need to do better jare, try do report!! 😔 ", "success");
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
    setReports([]);
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

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.complaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status?.toString().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || report.complaint?.toLowerCase() === filterType;
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

  const renderReportHistory = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-500">Reportly History</h1>
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
            placeholder="Search by complaint, report ID or status"
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
            <option value="all">All reports</option>
            <option value="stolen funds | disappear funds">Stolen funds</option>
            <option value="track transaction">Track Transaction</option>
            <option value="fraud">Fraud</option>
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
                    <th className="py-2 px-4 text-left">Complaint</th>
                    <th className="py-2 px-4 text-left">Affected Wallet</th>
                    <th className="py-2 px-4 text-left">Comment</th>
                    <th className="py-2 px-4 text-left">Fraudster Wallet</th>
                    <th className="py-2 px-4 text-left">Report ID</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, index) => (
                    <LoadingSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            ) : filteredReports.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-2 px-4 text-left">Complaint</th>
                    <th className="py-2 px-4 text-left">Affected Wallet</th>
                    <th className="py-2 px-4 text-left">Comment</th>
                    <th className="py-2 px-4 text-left">Fraudster Wallet</th>
                    <th className="py-2 px-4 text-left">Report ID</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports
                    .map((report) => (
                      <tr
                        key={report.report_id}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            {report.status === "pending" ? (
                              <ArrowUpwardIcon className="mr-2 h-4 w-4 text-red-500" />
                            ) : report.status === "processing" ? (
                              <ArrowUpwardIcon className="mr-2 h-4 w-4 text-yellow-800" />
                            ) : (
                              <ArrowDownwardIcon className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            {report.complaint}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <ShortenedAddress
                            wallet={report.wallet_address ?? ""}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <TruncatedText
                            text={report.description ?? ""}
                            maxLength={30}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <ShortenedAddress
                            wallet={report.fraudster_wallet_address ?? ""}
                          />
                        </td>
                        <td className="py-2 px-4">{report.report_id}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              report.status === "Successful"
                                ? "bg-green-200 text-green-800"
                                : report.status === "processing"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {report.status}
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
                No reports yet.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
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

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      {isAuthenticated ? renderReportHistory() : renderAuthenticationForm()}
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
