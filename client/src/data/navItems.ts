import type { LucideIcon } from "lucide-react";
import { LayoutGridIcon, Building } from "lucide-react";

export type NavItemsType = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const navItems = (role: string): NavItemsType[] => [
  { name: "Kunjungan", href: "/dashboard", icon: LayoutGridIcon },
  ...(role === "ADMIN"
    ? [{ name: "Entity", href: "/entity", icon: Building }]
    : []),
];
