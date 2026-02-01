"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Container from "@/components/Container";
import Link from "next/link";

const HeroSection = ({ banners }) => {


  // Use hardcoded fallbacks if nothing is in DB 
  // const displayBanners = banners?.length > 0 ? banners : [
  //   { image: "/banners/3.webp" },
  //   { image: "/banners/2.jpg" },
  // ];


  const displayBanners = banners;


  return (
    <Container className="w-full py-4 md:py-6 lg-py-14">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
        className="w-full rounded-2xl overflow-hidden shadow-sm"
      >
        {displayBanners.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link
              href={slide?.link || "#"}
              className={slide?.link ? "cursor-pointer" : "cursor-default"}
            >
              <div className="relative w-full h-[180px] sm:h-[400px] md:h-[420px] lg:h-[400px] xl:h-[620px]">
                <Image
                  src={slide?.image}
                  alt={slide?.title || `Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />

              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default HeroSection;
