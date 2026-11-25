
export default function PrevSpecialsSkeleton() {

    return (
        <section className="flex-1 flex flex-col bg-surface w-full rounded-xl p-4 gap-2.5">
            <div>
                <h2 className="text-lg font-bold tracking-wider">MOST RECENT WEEK</h2>
                <p className="text-sm text-muted">Week of placeholder</p>
            </div>
            <ul className="divide-y divide-divider">
                {/* only map 7 out of n specials to not stretch Home containers */}
                {Array.from({ length: 7 }).slice(0, 7).map((s, i) => (
                    <li key={i} className="flex justify-between py-2 gap-3">
                        <span className="line-clamp-1">placeholder sentence</span>
                        <span className="shrink-0 text-burgundy">$00</span>
                    </li>
                ))}
            </ul>
            <p className="flex min-h-11 items-center text-burgundy underline">Loading link</p>
        </section>
    )
}