import { connection } from "next/server";
import { Suspense } from "react";

interface TodaysDateProps {
    timeZone?: string;
}

async function TodaysDateText({ timeZone } : TodaysDateProps) {
    await connection()
    const formattedDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone
    });

    return (
        <p>{formattedDate}</p>
    )

}

export default function TodaysDate({ timeZone } : TodaysDateProps) {
    return (
        <Suspense fallback={<p>Loading today&apos;s date...</p>}>
            <TodaysDateText timeZone={timeZone}/>
        </Suspense>
    )
}