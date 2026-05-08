"use client";

import Link from "next/link";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ConnectWallet from "../crypto/ConnectWallet";

type NavItem = {
  name: string;
  href: string;
  target?: "_blank" | "_self";
};

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "History", href: "/history" },
  { name: "Reportly", href: "/reportly" },
  { name: "Settings", href: "/setting" },
  { name: "Virtual Card", href: "/virtual-card" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Term of service", href: "/terms" },
  {
    name: "2settle Market",
    href: "https://market.2settle.io/",
    target: "_blank",
  },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState({
    settings: false,
    logout: false,
  });
  const { data: session, status } = useSession();

  // Check if the user is authenticated
  const isAuthorized = () => {
    if (status === "authenticated" && session) {
      return true;
    }
    return false;
    // return true
  };

  const handleSettingsClick = () => {
    if (isAuthorized()) {
      router.push("/new-transaction");
    } else {
      router.push("/login");
    }
  };

  return (
    <footer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10%]  bg-white mx-[10%] my-[5%]">
        {/* Left Section */}
        <div className=" col-span-1 justify-self-start max-w-sm text-start md:text-left">
          <div className="flex text-left justify-start items-left h-8 mb-4 ml-0">
            <Logo />
          </div>
          <p className="text-grey-600 mt-2 text-sm">
            Seamless, user friendly experience for both senders and receivers,
            with advanced security to prevent fraud and hacking.
          </p>
          <div className="flex items-center ">
            <Link
              href="https://x.com/2SettleHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-500  transition-colors duration-150 group"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="16"
                height="16"
                className="fill-black hover:fill-white transition-colors duration-150"
              >
                <path d="M4.01758,4l9.07422,13.60938l-8.75586,10.39063h2.61523l7.29492,-8.65625l5.77148,8.65625h0.53516h7.46289l-9.30273,-13.95703l8.46289,-10.04297h-2.61523l-7.00195,8.31055l-5.54102,-8.31055zM7.75586,6h3.19141l13.33203,20h-3.19141z" />
              </svg>
            </Link>
            <Link
              href="https://www.instagram.com/2settlehq/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 transition-colors duration-150 group"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 50"
                width="16"
                height="16"
                className="fill-black hover:fill-white transition-colors duration-150"
              >
                <path d="M16,3c-7.17,0 -13,5.83 -13,13v18c0,7.17 5.83,13 13,13h18c7.17,0 13,-5.83 13,-13v-18c0,-7.17 -5.83,-13 -13,-13zM37,11c1.1,0 2,0.9 2,2c0,1.1 -0.9,2 -2,2c-1.1,0 -2,-0.9 -2,-2c0,-1.1 0.9,-2 2,-2zM25,14c6.07,0 11,4.93 11,11c0,6.07 -4.93,11 -11,11c-6.07,0 -11,-4.93 -11,-11c0,-6.07 4.93,-11 11,-11zM25,16c-4.96,0 -9,4.04 -9,9c0,4.96 4.04,9 9,9c4.96,0 9,-4.04 9,-9c0,-4.96 -4.04,-9 -9,-9z" />
              </svg>
            </Link>
            <Link
              href="https://snapchat.com/t/chUlQmUr"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full hover:bg-yellow-500 transition-colors"
              aria-label="Snapchat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 50"
                width="16"
                height="16"
                className="fill-black hover:fill-white transition-colors duration-150"
              >
                <path d="M46.77344,35.07813c-5.80469,-0.95703 -8.45703,-6.96875 -8.54297,-7.16406c-0.01172,-0.03516 -0.03906,-0.09766 -0.05469,-0.13281c-0.17578,-0.35156 -0.35156,-0.84766 -0.20312,-1.19922c0.25391,-0.60156 1.46094,-0.98437 2.18359,-1.21484c0.25391,-0.08203 0.49609,-0.15625 0.68359,-0.23047c1.75391,-0.69531 2.62891,-1.60156 2.60938,-2.70312c-0.01562,-0.88672 -0.69531,-1.69922 -1.69531,-2.05078c-0.34766,-0.14844 -0.74609,-0.22266 -1.14844,-0.22266c-0.27344,0 -0.6875,0.03906 -1.08594,0.22266c-0.66797,0.3125 -1.25391,0.48047 -1.67187,0.5c-0.08984,-0.00391 -0.16797,-0.01172 -0.23437,-0.02344l0.04297,-0.6875c0.19531,-3.10937 0.44141,-6.98437 -0.60937,-9.33984c-3.10156,-6.94141 -9.67187,-7.48047 -11.61328,-7.48047l-0.88281,0.00781c-1.9375,0 -8.49609,0.53906 -11.58984,7.47656c-1.05078,2.35547 -0.80859,6.22656 -0.60937,9.33984l0.00781,0.11719c0.01172,0.19141 0.02344,0.38281 0.03516,0.56641c-0.43359,0.07813 -1.28125,-0.06641 -2.16016,-0.47656c-1.19531,-0.55859 -3.34766,0.17969 -3.64453,1.74219c-0.13281,0.69141 0.02734,2.00391 2.57422,3.00781c0.19141,0.07813 0.42969,0.15234 0.6875,0.23438c0.71875,0.23047 1.92578,0.60938 2.17969,1.21484c0.14844,0.35156 -0.02734,0.84766 -0.23437,1.27344c-0.10937,0.25391 -2.74609,6.26563 -8.5625,7.22266c-0.74219,0.12109 -1.26953,0.77734 -1.23047,1.53516c0.01172,0.19922 0.0625,0.39844 0.14453,0.59375c0.52734,1.23828 2.44531,2.08984 6.02344,2.67188c0.0625,0.21094 0.13281,0.52344 0.17188,0.69531c0.07422,0.35547 0.15625,0.71484 0.26563,1.08984c0.10547,0.35547 0.46875,1.17969 1.60156,1.17969c0.34375,0 0.71875,-0.07422 1.12109,-0.15234c0.59375,-0.11719 1.33594,-0.26172 2.28906,-0.26172c0.53125,0 1.07813,0.04688 1.62891,0.13672c1.01563,0.16797 1.93359,0.82031 3,1.57031c1.66406,1.17969 3.55078,2.51172 6.47656,2.51172c0.07813,0 0.15625,-0.00391 0.23047,-0.00781c0.10547,0.00391 0.21484,0.00781 0.32422,0.00781c2.92578,0 4.8125,-1.33594 6.48047,-2.51172c1.01563,-0.72266 1.97656,-1.39844 2.99609,-1.57031c0.55078,-0.08984 1.09766,-0.13672 1.62891,-0.13672c0.91797,0 1.64453,0.11719 2.29297,0.24609c0.46094,0.08984 0.82813,0.13281 1.16797,0.13281c0.75781,0 1.33984,-0.43359 1.55078,-1.16016c0.10938,-0.36719 0.1875,-0.72266 0.26563,-1.08203c0.03125,-0.13281 0.10547,-0.46875 0.17188,-0.69141c3.57813,-0.58203 5.49609,-1.43359 6.01953,-2.66016c0.08594,-0.19531 0.13281,-0.39844 0.14844,-0.60937c0.03906,-0.74609 -0.48828,-1.40234 -1.23047,-1.52734z" />
              </svg>
            </Link>
            <Link
              href="https://www.threads.net/@2settlehq/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full hover:bg-gray-900 transition-colors"
              aria-label="Threads"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="4 8 40 28"
                width="16"
                height="16"
                className="fill-black hover:fill-white transition-colors duration-150"
              >
                <path d="M11.5,6c-3.01977,0 -5.5,2.48023 -5.5,5.5v3.16016c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-3.16016c0,-1.39823 1.10177,-2.5 2.5,-2.5h25c1.39823,0 2.5,1.10177 2.5,2.5v13.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-13.5c0,-3.01977 -2.48023,-5.5 -5.5,-5.5zM24.16211,12.00195c-3.519,0.024 -6.2305,1.21597 -8.0625,3.54297c-1.614,2.053 -2.44756,4.8948 -2.47656,8.4668c0.028,3.551 0.86156,6.39136 2.47656,8.44336c1.831,2.327 4.54403,3.51897 8.08203,3.54297c3.128,-0.021 5.33897,-0.84778 7.16797,-2.67578c2.43,-2.428 2.35378,-5.4737 1.55078,-7.3457c-0.58,-1.352 -1.67678,-2.44606 -3.17578,-3.16406c-0.035,-0.018 -0.07142,-0.03378 -0.10742,-0.05078c-0.264,-3.38 -2.21392,-5.32275 -5.41992,-5.34375c-1.944,0 -3.56445,0.83552 -4.56445,2.35352c-0.112,0.17 -0.06744,0.39862 0.10156,0.51563l1.66797,1.14453c0.083,0.057 0.1852,0.07759 0.2832,0.05859c0.098,-0.019 0.18719,-0.07811 0.24219,-0.16211c0.604,-0.915 1.56788,-1.10547 2.29688,-1.10547c0.886,0.005 1.54403,0.25047 1.95703,0.73047c0.223,0.259 0.39372,0.59777 0.51172,1.00977c-0.757,-0.091 -1.5623,-0.11245 -2.4043,-0.06445c-3.106,0.179 -5.1038,2.01908 -4.9668,4.58008c0.069,1.306 0.71908,2.43102 1.83008,3.16602c0.918,0.605 2.09727,0.90494 3.32227,0.83594c1.621,-0.089 2.89602,-0.71252 3.79102,-1.85352c0.573,-0.729 0.95973,-1.62461 1.17773,-2.72461c0.422,0.341 0.73178,0.74036 0.92578,1.19336c0.455,1.058 0.47888,2.80047 -0.95312,4.23047c-1.294,1.293 -2.86323,1.85409 -5.24023,1.87109c-2.642,-0.02 -4.63201,-0.85824 -5.91602,-2.49023c-1.219,-1.55 -1.85005,-3.80613 -1.87305,-6.70312c0.023,-2.903 0.65405,-5.16094 1.87305,-6.71094c1.284,-1.632 3.27416,-2.47123 5.91016,-2.49024c2.665,0.02 4.69234,0.86381 6.02734,2.50781c0.653,0.804 1.15333,1.8223 1.48633,3.0293c0.055,0.198 0.26098,0.31467 0.45898,0.26367l1.95508,-0.52148c0.097,-0.025 0.17852,-0.08978 0.22852,-0.17578c0.049,-0.088 0.06116,-0.19011 0.03516,-0.28711c-0.431,-1.585 -1.11516,-2.9608 -2.03516,-4.0918c-1.882,-2.315 -4.62106,-3.50139 -8.16406,-3.52539zM7.47656,18.88281c-0.82766,0.01293 -1.48844,0.69381 -1.47656,1.52148v16.0957c0,3.01977 2.48023,5.5 5.5,5.5h25c3.01977,0 5.5,-2.48023 5.5,-5.5v-3.71289c0.00765,-0.54095 -0.27656,-1.04412 -0.74381,-1.31683c-0.46725,-0.27271 -1.04514,-0.27271 -1.51238,0c-0.46725,0.27271 -0.75146,0.77588 -0.74381,1.31683v3.71289c0,1.39823 -1.10177,2.5 -2.5,2.5h-25c-1.39823,0 -2.5,-1.10177 -2.5,-2.5v-16.0957c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852zM25.12305,24.67383c0.597,0 1.16626,0.04662 1.69727,0.14063c-0.284,2.414 -1.41605,2.80914 -2.49805,2.86914c-0.742,0.029 -1.4298,-0.15639 -1.8418,-0.52539c-0.251,-0.225 -0.3873,-0.50503 -0.4043,-0.83203c-0.038,-0.721 0.56319,-1.52781 2.36719,-1.63281c0.23,-0.013 0.45669,-0.01953 0.67969,-0.01953z" />
              </svg>
            </Link>

            {/* Settings Icon */}
            <div className="relative inline-block">
              <button
                onClick={handleSettingsClick}
                onMouseEnter={() =>
                  setShowTooltip((prevState) => ({
                    ...prevState,
                    settings: true,
                  }))
                }
                onMouseLeave={() =>
                  setShowTooltip((prevState) => ({
                    ...prevState,
                    settings: false,
                  }))
                }
                className="p-2 rounded-full hover:text-[#19485F]/70 focus:outline-none hover:bg-gray-200 transition-colors"
                aria-label="Add Transaction Manually - Admin Only"
              >
                <Settings size={16} className="text-black" />
              </button>
              {showTooltip.settings && isAuthorized() ? (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 shadow-md z-50 whitespace-nowrap w-max">
                  Add Transaction Manually
                </div>
              ) : (
                showTooltip.settings && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 shadow-md z-50 whitespace-nowrap w-max">
                    Login to access
                  </div>
                )
              )}
            </div>

            {/* Logout Button - Only visible when logged in */}
            {isAuthorized() && (
              <div className="relative">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  onMouseEnter={() =>
                    setShowTooltip((prevState) => ({
                      ...prevState,
                      logout: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setShowTooltip((prevState) => ({
                      ...prevState,
                      logout: false,
                    }))
                  }
                  className="p-2 bg-white rounded-full hover:text-red-500 focus:outline-none hover:bg-gray-200 transition-colors ml-1"
                  aria-label="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black hover:text-red-500"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  {showTooltip?.logout && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2  bg-blue-600 text-white text-xs rounded px-2 py-1 shadow-md z-10 whitespace-nowrap">
                      Logout
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Link</h3>
          <nav className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target ?? "_self"}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-1 text-xs sm:text-sm md:text-base lg:text-lg font-medium",
                  pathname === item.href
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-black hover:border-blue-500 hover:text-blue-500"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="space-y-4 col-span-1 justify-self-start">
          <h3 className=" text-2xl font-bold">Spend Now</h3>

          <ConnectWallet />
        </div>
      </div>
    </footer>
  );
}
