import { ExplainedMenu } from "../../../types/menu"
import SpecialCard from "./special-card";


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
        <div className="w-full max-w-5xl py-4">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {menu.specials.map((s) => (
                    <SpecialCard key={s.position} special={s}/>
                ))}
            </ul>
        </div>
    )
}