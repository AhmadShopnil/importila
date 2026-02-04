import Link from 'next/link';
import { CheckCircle, ShoppingBag, Home, PhoneCall } from 'lucide-react';
import Container from '@/components/Container';

export const metadata = {
    title: "Order Successful | Importila",
    description: "Thank you for your order! We'll process it shortly.",
};

export default function ThankYouPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-background py-16 md:py-24">
            <Container>
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative bg-white rounded-full p-4 shadow-xl border border-primary/10">
                                <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1C546D] mb-4">
                        Order Successful!
                    </h1>
                    <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                        Thank you for shopping with us! Your order has been placed successfully.
                        We will contact you shortly to confirm your order details.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <Link
                            href="/shop"
                            className="flex items-center justify-center gap-2 py-4 px-8 bg-[#1C546D] text-white rounded-2xl font-bold shadow-lg hover:bg-[#1C546D]/90 hover:scale-[1.02] transition-all duration-300"
                        >
                            <ShoppingBag size={20} />
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-4 px-8 bg-white text-[#1C546D] border-2 border-[#1C546D]/20 rounded-2xl font-bold hover:bg-muted hover:scale-[1.02] transition-all duration-300"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                    </div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 inline-flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1C546D] flex items-center justify-center text-white">
                            <PhoneCall size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Need Help?</p>
                            <p className="text-sm font-bold text-[#1C546D]">Call or WhatsApp: +880 1XXX-XXXXXX</p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
