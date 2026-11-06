import { ExplainedMenu } from "../../../types/menu"


export default async function ExplainedSpecials({ id }: { id: string }) {

    //await POST to /api/menus/{menu_id}/explanation
    //POST returns 
    //fastapi automatically converts a path parameter from a string into a integer if the path par is annotated with the 'int' type hint

    // await new Promise((resolve) => setTimeout(resolve, 5000))
    const res = await fetch(`http://localhost:8001/api/menus/${id}/explanation`, {
        method: 'POST'
    })

    if (!res.ok) {
        throw new Error("error with HTTP request to POST /api/menus/{id}/explanation endpoint");
    }

    const menu: ExplainedMenu = await res.json();


    return (
        <div className="max-w-4xl">
            <h1 className="font-bold text-lg text-center">Specials of this week: {menu.day} </h1>
            <ul className="flex flex-col gap-4">
                {menu.specials.map((s) => (
                    <li key={s.position} className="border border-foreground p-4">

                        <div className="flex justify-between text-lg font-bold">
                            <h2 className="">{s.position + 1}. {s.sentence}</h2>
                            <p className="">${s.price ? s.price : "NA"}</p>
                        </div>

                        <div className="">
                            <p className="text-sm px-2">{s.description}</p>
                        </div>

                        {/* ingredients & allergens/dietary_restrictions boxes */}
                        <div className="flex gap-4 mt-2">
                            {/* ingrediants list box */}
                            <div className="border border-foreground flex-1 px-2">
                                <h3 className="text-center">ingredients list</h3>
                                <ul className="max-h-32 overflow-y-auto">
                                    {s.possible_ingredients.map((pi, index) => (
                                        <li key={index}>
                                            <p>{pi}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* allergen list & dietary restrictions box */}
                            <div className="border border-foreground flex-1 flex px-2 max-h-38 overflow-y-auto">
                                <div className="flex-1">
                                    <h3 className="text-center">allergens list</h3>
                                    <ul>
                                        {s.allergens.map((a, index) => (
                                            <li key={index}>
                                                <p>{a}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-center">dietary restrictions</h3>
                                    <ul>
                                        {s.dietary_restrictions.map((dr, index) => (
                                            <li key={index}>
                                                <p>{dr}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        {/* origin, pronunciation, and wine pairing */}
                        <div className="flex gap-4 mt-4">
                            <div className="px-2 flex-1">
                                <p>Origin: {s.origin}</p>
                                <p>{s.pronunciation}</p>
                            </div>
                            <p className="px-2 flex-1">Wine Pairing: {s.suggested_wine_pairing.join(", ")}</p>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}