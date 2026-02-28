"use client";

import { MessageCircle, Phone } from "lucide-react";

const StickyCTA = ({ combo }) => {
    const whatsappNumber = combo?.whatsappNumber || "+8801631314880 "; // Replace with actual number
    const messengerUsername = combo?.messengerUsername || "importilabd"; // Replace with actual username

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hi! I'm interested in the kids dress bundle. Can you help me?");
        window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, "").trim()}?text=${message}`, "_blank");
    };

    const handleMessenger = () => {
        window.open(`https://m.me/${messengerUsername.trim()}`, "_blank");
    };

    return (
        <div className="fixed bottom-14 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent md:hidden">
            <div className="flex gap-3">
                <button
                    onClick={handleWhatsApp}
                    aria-label="Order via WhatsApp"
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md
                     font-bold text-base transition-all duration-300 bg-[#25D366] text-white shadow-lg 
                     hover:bg-[#20BD5A] active:scale-95"
                >
                    <Phone size={20} />
                    WhatsApp
                </button>
                <button
                    onClick={handleMessenger}
                    aria-label="Order via Messenger"
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-base 
                    transition-all duration-300 bg-[#0099FF] text-white shadow-lg hover:bg-[#0088E0] active:scale-95"
                >
                    <MessageCircle size={20} />
                    Messenger
                </button>
            </div>
        </div>
    );
};

export default StickyCTA;
