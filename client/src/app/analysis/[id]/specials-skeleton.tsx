import { Menu } from "../../../types/menu"

export default function SpecialsSkeleton({ menu } : { menu : Menu }) {

    return (
        <>
                <h2> Specials of this week: {menu.day} </h2>                    
                <ul>
                    {menu.specials.map((s, index) => (
                        <li key={index} className="border border-foreground">
                            <p>{index+1}. {s.sentence}</p>
                    
                        </li>
                    ))}
                </ul>
        </>


        
    )
}