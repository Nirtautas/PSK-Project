'use client'

import LandingPage from '@/components/pages/LandingPage'
import GuestNavBarLayout from '@/components/templates/GuestNavBarLayout'
import {Button, Paper} from '@mui/material'

export default function Home() {
    return (
        <GuestNavBarLayout>
            <LandingPage />
        </GuestNavBarLayout>
    )
}
