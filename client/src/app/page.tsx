import UploadForm from "./upload-form";
import TodaysDate from "./components/todays-date";
import PrevSpecials from "./prev-specials";
import PrevSpecialsSkeleton from "./prev-specials-skeleton";
import { Suspense } from "react"


export default function Home() {
  return (
    <div className="flex flex-col gap-4 self-center items-center justify-center max-w-6xl w-full p-4">
      <h1 className="text-3xl lg:text-5xl text-center font-bold">THIS WEEK&apos;S SPECIALS</h1>
      <TodaysDate timeZone="America/New_York" />
      <UploadForm
        prevSpecials={
          <Suspense fallback={<PrevSpecialsSkeleton/>}>
            <PrevSpecials />
          </Suspense>}
      />

    </div>
  );
}
