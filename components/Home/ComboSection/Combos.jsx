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
                  <Link
                    href={`/combo/kids/${combo?.slug}`}
                  >
                    <Image
                      src={combo?.featuredImage}
                      alt={combo?.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-sm"
                    />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="px-5">
                <Link
                  href={`/combo/kids/${combo?.slug}`}
                  className="font-semibold text-sm  md:text-base text-[#1C546D] ">
                  {combo?.title}
                </Link>

                {/* Price  */}
                <div className="flex items-center justify-between mt-2 ">

                  {/* <div className="flex items-center gap-2 text-xs md:text-sm text-[#5F9498]">

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

                  </div> */}

                  <Link
                    href={`/combo/kids/${combo?.slug}`}
                    className="cursor-pointer w-full bg-[#34667B] text-sm md:text-base px-3 py-1 rounded-md flex items-center justify-center text-white hover:scale-105 transition-transform ">
                    Buy This Combo
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
