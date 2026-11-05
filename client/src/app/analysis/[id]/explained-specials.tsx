import { ExplainedMenu } from "../../../types/menu"


export default async function ExplainedSpecials({ id } : { id: string }) {
    
    //await POST to /api/menus/{menu_id}/explanation
    //POST returns 
    //fastapi automatically converts a path parameter from a string into a integer if the path par is annotated with the 'int' type hint
    const res = await fetch(`http://localhost:8001/api/menus/${id}/explanation`, {
        method: 'POST'
    })

    if (!res.ok) {
        throw new Error("error with HTTP request to POST /api/menus/{id}/explanation endpoint");
    }

    const menu: ExplainedMenu = await res.json();

        
    return (
        <>
            <h2>Specials of this week: {menu.day} </h2>
            <ul>
                {menu.specials.map((s) => (
                    <li key={s.position} className="border">
                        <p>{s.position + 1}. {s.sentence}</p>
                        <p>{s.description}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}