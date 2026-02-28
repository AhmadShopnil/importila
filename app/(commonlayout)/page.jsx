import Home from "@/components/Home/Home"
import LandingPageTracker from "@/components/Tracking/LandingPageTracker"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <LandingPageTracker />
      <Home />
    </div>
  )
}
