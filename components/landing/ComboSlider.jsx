"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Container from "@/components/Container";
import Link from "next/link";

const ComboSlider = ({ comboSliders }) => {
  const displayBanners = comboSliders;

  return (
    <Container className="w-full py-2 md:py-6 lg:py-10">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
        spaceBetween={6}
        breakpoints={{
          0: {
            slidesPerView: 2.3, // mobile
          },
          640: {
            slidesPerView: 1.5, // small mobile / large phones
          },
          768: {
            slidesPerView: 2.5, // tablet
          },
          1024: {
            slidesPerView: 3, // desktop
          },
        }}
        className="w-full"
      >
        {displayBanners.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link
              href={slide?.link || "#"}
              className={slide?.link ? "cursor-pointer" : "cursor-default"}
            >
              <div className="relative w-full h-[210px]  md:h-[260px] lg:h-[300px] xl:h-[550px] rounded-xs overflow-hidden shadow-sm">
                <Image
                  src={slide?.image}
                  alt={slide?.title || `Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 40vw, 25vw"
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

export default ComboSlider;
