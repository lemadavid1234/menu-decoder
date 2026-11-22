"use client";
import { usePathname } from "next/navigation";
import { CircleUserRoundIcon } from "lucide-react";
import Link from 'next/link'


export default function NavLinks() {
    const pathname = usePathname()

    function isActive(href: string) {
        if (href === "/") {
            return pathname.startsWith("/analysis") || pathname === "/";
        }
        return href === pathname;
    }


    return (
        <>
            <nav className="hidden md:flex gap-8 pt-4">
                <Link href="/" className={isActive("/") ? "text-burgundy" : "text-muted"} aria-current={isActive("/") ? "page" : undefined}>HOME</Link>
                <Link href="/past-weeks" className={isActive("/past-weeks") ? "text-burgundy" : "text-muted"} aria-current={isActive("/past-weeks") ? "page" : undefined}>PAST WEEKS</Link>
                <Link href="/account" className={isActive("/account") ? "text-burgundy" : "text-muted"} aria-current={isActive("/account") ? "page" : undefined}>ACCOUNT</Link>
            </nav>
            <Link href="/account" className="p-2 md:hidden" aria-current={isActive("/account") ? "page" : undefined}><CircleUserRoundIcon className="h-5 w-5" /></Link>
        </>
    )
}