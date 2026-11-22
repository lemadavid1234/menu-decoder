import NavLinks from "./nav-links"
import Link from 'next/link'
import { Suspense } from 'react'
import { CircleUserRoundIcon } from "lucide-react";

function NavLinksFallback() {
    return (
        <>
            <nav className="hidden md:flex gap-8 pt-4">
                <Link href="/" className="text-muted">HOME</Link>
                <Link href="/past-weeks" className="text-muted">PAST WEEKS</Link>
                <Link href="/account" className="text-muted">ACCOUNT</Link>
            </nav>
            <Link href="/account" className="p-2 md:hidden"><CircleUserRoundIcon className="h-5 w-5"/></Link>
        </>
    )
}


export default function Header() {
    return (
        <header className="bg-surface w-full flex flex-row justify-between md:flex-col items-center p-4">
            <div className="flex flex-col md:items-center">
                <p className="text-4xl font-vibes text-burgundy">Menu Decoder</p>
                <p className="text-xs text-burgundy tracking-widest">SPECIALS</p>
            </div>
            <Suspense fallback={<NavLinksFallback/>}>
                <NavLinks/>
            </Suspense>
        </header>
    )
}