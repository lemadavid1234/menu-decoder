export default async function PrevSpecials() {

    const getRecentMenu = async () => {
        const res = await fetch(`http://localhost:3001/menus?`,)
    }


    return (
        <div className="flex-1 flex flex-col md:flex-row bg-surface w-full rounded-2xl">
          <h2>THIS WEEK</h2>
        </div>
    )
}