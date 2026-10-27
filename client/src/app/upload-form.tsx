"use client";
import { Menu } from '../types/menu';
import { useState } from 'react'


export default function UploadForm() {

    const [menu, setMenu] = useState<Menu>();
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
        <div className='p-4 min-w-2xl border-4 border-white'>
            <form onSubmit={handleSubmit}>
                <input required type="file" name="photo" />
                <button type="submit" disabled={isLoading}>Submit</button>
            </form>
            {isLoading && (
                <>
                    <h2>Currently extracting text from photo...</h2>
                </>
            )}
            {menu?.is_special && (
                <>
                    <h2>Specials List</h2>
                    <h3>{menu.week}</h3>
                    <ul>
                        { menu.specials.map((s, index) => (
                            <li key={index}>
                                {index + 1}. {s.sentence}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {error && (
                <>
                    <h2>Whoops, an error has occured:</h2>
                    <p>{error}</p>
                </>
            )}

        </div>
    )
}