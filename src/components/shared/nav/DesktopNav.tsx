import { NAV_ITEMS } from "@/config/navigation";
import { NavLink } from "./NavLink";

export function DesktopNav() {
  return (
    <div className="hidden lg:flex space-x-4 lg:space-x-6 xl:space-x-8">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.label} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
