"use client"



import Link from 'next/link';
import { useState } from 'react';
import Container from '@/components/Container';



const ProductCard = ({ product }) => {
  return (
    <div className="cursor-pointer rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">

      <div className="relative bg-muted ">


        <div className="relative aspect-1/2 w-full rounded-sm  h-64">
          <img
            src={product?.featuredImage || "/placeholder.svg"}
            alt={product?.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform"
          />

        </div>


        {/* {product.isNew && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white ${accentColor}`}
          >
            NEW
          </span>
        )} */}


      </div>

      <div className="px-2 md:px-2 py-2">
        <h3 className="text-sm md:text-base font-semibold text-[#1C546D] mb-1  transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs  md:text-sm text-[#5F9498]">

            {
              (product?.offerPrice) ?
                <>
                  <span className=" font-bold text-[#1C546D]">
                    ৳ {product.offerPrice}
                  </span>
                  <span className="  line-through">
                    ৳ {product?.price}
                  </span>
                </>
                : <>
                  <span className=" font-bold ">
                    ৳ {product.price}
                  </span>
                </>
            }


          </div>

          {/* <Link
            href="/shop"
            className={`text-xs  md:text-sm px-3 py-1 bg-[#1C546D]  rounded-sm flex items-center justify-center text-white hover:scale-110 transition-transform `}
          >
            View

          </Link> */}
        </div>

      </div>
      <Link
        href="/shop"
        className={` text-xs  md:text-sm px-3 py-1 bg-[#1C546D]   flex items-center justify-center text-white hover:scale-110 transition-transform `}
      >
        View

      </Link>
    </div>
  );
};

const ProductsByGender = ({ products }) => {
  const [activeTab, setActiveTab] = useState('boys');


  const boysProducts = products?.filter((product, i) => product?.category == "boys")
  const girlsProducts = products?.filter((product, i) => product?.category == "girls")



  return (
    <section id="boys" className="py-6 md:py-10 bg-background">
      <Container className="">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl   mb-4 font-semibold text-[#1C546D] ">
            Our Products
          </h2>

          <div className=' flex justify-between items-center'>
            <div className="inline-flex p-0.5 bg-muted rounded-sm text-xs md:text-sm">
              <button
                onClick={() => setActiveTab('boys')}
                className={`px-4 py-2 md:px-8 md:py-3 rounded-sm font-semibold transition-all cursor-pointer ${activeTab === 'boys'
                  ? 'bg-[#1C546D] text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                For Boys
              </button>
              <button
                onClick={() => setActiveTab('girls')}
                className={`px-4 py-2 md:px-8 md:py-3 rounded-sm font-semibold transition-all cursor-pointer ${activeTab === 'girls'
                  ? 'bg-[#5F9498] text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                For Girls
              </button>
            </div>

            <div className=" text-center text-xs md:text-base">
              <Link
                href="/shop"
                className={`  group
              mt-8 
             items-center gap-3
             
              font-semibold
               text-[#5F9498]
              transition-all duration-300
                  }`}>
                View More
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
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 md:gap-6">
          {(activeTab === 'boys' ? boysProducts : girlsProducts).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              accentColor={activeTab === 'boys' ? 'gradient-boy' : 'gradient-girl'}
            />
          ))}
        </div>

        {/* <div className="text-center mt-10">
          <Link
             href="/shop"
          className={`px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg ${
            activeTab === 'boys' ? 'gradient-boy' : 'gradient-girl'
          }`}>
            View All  
          </Link>
        </div> */}
      </Container>
    </section>
  );
};

export default ProductsByGender;