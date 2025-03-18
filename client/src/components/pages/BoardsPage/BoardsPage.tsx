'use client'

import NavBarLayout from '@/components/templates/NavBarLayout'
import { Box, Button, Typography } from '@mui/material'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'
import BoardsView from '@/components/pages/BoardsPage/BoardsView/BoardsView'

import styles from './BoardsPage.module.scss'
import { useState } from 'react'
import BoardManagementModal from '@/components/pages/BoardsPage/BoardManagemenModal'

const BoardsPage = () => {
    const {
        data: boards,
        setData: setBoards,
        isLoading,
        errorMsg
    } = useFetch({
        resolver: () => BoardApi.getBoards()
    })
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    return (
        <NavBarLayout>
            <Box className={styles.toolbar}>
                <Typography variant="h3">Your Boards</Typography>
                <Button variant="contained" className={styles.create_button} onClick={() => setIsModalOpen(true)}>Create new</Button>
            </Box>
            <BoardsView boards={boards} isLoading={isLoading} errorMsg={errorMsg} />
            <BoardManagementModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(...args) => console.log(args)}
            />
        </NavBarLayout>
    )
}

export default BoardsPage
