import Image from "next/image";
import Container from "@/components/Container";
import Link from "next/link";

const Combos = ({ combos }) => {
  return (
    <section
      id="combos"
      className="
       py-6 md:py-10
        bg-linear-to-br
        from-[#F8FAFF]
        via-[#F1F5FF]
        to-[#ECFEFF]
      "
    >
      <Container>

        {/* Header */}
        <div className="flex items-center justify-between  mb-4 px-0.5 ">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#1C546D]  ">
              Our Combo Offer
            </h2>

          </div>


          <Link
            href="/combo"
            className="
              group 
            
               items-center gap-3
           
              font-semibold
              text-[#5F9498]
              transition-all duration-300
              text-xs md:text-base
            "
          >
            View All
            <span
              className="
                inline-block
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
          {combos?.map((combo) => (
            <div
              key={combo?._id}
              className="
                bg-white
                overflow-hidden
                shadow-md rounded-sm
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                group pb-4 md:pb-6
               
              "
            >
              {/* Image */}
              <div className="relative p-2 bg-linear-to-br from-muted to-white ">
                <div className="relative w-full aspect-square  overflow-hidden">
                  <Image
                    src={combo?.featuredImage}
                    alt={combo?.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-sm"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="px-5">
                <h3 className="font-semibold text-sm  md:text-base text-[#1C546D] ">
                  {combo?.title}
                </h3>

                {/* Price  */}
                <div className="flex items-center justify-between ">

                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#5F9498]">

                    {
                      (combo?.offerPrice) ?
                        <>
                          <span className=" font-bold ">
                            ৳ {combo.offerPrice}
                          </span>
                          <span className=" text-muted-foreground line-through">
                            ৳ {combo?.price}
                          </span>
                        </>
                        : <>
                          <span className=" font-bold text-primary">
                            ৳ {combo?.price}
                          </span>
                        </>
                    }

                  </div>

                  <Link
                    href={`/combo/kids/${combo?._id}`}
                    className="cursor-pointer w-6 h-6 md:w-8 md:h-8 bg-[#34667B] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                    <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <Link
          href="/combos"
          className="
          
              group  xl:hidden
            
               items-center gap-3
           
              font-semibold
              text-[#316175]
              transition-all duration-300
              text-sm md:text-base
            "
        >
          View All Combos
          <span
            className="
                inline-block
                transition-transform duration-300
                group-hover:translate-x-1
              "
          >
            →
          </span>
        </Link> */}

      </Container>
    </section>
  );
};

export default Combos;
