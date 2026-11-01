"use client";
import { Menu, ConfirmedMenu } from "../types/menu";
import { useState } from "react"

export default function ReviewForm({ draft, setDraft }: { draft: Menu; setDraft: (menu: Menu) => void; }) {
    
    const [displayConcerns, setDisplayConcerns] = useState(false);

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

        } catch (err) {
            // if (err instanceof Error) {
            //     setError(err.message)
            // } else {
            //     setError("Something went wrong. Please try again.")
            // }
            console.error("Caught the error: ", err);
        }
    }


    return (
        <div>
            <h1 className='text-center text-3xl'>Edit Specials List</h1>
            <h3 className='text-center text-lg'>Week of: {draft.day}</h3>

            {/* specials list */}
            <ul className='border border-white'>
                {/* column labels */}
                <div className='flex justify-between'>
                    <h1 className='pl-2 border border-white flex-9'>Specials</h1>
                    <h1 className='border border-white flex-1 min-w-0 text-center'>Price</h1>
                </div>

                {/* individual rows */}
                {draft.specials.map((s, index) => (
                    <li key={index} className='justify-between border border-white flex'>
                        <textarea className='p-2 border border-white flex-9 min-w-0 resize-none' rows={3} value={s.sentence} onChange={e => setDraft({ ...draft, specials: draft.specials.map((item, i) => i === index ? { ...item, sentence: e.target.value } : item) })} />
                        <input className='border border-white flex-1 min-w-0 text-center' type="text" placeholder="$" value={s.price ?? ""} onChange={e => setDraft({ ...draft, specials: draft.specials.map((item, i) => i === index ? { ...item, price: e.target.value } : item) })} />
                    </li>
                ))}
            </ul>

            {/* concerns & toggle on/off concerns */}
            {draft.concerns && (
                <>
                    <form onSubmit={handleToggleConcerns}>
                        <button type="submit" className='pl-2 my-2'>{displayConcerns ? 'Hide Concerns' : 'Display Concerns'}</button>
                    </form>
                    {displayConcerns && (
                        <div className='border-white border-3 p-4'>
                            <p>{draft.concerns}</p>
                        </div>
                    )}
                </>
            )}


            {/* Continue button */}
            <p className='font-bold my-2 text-center'>Edit any mistakes. Hit Continue when finished.</p>

            <form onSubmit={handleContinue} className='text-center'>
                <button type="submit" className='border rounded border-white bg-white text-black text-sm'>Continue</button>
            </form>

        </div>
    )
}