"use client"

import Image from "next/image"
import Container from "@/components/Container"

export default function ComboHero({ combo }) {
  return (
    <section className="bg-secondary">
      <Container className="py-10 grid gap-8 md:grid-cols-2 items-center">

        {/* Image */}
        <div
          className="
            relative w-full overflow-hidden rounded-sm
            aspect-[4/4]
            max-h-[360px]
            md:max-h-[520px]
          "
        >
          <Image
            src={combo.featuredImage}
            alt={combo.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {combo.name}
          </h1>

          <p className="text-muted-foreground">
            {combo.description}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              ৳ {combo.offerPrice}
            </span>
            <span className="line-through text-muted-foreground">
              ৳ {combo.price}
            </span>
          </div>

          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm">
            Combo Offer
          </span>
        </div>
      </Container>
    </section>
  )
}
