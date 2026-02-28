"use client";

import Image from "next/image";
import Container from "../Container";

const SizeChartProductPage = () => {
    return (
        <Container className="flex justify-center py-4 md:py-6 ">
            <div className="relative w-full  aspect-[2/1]">
                <Image
                    src="/images/Size_chart.jpeg"
                    alt="Size chart"
                    fill
                    className="object-fit rounded-md"
                    sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 90vw,
                 1000px"
                    priority
                />
            </div>
        </Container>
    );
};

export default SizeChartProductPage;
