"use client";
import { Menu, ConfirmedMenu } from "../types/menu";
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReviewForm({ draft, setDraft }: { draft: Menu; setDraft: (menu: Menu) => void; }) {
    
    const [displayConcerns, setDisplayConcerns] = useState(false);
    const router = useRouter();

    const handleToggleConcerns = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (displayConcerns) {
            setDisplayConcerns(false);
        } else {
            setDisplayConcerns(true);
        }
    }

    const handleContinue = async (e: React.SubmitEvent<HTMLFormElement>) => {
        // send a post request to fastapi endpoint, which will upload Menu item to database
        e.preventDefault();
        console.log(draft)


        //create a finalMenu with only desired fields, (removing concerns and is_special)
        //not required to do since Pydantic would ignore extra fields anyway, just for organization
        const finalMenu: ConfirmedMenu = {
            specials: draft.specials,
            day: draft.day
        }
        // class ConfirmedMenu(BaseModel):  
        // specials: List[Special]  
        // day: date

        try {
            const response = await fetch('http://localhost:8001/api/menus', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalMenu) //endpoint takes a Pydantic model, so FastAPI expects JSON in the body
            })

            const data = await response.json(); //response body should contain id

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} with fastapi backend detail: ${data.detail}`)
            }

            const id = data.id;
            console.log(`this is the uploaded menu's id: ${id}`);

            navigateToAnalysis(id);

        } catch (err) {
            // if (err instanceof Error) {
            //     setError(err.message)
            // } else {
            //     setError("Something went wrong. Please try again.")
            // }
            console.error("Caught the error: ", err);
        }
    }


    function navigateToAnalysis(id: string) {
        router.push(`/analysis/${id}`)
    }


    return (
        <div className="w-full max-w-2xl self-center flex flex-col gap-4 mb-8">
            <p className='text-center text-2xl'>REVIEW YOUR SPECIALS</p>
            <p className="text-center text-muted">Here&apos;s what we read from your photo. Click any line to fix spelling or add a price.</p>

            {/* specials list */}
            <div className="bg-surface">
                <p className='text-center text-lg border border-b-0'>Week of: {draft.day}</p>
                <ul>
                    {/* column labels */}
                    <div className='flex justify-between'>
                        <h1 className='pl-2 border flex-9'>Specials</h1>
                        <h1 className='border border-l-0 flex-1 min-w-0 text-center'>Price</h1>
                    </div>

                    {/* individual rows */}
                    {draft.specials.map((s, index) => (
                        <li key={index} className='justify-between flex'>
                            <textarea className='p-2 border border-t-0 flex-9 min-w-0 resize-none' rows={3} value={s.sentence} onChange={e => setDraft({ ...draft, specials: draft.specials.map((item, i) => i === index ? { ...item, sentence: e.target.value } : item) })} />
                            <input className='border border-l-0 border-t-0 flex-1 min-w-0 text-center' type="text" placeholder="$" value={s.price ?? ""} onChange={e => setDraft({ ...draft, specials: draft.specials.map((item, i) => i === index ? { ...item, price: e.target.value } : item) })} />
                        </li>
                    ))}
                </ul>

            </div>
            {/* concerns & toggle on/off concerns */}
            {draft.concerns && (
                <div className="bg-surface rounded-2xl">
                    <form onSubmit={handleToggleConcerns}>
                        <button type="submit" className='pl-2 my-2'>{displayConcerns ? 'Hide Concerns' : 'Display Concerns'}</button>
                    </form>
                    {displayConcerns && (
                        <div className='p-4'>
                            <p>{draft.concerns}</p>
                        </div>
                    )}
                </div>
            )}


            {/* Continue button */}
            <div className="ml-auto flex gap-x-4 items-center">
                <p className="text-muted">{draft.specials.length} specials</p>
                <form onSubmit={handleContinue} className=''>
                    <button type="submit" className='bg-burgundy py-2 px-4 rounded text-white'>Continue</button>
                </form>
            </div>

        </div>
    )
}