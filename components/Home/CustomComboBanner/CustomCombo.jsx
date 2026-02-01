import Link from "next/link";
import Container from "@/components/Container";

const CustomCombo = () => {
  return (
    <section className="py-2 md:py-3 xl:py-5 ">
      <Container className="">
        <div className="bg-[#34667B] border border-gray-200 p-4 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-medium text-white">Best Offer</span>
              </div>

              <h2 className="text-xl md:text-3xl lg:4xl font-bold text-white mb-1 md:mb-3">
                Create Your Own Combo!
              </h2>
              <p className="text-white/80 text-xs md:text-lg max-w-md">
                Mix & match any 3 (minimum) design.
              </p>
            </div>

            <div className=" items-center gap-4">

              <Link
                href="/shop"
                className="bg-white text-[#1C546D] font-bold text-xs md:text-base md:text-lg px-4 py-1.5 md:px-8 md:py-3 
              rounded-full hover:bg-opacity-90
              transition-all hover:scale-105 shadow-xl ">
                Select Design
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CustomCombo;