import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Container from "@/components/Container";

const Menubar = () => {
  return (
    <header className="bg-white sticky top-0 z-50 border-b">
      <Container className="flex items-center justify-between px-4 ">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            width={120}
            height={60}
            alt="Logo"
            className="w-[70px] sm:w-[90px] xl:w-[120px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-10">
          {["Home", "Combos"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : "/combo"}
              className="relative text-[#34667B] font-medium transition-all
                         after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                         after:w-0 after:bg-primary after:transition-all
                         hover:after:w-full hover:text-primary"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Cart */}
        <div className="flex items-center gap-4">
          {/* <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />

          
            <span className="absolute -top-1 -right-1 bg-[#5F9498] text-white text-[10px]
                             w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </Link> */}
        </div>

      </Container>
    </header>
  );
};

export default Menubar;
