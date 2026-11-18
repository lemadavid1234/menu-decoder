"use client"
import { ExplainedSpecial } from "@/types/menu";
import { useState } from "react";




export default function SpecialCard({ special }: { special: ExplainedSpecial }) {

    const [isExpanded, setIsExpanded] = useState(false);


    return (
        <li className={`flex flex-col shadow-md bg-surface rounded-2xl py-4 px-4 gap-2 ${isExpanded ? "md:col-span-full" : ""}`}>
            {/* card header */}
            <div className="flex justify-between">
                <p className="text-xs text-burgundy">{String(special.position + 1).padStart(2, "0")}</p>
                <p className="text-sm text-burgundy">${special.price ? special.price : "NA"}</p>
            </div>
            <h2 className="text-lg font-bold">{special.sentence}</h2>
            <p className={isExpanded ? "text-sm" : "text-sm line-clamp-4"}>{special.description}</p>

            { isExpanded && (
                <>
                    {/* grid layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6 border-t border-divider mt-2 pt-5">

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-muted text-xs tracking-widest">HOW TO SAY IT</h3>
                            <p className="text-sm">{special.pronunciation}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-muted text-xs tracking-widest">DIETARY</h3>
                            <p className="text-sm">{special.dietary_restrictions.join(", ")}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-muted text-xs tracking-widest">ALLERGENS</h3>
                            <p className="text-sm">{special.allergens.join(", ")}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-muted text-xs tracking-widest">PAIRS WITH</h3>
                            <ul className="flex flex-wrap gap-2">
                                {special.suggested_wine_pairing.map((wp) => (
                                    <li key={wp} className="border border-rule text-sm rounded-full px-3 py-1">{wp}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-muted text-xs tracking-widest">LIKELY INGREDIENTS</h3>
                            <p className="text-sm">{special.possible_ingredients.join(", ")}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-muted text-xs tracking-widest">ORIGIN</h3>
                            <p className="text-sm">{special.origin}</p>
                        </div>

                    </div>
                </>
            )}
            <button 
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded((prev) => !prev)}
                className="mt-auto self-start text-sm text-burgundy"
            >
                {isExpanded ? `Hide details` : `Show details`}
            </button>



        </li>
    )
} 