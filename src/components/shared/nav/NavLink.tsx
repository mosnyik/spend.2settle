import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function NavLink({ href, children, className }: any) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-1 pt-1 border-b-2 font-medium transition",
        isActive
          ? "border-blue-500 text-blue-500"
          : "border-transparent text-black hover:border-blue-500 hover:text-blue-700",
        className
      )}
    >
      {children}
    </Link>
  );
}
