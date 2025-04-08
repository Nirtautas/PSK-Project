'use client'

import BoardsPage from '@/components/pages/BoardsPage'
import NavBarLayout from '@/components/templates/NavBarLayout'
import { useSearchParams } from 'next/navigation'

const Page = () => {
    const searchParams = useSearchParams()
    const pageNum = Number(searchParams.get('pageNum')) || 0

    return ( 
        <NavBarLayout>
            <BoardsPage pageNum={pageNum} />
        </NavBarLayout>
    )
}

export default Page
