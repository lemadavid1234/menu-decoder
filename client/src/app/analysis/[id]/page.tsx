import { Menu } from "@/types/menu";
import ExplainedSpecials from "./explained-specials"
import SpecialsSkeleton from "./specials-skeleton";
import { Suspense } from "react";
import { notFound } from "next/navigation"

//server component only runs once, so no useState to "refresh" page
export default async function AnalysisPage({ params } : { params: Promise<{id: string}>}) {

    // await params
    const { id } = await params

    if (!id) return; //routes `params` values are types as 'string', 'string[]', or undefined

    // await GET
    const res = await fetch(`http://localhost:8001/api/menus/${id}`)

    //invalid id parameter leads to Next.js not-found UI
    if (res.status === 404) notFound();

    if (!res.ok) {
        throw new Error(`Issue calling GET on /api/menus/${id} with status: ${res.status}`);
    }
    
    const menu: Menu = await res.json();





    //return JSX
    return (
        <>
            {/* <h1 className="text-lg text-center">Analysis page</h1> */}
            <div className='flex flex-col items-center'>


                {/* when only want SpecialsSkeleton Block */}
                {/* <SpecialsSkeleton menu={menu}/> */}

                <Suspense fallback={<SpecialsSkeleton menu={menu}/>}>
                    <ExplainedSpecials id={id}/>
                </Suspense>



            </div>
        </>
    )
}