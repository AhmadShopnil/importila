"use client"

import { useEffect } from 'react'
import { trackEvent } from '@/utils/gtm'

export default function LandingPageTracker() {
    useEffect(() => {
        trackEvent('view_landing_page')
    }, [])

    return null
}
