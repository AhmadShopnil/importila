"use client"

import MediaManager from "@/components/Dashboard/MediaManager/MediaManager"

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Media Library</h1>
                <p className="text-muted-foreground">
                    Manage all your uploaded images in one place. Upload once, use everywhere.
                </p>
            </div>

            <MediaManager />
        </div>
    )
}
