// "use client";

// import { useState, useCallback } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X } from "lucide-react";
// import Logo from "./Logo";
// import { cn } from "@/lib/utils";
// import ConnectWallet from "../crypto/ConnectWallet";
// import { useMediaQuery } from "../dashboard/Body";

// const navigation = [
//   { name: "Transact", href: "/transact" },
//   { name: "History", href: "/history" },
//   { name: "Reportly", href: "/reportly" },
//   { name: "Settings", href: "/setting" },
//   { name: "Virtual Card", href: "/virtual-card" },
// ] as const;

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const isMobile = useMediaQuery("(max-width: 425px)");
//   const isTab = useMediaQuery("(max-width: 768px)");

//   const toggleMenu = useCallback(() => {
//     setMobileMenuOpen((prev) => !prev);
//   }, []);

//   return (
//     <nav
//       className={`bg-[#F9F9F9] shadow  rounded-b-3xl ${
//         isMobile ? "mx-4" : isTab ? "mx-6" : "mx-10"
//       } `}
//     >
//       <div className="max-w-full mx-auto h-[5rem] px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-[5rem]">
//           <div className="flex items-center">
//             <Link href="/" className="flex-shrink-0">
//               <Logo />
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-4 md:space-x-8">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     "inline-flex items-center px-1 pt-1 border-b-2 text-xs sm:text-sm md:text-base lg:text-lg font-medium",
//                     pathname === item.href
//                       ? "border-blue-500 text-blue-500"
//                       : "border-transparent text-black hover:border-blue-500 hover:text-blue-700"
//                   )}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Connect Button & Mobile Menu */}
//           <div className="flex items-center">
//             <div className="hidden sm:flex sm:items-center">
//               <ConnectWallet />
//             </div>
//             <div className="flex items-center sm:hidden">
//               <button
//                 onClick={toggleMenu}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-blue-500 hover:text-[#19485F] hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-blue-500 transition duration-150 ease-in-out"
//               >
//                 <span className="sr-only">
//                   {mobileMenuOpen ? "Close menu" : "Open menu"}
//                 </span>
//                 {mobileMenuOpen ? (
//                   <X className="block h-6 w-6" aria-hidden="true" />
//                 ) : (
//                   <Menu className="block h-6 w-6" aria-hidden="true" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {mobileMenuOpen && (
//         <div className="sm:hidden bg-[#F9F9F9]">
//           <div className="pt-2 pb-3 space-y-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={cn(
//                   "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
//                   pathname === item.href
//                     ? "bg-blue-300 border-blue-500 text-gray-600"
//                     : "border-transparent text-black hover:bg-blue-300 hover:border-blue-500 hover:text-gray-600"
//                 )}
//                 onClick={toggleMenu}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             <div className="flex justify-center px-4">
//               <ConnectWallet />
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ConnectWallet from "../crypto/ConnectWallet";
import { useMediaQuery } from "../dashboard/Body";
import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isTab = useMediaQuery("(max-width: 768px)");

  const toggleMenu = useCallback(() => setOpen((p) => !p), []);

  return (
    <nav
      className={`bg-[#F9F9F9] shadow rounded-b-3xl ${
        isMobile ? "mx-4" : isTab ? "mx-6" : "mx-10"
      }`}
    >
      <div className="max-w-full mx-auto h-[5rem] px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[5rem]">
          {/* Left */}
          <div className="flex items-center">
            <Link href="/">
              <Logo />
            </Link>

            <DesktopNav />
          </div>

          {/* Right */}
          <div className="flex items-center">
            <div className="hidden lg:flex">
              <ConnectWallet />
            </div>

            <button
              onClick={toggleMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && <MobileNav onClose={toggleMenu} />}
    </nav>
  );
}

