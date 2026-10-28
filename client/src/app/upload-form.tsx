"use client";
import { Menu, ConfirmedMenu } from '../types/menu';
import { useState } from 'react'


export default function UploadForm() {

    const [menu, setMenu] = useState<Menu>();
    const [draft, setDraft] = useState<Menu>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>()


    console.log("Component rendering...");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        console.log("Selected file: ", formData.get('photo'))

        try {
            setIsLoading(true);
            setError(undefined);
            setMenu(undefined);
            setDraft(undefined);
            const response = await fetch('http://localhost:8001/photos', {
                method: "POST",
                body: formData,
            });

            const data = await response.json(); // only returns the body (Response.body)

            //response.ok tells us if backend received request and replied with an error status code
            if (!response.ok) { //metadata such as Response.ok, Response.status (2xx,3xx,4xx..), Response.headers
                throw new Error(`Server error: ${response.status} with fastapi backend detail: ${data.detail}`);
            }

            if (!data.menu.is_special) {
                throw new Error(`Submitted photo was not a menu`);
            }

            setMenu(data.menu);
            setDraft(data.menu);
            console.log("Backend response payload aka body of Response object as JSON object:", data);



        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Something went wrong. Please try again.")
            }
            console.error("Caught the error: ", err);
        } finally {
            setIsLoading(false);
        }
    }


    const handleContinue = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(draft)
    }


    return (
        //entire component
        <div className='p-4 max-w-2xl border-4 border-white'>

            {/* Choose File & Submit Button field */}
            <form onSubmit={handleSubmit} className='flex justify-between'>
                <input required type="file" name="photo" className='text-sm file:px-1 file:mr-4 file:border'/>
                <button className="border rounded border-white bg-white text-black text-sm" type="submit" disabled={isLoading}>Submit</button>
            </form>

            {/* Loading state */}
            {isLoading && (
                <>
                    <h2>Currently extracting text from photo...</h2>
                </>
            )}

            {/* entire menu object, including concerns */}
            {draft?.is_special && (
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

                    {/* concerns */}
                    {draft.concerns && (
                        <>
                            <div className='border border-white'>
                                <h3>Concerns</h3>
                                <p>{draft.concerns}</p>
                            </div>
                        </>
                    )}

                    {/* Continue button */}
                    <p className='font-bold'>After reviewing the extracted menu, edit mistakes (if any).</p>

                    <form onSubmit={handleContinue} className='text-center'>
                        <button type="submit" className='border rounded border-white bg-white text-black text-sm'>Continue</button>
                    </form>

                </div>
            )}
            {/* if is_special = false, therefore error will be set */}
            {error && (
                <>
                    <h2>Whoops, an error has occured:</h2>
                    <p>{error}</p>
                </>
            )}

        </div>
    )
}