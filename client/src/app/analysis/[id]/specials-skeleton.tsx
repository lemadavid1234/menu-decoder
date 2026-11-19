

export default function SpecialsSkeleton({ count } : { count : number }) {

    const skeletonArr = Array.from({ length : count })

    return (
        <div className="flex flex-col w-full max-w-5xl py-4 gap-y-2">
            <div className="flex gap-x-2 items-center md:w-1/2 md:self-center bg-surface rounded-2xl p-2" role="status">
                <div className="h-5 w-5 shrink-0 border-2 border-skeleton rounded-full border-t-burgundy animate-spin"/>
                <div className="flex flex-col">
                    <p className="text-sm">Explaining your {count} special{count === 1 ? "" : "s"}...</p>
                    <p className="text-xs text-muted">This usually takes about 15 seconds.</p>
                </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                {skeletonArr.map((_, i) => (
                    <li key={i} className="flex flex-col bg-surface shadow-md rounded-2xl py-4 px-4 gap-2">
                        <div className="flex justify-between">
                            <div className="h-4 w-6 rounded bg-skeleton-accent"/>
                            <div className="h-5 w-8 rounded bg-skeleton-accent"/>
                        </div>

                        <div className="h-7 w-3/4 bg-skeleton rounded"/>

                        <div className="h-5 bg-skeleton-light rounded"/>
                        <div className="h-5 bg-skeleton-light rounded"/>
                        <div className="h-5 bg-skeleton-light rounded"/>
                        <div className="h-5 w-1/2 bg-skeleton-light rounded"/>

                        <div className="h-5 w-1/4 bg-skeleton-accent rounded"/>
                    </li>
                ))}
            </ul>
        </div>


        
    )
}