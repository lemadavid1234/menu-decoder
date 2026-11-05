"use client"

export default function ThemeToggle() {
    
    function toggle() {
        const isLight = document.documentElement.classList.toggle("light");
        localStorage.setItem("theme", isLight ? "light" : "dark");
    }

    return <button onClick={toggle}>Toggle theme</button>
}