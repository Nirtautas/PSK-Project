'use client'

import {Button, Paper} from '@mui/material'

export default function Home() {
    return (
        <Paper>
            <h1>Hello World!</h1>
            <Button onClick={() => console.log('Hello World!')}></Button>
        </Paper>
    )
}
