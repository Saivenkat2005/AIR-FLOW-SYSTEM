import React from 'react';

function SkeletonBlock({ className }) {
    return <div className={`skeleton-shimmer rounded-xl ${className}`} aria-hidden="true" />;
}

export default function FlightSearchSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="status" aria-label="Loading available flights">
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <SkeletonBlock className="w-12 h-12" />
                            <div className="space-y-2">
                                <SkeletonBlock className="w-32 h-5" />
                                <SkeletonBlock className="w-24 h-3" />
                            </div>
                        </div>
                        <SkeletonBlock className="w-20 h-7" />
                    </div>
                    <SkeletonBlock className="w-full h-20" />
                    <div className="grid grid-cols-3 gap-2">
                        <SkeletonBlock className="h-14" />
                        <SkeletonBlock className="h-14" />
                        <SkeletonBlock className="h-14" />
                    </div>
                    <SkeletonBlock className="w-full h-11" />
                </div>
            ))}
            <span className="sr-only">Loading flight corridors...</span>
        </div>
    );
}
