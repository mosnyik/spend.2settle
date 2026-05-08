import React, { useState, useEffect } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SortIcon from "@mui/icons-material/Sort";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PasswordIcon from "@mui/icons-material/Password";

// Mock data (replace with actual implementation)
const initialFavorites = [
  {
    id: 1,
    name: "Taliat",
    accountNumber: "3077541243",
    bankName: "FIRST BANK OF NIGERIA",
    accountName: "TIJANI TALIAT ADEWALE",
    lastUsed: new Date("2024-04-01"),
  },
  {
    id: 2,
    name: "Osagie",
    accountNumber: "0101233148",
    bankName: "ACCESS BANK",
    accountName: "IGHO  DAVID OSAGIE",
    lastUsed: new Date("2023-03-28"),
  },
];
const initialBanks = [
  {
    id: 1,
    name: "",
    //  "My GTB",
    accountNumber: "0256019846",
    bankName: "GTBANK PLC",
    accountName: "IGHO  DAVID OSAGIE",
    lastUsed: new Date("2024-04-01"),
  },
  {
    id: 2,
    name: "My Access Bank",
    accountNumber: "0101233148",
    bankName: "ACCESS BANK",
    accountName: "IGHO  DAVID OSAGIE",
    lastUsed: new Date("2023-03-28"),
  },
];

const SettingsPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(false);
  const [pin, setPIN] = useState("");
  const [favorites, setFavorites] = useState(initialFavorites);
  const [banks, setBanks] = useState(initialBanks);
  const [newFavorite, setNewFavorite] = useState({
    name: "",
    accountNumber: "",
    bankName: "",
    accountName: "",
  });
  const [newBank, setNewBank] = useState({
    name: "",
    accountNumber: "",
    bankName: "",
    accountName: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    // Sort favorites by last used date on initial load
    sortFavorites();
  }, []);

  const playSound = (frequency: number, duration: number) => {
    if (!isSoundEnabled) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    playSound(440, 0.1);
  };
  const handlePINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPIN(e.target.value);
    playSound(440, 0.1);
  };

  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newFavorite.name &&
      newFavorite.accountNumber &&
      newFavorite.bankName &&
      newFavorite.accountName
    ) {
      setFavorites([
        ...favorites,
        { ...newFavorite, id: Date.now(), lastUsed: new Date() },
      ]);
      setNewFavorite({
        name: "",
        accountNumber: "",
        bankName: "",
        accountName: "",
      });
      sortFavorites();
    }
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
    playSound(220, 0.2); // Play a lower-pitched sound for removal
    sortFavorites();
  };
  const handleNewFavoriteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFavorite({ ...newFavorite, [e.target.name]: e.target.value });
    playSound(660, 0.05); // Play a short higher-pitched beep on input
  };

  const handleNewBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBank({ ...newBank, [e.target.name]: e.target.value });
    playSound(660, 0.05); // Play a short higher-pitched beep on input
  };
  const handleRemoveBank = (id: number) => {
    setBanks(banks.filter((bank) => bank.id !== id));
    playSound(220, 0.2); // Play a lower-pitched sound for removal
    // sortFavorites();
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newBank.name &&
      newBank.accountNumber &&
      newBank.bankName &&
      newBank.accountName
    ) {
      setBanks([
        ...banks,
        { ...newBank, id: Date.now(), lastUsed: new Date() },
      ]);
      setNewBank({
        name: "",
        accountNumber: "",
        bankName: "",
        accountName: "",
      });
      // sortFavorites();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    playSound(550, 0.15); // Play a theme toggle sound
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const sortFavorites = () => {
    setFavorites(
      [...favorites].sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
    );

    playSound(770, 0.1);
  };

  const verifyPhoneNumber = () => {
    setPhoneNumberVerified(true);
  };
  const setPINNumber = () => {
    setPhoneNumberVerified(true);
    alert("PIN set successfully");
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-500">Settings</h1>

        {/* ADD USER BANK ACCOUNTS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AccountBalanceIcon className="mr-2" /> Add Account
          </h2>
          <form onSubmit={handleAddBank} className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                name="name"
                value={newBank.name}
                onChange={handleNewBankChange}
                placeholder="Nickname (Optional)"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="accountNumber"
                value={newBank.accountNumber}
                onChange={handleNewBankChange}
                placeholder="Enter your account number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="bankName"
                value={newBank.bankName}
                onChange={handleNewBankChange}
                placeholder="Bank Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="accountName"
                value={newBank.accountName}
                onChange={handleNewBankChange}
                placeholder="Account Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Account
              </button>
            </div>
          </form>
          <ul className="space-y-2">
            {banks.map((bank) => (
              <li
                key={bank.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
              >
                <div>
                  {bank.name == "" ? (
                    ""
                  ) : (
                    <p className="font-semibold">{bank.name}</p>
                  )}
                  <p className="text-sm">
                    {bank.bankName} - {bank.accountNumber}
                  </p>
                  <p className="text-sm">{bank.accountName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last used: {bank.lastUsed.toLocaleDateString("en-GB")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveBank(bank.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* SET PIN  */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 space-y-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PasswordIcon className="mr-2" /> Set PIN
          </h2>
          <form
            onSubmit={phoneNumberVerified ? setPINNumber : verifyPhoneNumber}
            className="mb-4 space-y-2"
          >
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {phoneNumberVerified ? (
              <input
                type="text"
                value={pin}
                onChange={handlePINChange}
                placeholder="Enter your new pin(4-digits)"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            ) : null}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {phoneNumberVerified ? "Add PIN" : "Verify Phone Number"}
              </button>
            </div>
          </form>
        </div>

        {/* ADD FAVORITES */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <PersonAddIcon className="mr-2" /> Favorites
            </span>
            <button
              onClick={sortFavorites}
              className="text-blue-500 hover:text-blue-600"
            >
              <SortIcon />
            </button>
          </h2>
          <form onSubmit={handleAddFavorite} className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                name="name"
                value={newFavorite.name}
                onChange={handleNewFavoriteChange}
                placeholder="Nickname"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="accountNumber"
                value={newFavorite.accountNumber}
                onChange={handleNewFavoriteChange}
                placeholder="Account Number"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="bankName"
                value={newFavorite.bankName}
                onChange={handleNewFavoriteChange}
                placeholder="Bank Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="accountName"
                value={newFavorite.accountName}
                onChange={handleNewFavoriteChange}
                placeholder="Account Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex justify-center">
              {" "}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Favorite
              </button>
            </div>
          </form>
          <ul className="space-y-2">
            {favorites.map((favorite) => (
              <li
                key={favorite.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
              >
                <div>
                  <p className="font-semibold">{favorite.name}</p>
                  <p className="text-sm">
                    {favorite.bankName} - {favorite.accountNumber}
                  </p>
                  <p className="text-sm">{favorite.accountName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last used: {favorite.lastUsed.toLocaleDateString("en-GB")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* CHANGE APP THEME */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center">
              {isDarkMode ? (
                <Brightness7Icon className="mr-2" />
              ) : (
                <Brightness4Icon className="mr-2" />
              )}
              Theme
            </span>
            <button
              onClick={toggleSound}
              className="text-blue-500 hover:text-blue-600"
            >
              {isSoundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </button>
          </h2>
          <div className="flex justify-center">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </div>

        {/* RETURN TO HOME */}
        <div className="flex justify-center mt-6 mb-40">
          <button
            onClick={() => {
              window.history.back();
              isSoundEnabled ? playSound(330, 0.2) : null;
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
