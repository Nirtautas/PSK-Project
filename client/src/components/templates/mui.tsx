'use client'

import {createTheme, ThemeProvider} from '@mui/material'
import React from 'react'
import {useDarkTheme} from '@/hooks/darkTheme'

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
    const isDarkTheme = useDarkTheme()

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
