"use client";

import { MessageCircle, Phone } from "lucide-react";

const DesktopCTA = ({ combo }) => {
    const whatsappNumber = combo?.whatsappNumber || "+8801631314880";
    const messengerUsername = combo?.messengerUsername || "importila";

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hi! I'm interested in the kids dress bundle. Can you help me?");
        window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, "").trim()}?text=${message}`, "_blank");
    };

    const handleMessenger = () => {
        window.open(`https://m.me/${messengerUsername.trim()}`, "_blank");
    };

    return (
        <section className="py-16 gradient-hero hidden md:block">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1E556E] mb-2">
                        {combo?.helpTitle || "Need Help? Chat With Us!"}
                    </h2>
                    <p className="text-muted-foreground">
                        {combo?.helpSubtitle || "Our friendly team is ready to assist you with your order"}
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleWhatsApp}
                        className="flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] hover:scale-105"
                    >
                        <Phone size={24} />
                        Chat on WhatsApp
                    </button>
                    <button
                        onClick={handleMessenger}
                        className="flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 bg-[#0099FF] text-white shadow-lg hover:bg-[#0088E0] hover:scale-105"
                    >
                        <MessageCircle size={24} />
                        Chat on Messenger
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DesktopCTA;
