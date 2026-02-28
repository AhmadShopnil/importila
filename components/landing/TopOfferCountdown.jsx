"use client"

import { useEffect, useState } from "react"
import Container from "../Container"

export default function TopOfferCountdown() {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()

      // Next midnight
      const nextMidnight = new Date()
      nextMidnight.setHours(24, 0, 0, 0)

      return nextMidnight - now
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    }
  }

  const { hours, minutes, seconds } = formatTime(timeLeft)

  return (
    <section className="w-full gradient-cta text-primary-foreground">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 py-2 sm:py-3">

          {/* Offer Text */}
          <p className="text-sm sm:text-sm md:text-base font-semibold text-center sm:text-left">
            ৬ পিস বা তার বেশি নিলে ডেলিভারি চার্জ ফ্রি!
          </p>

          {/* Countdown */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <span className="opacity-80">অফার শেষ হতে বাকি :</span>

            <div className="flex items-center gap-2">
              <TimeBox value={hours} label="ঘন্টা" />
              <span>:</span>
              <TimeBox value={minutes} label="মিনিট" />
              <span>:</span>
              <TimeBox value={seconds} label="সেকেন্ড" />
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}

function TimeBox({ value, label }) {
  return (
    <div className="bg-white/10 px-2 py-1 rounded-md text-center min-w-[42px]">
      <div className="leading-none">{value}</div>
      <div className="text-[9px] opacity-70">{label}</div>
    </div>
  )
}
