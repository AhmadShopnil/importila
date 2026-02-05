"use client";

import Link from "next/link";
import { Home, Info, Package, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";

const BottomAppBar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Combos",
      href: "/combo",
      icon: Package,
    },
    {
      name: "Shop",
      href: "/shop",
      icon: ShoppingBag,

    },
    {
      name: "Terms",
      href: "/terms-and-conditions",
      icon: Info,

    },
    //   {
    //   name: "Cart",
    //   href: "/",
    //   icon: ShoppingCart,
    //   badge: 3, 
    // },
    // {
    //   name: "Account",
    //   href: "/",
    //   icon: User,
    // },
  ];


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden shadow-2xl pt-1 ">
      <div className="grid grid-cols-4">
        {navItems?.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              className={`flex flex-col items-center justify-center py-2 gap-1
                transition-all ${isActive
                  ? "text-[#16485e] font-bold"
                  : "text-[#34667B] "
                }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />

                {/* Cart Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#5F9498] text-white
                                   text-[10px] w-4 h-4 rounded-full
                                   flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-medium">{item.name}</span>

              {/* Active Indicator */}
              {/* {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
              )} */}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomAppBar;
