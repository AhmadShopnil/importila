"use client"


import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import Image from "next/image";


export default function Navbar() {

    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        // Load cart count from localStorage
        const cart = localStorage.getItem("cart")
        if (cart) {
            const cartItems = JSON.parse(cart)
            setCartCount(cartItems.length)
        }
    }, [])



    return (

        <header className="bg-card border-b border-border sticky top-0 z-50">
            <Container className="  flex justify-between items-center">
                <Link
                    href="/"
                    className="text-xl sm:text-3xl font-bold text-primary">
                    <Image
                        src="/logo.svg"
                        width={150}
                        height={50}
                        className=""
                    />

                </Link>



                <div className="flex gap-2 sm:gap-4 items-center">
                    {/* <Link
                        href="/admin"
                        className="hidden sm:block px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm sm:text-base"
                    >
                        Admin Dashboard
                    </Link> */}
                    {/* <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg">
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link> */}
                </div>
            </Container>
        </header>

    )
}
