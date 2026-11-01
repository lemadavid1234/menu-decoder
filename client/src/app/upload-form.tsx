"use client";
import { Menu } from '../types/menu';
import { useState } from 'react'
import ReviewForm from './review-form';


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
            const response = await fetch('http://localhost:8001/api/photos', {
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


    return (
        //entire component
        <div className='p-4 max-w-2xl min-w-2xl border-4 border-white'>

            {/* Choose File & Submit Button field */}
            {!draft && (
                <form onSubmit={handleSubmit} className='flex justify-between'>
                    <input required type="file" name="photo" className='text-sm file:px-1 file:mr-4 file:border' />
                    <button className="border rounded border-white bg-white text-black text-sm" type="submit" disabled={isLoading}>Submit</button>
                </form>
            )}

            {/* Loading state */}
            {isLoading && (
                <>
                    <h2>Currently extracting text from photo...</h2>
                </>
            )}

            {/* entire menu object, including concerns */}
            {draft?.is_special && (
                <ReviewForm draft={draft} setDraft={setDraft}/>
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