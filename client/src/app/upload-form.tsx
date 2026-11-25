"use client";
import { Menu } from '../types/menu';
import { useState } from 'react'
import ReviewForm from './review-form';
import { CameraIcon } from 'lucide-react';


export default function UploadForm({ prevSpecials }: { prevSpecials: React.ReactNode} ) {

    const [menu, setMenu] = useState<Menu>();
    const [draft, setDraft] = useState<Menu>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>()
    const [previewURL, setPreviewURL] = useState<string>();
    const [file, setFile] = useState<File | null>(null);


    console.log("Component rendering...");


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentfile = e.target.files?.[0]

        if (!currentfile) return; //if user hits 'Cancel' then file is Undefined

        const objectURL = URL.createObjectURL(currentfile)
        setPreviewURL(objectURL);
        setFile(currentfile)
    }

    const handleClick = async () => {
        if (!file) return;
        const formData = new FormData()

        formData.append("photo", file)

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

    const reset = () => {
        setDraft(undefined)
        setFile(null)
        setMenu(undefined)
        setError(undefined)
        if (previewURL) {
            URL.revokeObjectURL(previewURL)
        }
    }


    return (
        //entire component
        <div className='flex flex-col justify-center w-full'>

            {/* Choose File & Submit Button field */}
            {!draft && (
                <div className='flex flex-col gap-8 lg:flex-row'>
                    <div className='flex-2 bg-surface rounded-2xl p-4'>
                        {!file ? (
                            <div className="flex flex-col gap-4 items-center">
                                <div className="p-4 rounded-full bg-burgundy-tint">
                                    <CameraIcon className='text-burgundy' />
                                </div>
                                <p className='text-xl font-bold'>Got a new specials sheet?</p>
                                <p className='max-w-xl text-center'>Upload a photo of your specials and we&apos;ll turn it into notes you can study before your shift.</p>
                                <label className='p-2 bg-burgundy text-white cursor-pointer'>
                                    Upload your specials
                                    <input type="file" name="photo" accept="image/png, image/jpeg" onChange={handleFileChange} className='sr-only' />
                                </label>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 lg:flex-row lg:h-96">
                                <div className="flex-1 flex items-center">
                                    <img src={previewURL} alt="Selected photo preview" />
                                </div>
                                <div className="flex-2 flex flex-col gap-y-2">
                                    <p>✔ Photo Ready</p>
                                    <p className='text-2xl font-bold'>Does this look right?</p>
                                    <p>Before we read it, check that: </p>
                                    <ul className='list-disc list-inside'>
                                        <li>The whole sheet is in the photo</li>
                                        <li>The dish names and prices are sharp, not blurry</li>
                                        <li>It&apos;s this week&apos;s sheet</li>
                                    </ul>
                                    <button onClick={handleClick} className="p-2 bg-burgundy rounded hover:bg-burgundy-dark text-white disabled:opacity-60 disabled:cursor-not-allowed" type="button" disabled={isLoading}>
                                        {!isLoading ? "Read my Specials" : "Loading your Specials..."}
                                    </button>
                                    <label className='p-2 border border-ink rounded cursor-pointer text-center'>
                                        Choose another photo
                                        <input type="file" name="photo" accept="image/png, image/jpeg" onChange={handleFileChange} className='sr-only' disabled={isLoading} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                    {prevSpecials}
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <>
                    <h2>Currently extracting text from photo...</h2>
                </>
            )}

            {/* entire menu object, including concerns */}
            {draft && (
                <ReviewForm draft={draft} setDraft={setDraft} reset={reset} />
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