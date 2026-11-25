import { SavedMenu } from "../types/menu";
import Link from "next/link"
export default async function PrevSpecials() {


    const res = await fetch('http://localhost:8001/api/menus/latest')

    if (!res.ok) {
        throw new Error('error fetching most recent menu')
    }

    const recent_menu: SavedMenu | null = await res.json();

    const isEmpty = !recent_menu;
    const subtitle = isEmpty ? "No specials yet" : `Week of ${recent_menu.day}`;

    const filler_menu = [
        "No specials here yet.",
        "Once you upload",
        "a photo of the sheet",
        "from your restaurant",
        "each dish will show up",
        "on its own line",
        "with its price right here ->",
    ]

    const rows = isEmpty
        ? filler_menu.map(sentence => ({ sentence, price: "$ --" }))
        : recent_menu.specials.slice(0, 7).map(s => ({ sentence: s.sentence, price: s.price }))


    return (
        <section className="flex-1 flex flex-col bg-surface w-full rounded-xl p-4 gap-2.5">
            <div>
                <h2 className="text-lg font-bold tracking-wider">MOST RECENT WEEK</h2>
                <p className="text-sm text-muted">{subtitle}</p>
            </div>
            <ul className="divide-y divide-divider">
                {/* only map 7 out of n specials to not stretch Home containers */}
                {rows.map((s, i) => (
                    <li key={i} className="flex justify-between py-2 gap-3">
                        <span className={!isEmpty ? "line-clamp-1" : "italic line-clamp-1"}>{s.sentence}</span>
                        <span className={isEmpty ? "shrink-0 text-burgundy opacity-50" : "shrink-0 text-burgundy"}>${s.price}</span>
                    </li>
                ))}
            </ul>
            {!isEmpty ? (
                <Link href={`/analysis/${recent_menu.id}`} className="flex min-h-11 items-center text-burgundy hover:text-burgundy-dark underline">View all {recent_menu.specials.length} specials</Link>
            ) : (
                <p className="flex min-h-11 items-center text-burgundy hover:text-burgundy-dark underline">View all 7 specials</p>
            )}
        </section>
    )
}