'use client'

import NavBarLayout from '@/components/templates/NavBarLayout'
import {Box, Typography} from '@mui/material'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'
import BoardsView from '@/components/pages/BoardsPage/BoardsView/BoardsView'

const BoardsPage = () => {
    const {
        data: boards,
        setData: setBoards,
        isLoading,
        errorMsg
    } = useFetch({
        resolver: () => BoardApi.getBoards()
    })

    return (
        <NavBarLayout>
            <Box>
                <Typography variant="h3">Your Boards</Typography>
            </Box>
            <BoardsView boards={boards} isLoading={isLoading} errorMsg={errorMsg} />
        </NavBarLayout>
    )
}

export default BoardsPage
