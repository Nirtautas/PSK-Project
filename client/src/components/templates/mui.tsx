'use client'

import {createTheme, ThemeProvider} from '@mui/material'
import React, {useEffect, useState} from 'react'

const useDarkTheme = () => {
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

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
    const isDarkTheme = useDarkTheme()

    console.log(isDarkTheme)

    const darkTheme = createTheme({
        palette: {
            mode: 'dark'
        }
    })
    const defaultTheme = createTheme({})

    return (
        <ThemeProvider theme={isDarkTheme ? darkTheme : defaultTheme}>
            {children}
        </ThemeProvider>
    )
}
