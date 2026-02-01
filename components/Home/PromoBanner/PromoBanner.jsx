import Link from "next/link";
import Container from "@/components/Container";

const PromoBanner = () => {
  return (
    <section className="py-12">
      <Container className="">
        <div className="gradient-combo rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                {/* <span className="text-xl">🎉</span> */}
                <span className="text-sm font-medium text-white">Best Offer</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Create Your Own Combo!
              </h2>
              <p className="text-white/80 text-lg max-w-md">
                Mix & match any 3 (minimum) design.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">🧸</div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">🎮</div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">🎀</div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shadow-lg">+</div>
              </div>

              <Link
                href="/shop"
                className="bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 shadow-xl">
                Select Design
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PromoBanner;