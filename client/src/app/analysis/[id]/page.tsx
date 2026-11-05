import { Menu } from "@/types/menu";
import ExplainedSpecials from "./explained-specials"
import SpecialsSkeleton from "./specials-skeleton";
import { Suspense } from "react";

//server component only runs once, so no useState to "refresh" page
export default async function AnalysisPage({ params } : { params: Promise<{id: string}>}) {

    // await params
    const { id } = await params

    if (!id) return; //routes `params` values are types as 'string', 'string[]', or undefined

    // await GET
    const res = await fetch(`http://localhost:8001/api/menus/${id}`)
    const menu: Menu = await res.json();

    // if (!res.ok) {
    //     throw new Error(`Server error: ${res.status} with fastapi backend detail: ${menu.detail}`);
    // }




    //return JSX
    return (
        <>
            <h1 className="text-lg text-center">Analysis page</h1>
            <div className='border border-white flex flex-col'>


                <Suspense fallback={<SpecialsSkeleton menu={menu}/>}>
                    <ExplainedSpecials id={id}/>
                </Suspense>



            </div>
        </>
    )
}