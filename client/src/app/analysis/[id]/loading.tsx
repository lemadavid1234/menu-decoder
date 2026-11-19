
export default function Loading() {
    return (
        <>
            <div className='flex flex-col items-center p-4'>

                <div className="text-center">
                    <h1 className="text-3xl lg:text-5xl font-bold">{"THIS WEEK'S SPECIALS"}</h1>
                    <p className="text-sm text-muted">Week of MM-DD-YY · 00 specials</p>
                    <p className="text-sm text-muted">
                        <span className="lg:hidden">Tap</span>
                        <span className="hidden lg:inline">Click</span>
                        {" "}a card for allergens, wine pairings and more.
                    </p>
                </div>


            </div>
        </>
    )
}
