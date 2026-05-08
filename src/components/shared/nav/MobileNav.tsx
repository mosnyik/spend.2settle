import { NAV_ITEMS } from "@/config/navigation";
import { NavLink } from "./NavLink";
import ConnectWallet from "@/components/crypto/ConnectWallet";

export function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="lg:hidden bg-[#F9F9F9]">
      <div className="pt-2 pb-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            href={item.href}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200">
        <div className="flex justify-center px-4">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
