export default function DashboardSkeleton() {
    return (
        <div className="bg-gray-50/50 min-h-screen p-4 md:p-8 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-60 bg-gray-200 rounded-lg" />
                <div className="h-10 w-40 bg-gray-200 rounded-xl" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-gray-200 bg-white p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                        </div>

                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-7 w-24 bg-gray-300 rounded" />
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[360px] bg-white border border-gray-200 rounded-2xl p-6"
                    >
                        <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
                        <div className="h-full bg-gray-100 rounded-xl" />
                    </div>
                ))}
            </div>

            {/* Large charts */}
            <div className="space-y-8">
                <div className="h-[400px] bg-white border border-gray-200 rounded-2xl" />
                <div className="h-[400px] bg-white border border-gray-200 rounded-2xl" />
            </div>
        </div>
    )
}
