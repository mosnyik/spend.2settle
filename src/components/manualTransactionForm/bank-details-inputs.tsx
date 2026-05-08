"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchBankNames, fetchBankDetails } from "@/services/bank/bank.service";

interface BankDetailsInputsProps {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  onBankSelect: (name: string, code: string) => void;
  onAccountNumberChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
}

interface BankSuggestion {
  name: string;
  code: string;
}

function parseBankItem(item: string): BankSuggestion {
  const clean = item.replace(/^\d+\.\s*/, "");
  const parts = clean.trim().split(" ");
  const code = parts[parts.length - 1];
  const name = parts.slice(0, -1).join(" ");
  return { name, code };
}

export function BankDetailsInputs({
  bankName,
  bankCode,
  accountNumber,
  accountName,
  onBankSelect,
  onAccountNumberChange,
  onAccountNameChange,
}: BankDetailsInputsProps) {
  const [searchTerm, setSearchTerm] = useState(bankName);
  const [suggestions, setSuggestions] = useState<BankSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced bank search
  useEffect(() => {
    if (!searchTerm || bankCode) return; // skip search if bank already selected

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const result = await fetchBankNames(searchTerm);
        const items: BankSuggestion[] = (result.message ?? []).map(parseBankItem);
        setSuggestions(items);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, bankCode]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleBankSelect = (bank: BankSuggestion) => {
    setSearchTerm(bank.name);
    setSuggestions([]);
    onBankSelect(bank.name, bank.code);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Clear previously selected bank if user edits the name
    if (bankCode) {
      onBankSelect("", "");
      onAccountNameChange("");
    }
    setResolveError("");
  };

  const handleResolve = async () => {
    if (!bankCode || accountNumber.length !== 10) return;
    setIsResolving(true);
    setResolveError("");
    try {
      const details = await fetchBankDetails(bankCode, accountNumber);
      if (details && details[0]) {
        onAccountNameChange(details[0].account_name);
      } else {
        setResolveError("Could not resolve account. Check details and retry.");
      }
    } catch {
      setResolveError("Could not resolve account. Check details and retry.");
    } finally {
      setIsResolving(false);
    }
  };

  // Clear resolved name when account number changes, then auto-resolve at 10 digits
  useEffect(() => {
    onAccountNameChange("");
    setResolveError("");
    if (bankCode && accountNumber.length === 10) {
      handleResolve();
    }
  }, [accountNumber, bankCode]);

  return (
    <>
      {/* Bank Search */}
      <div className="space-y-2 relative" ref={suggestionsRef}>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          placeholder="Search bank name..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          autoComplete="off"
        />
        {isSearching && (
          <p className="text-xs text-muted-foreground">Searching...</p>
        )}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
            {suggestions.map((bank) => (
              <button
                key={bank.code}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => handleBankSelect(bank)}
              >
                {bank.name}
              </button>
            ))}
          </div>
        )}
        {bankCode && (
          <p className="text-xs text-muted-foreground">Code: {bankCode}</p>
        )}
      </div>

      {/* Account Number */}
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          placeholder="Enter 10-digit account number"
          value={accountNumber}
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              onAccountNumberChange(e.target.value);
              setResolveError("");
            }
          }}
        />
      </div>

      {/* Account Name (auto-resolved) */}
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <div className="flex gap-2">
          <Input
            id="accountName"
            name="accountName"
            placeholder={isResolving ? "Resolving..." : "Auto-filled after resolve"}
            value={accountName}
            readOnly
            className="bg-muted"
          />
          {bankCode && accountNumber.length === 10 && !accountName && !isResolving && (
            <Button type="button" variant="outline" size="sm" onClick={handleResolve}>
              Resolve
            </Button>
          )}
        </div>
        {resolveError && <p className="text-xs text-red-500">{resolveError}</p>}
      </div>
    </>
  );
}
