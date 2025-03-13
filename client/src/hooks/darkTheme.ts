import {useEffect, useState} from 'react'

export const useDarkTheme = () => {
    const [darkTheme, setDarkTheme] = useState<boolean>(false)

    const detectTheme = (e: MediaQueryListEvent) => {
        setDarkTheme(e.matches)
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setDarkTheme(mediaQuery.matches)

        mediaQuery.addEventListener('change', detectTheme)

        return () => mediaQuery.removeEventListener('change', detectTheme)
    }, [])

    return darkTheme
}
