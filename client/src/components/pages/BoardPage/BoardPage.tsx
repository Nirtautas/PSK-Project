'use client'

import { Box, Button, Skeleton, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'

type Props = {
    boardId: number
}

const BoardPage = ({ boardId }: Props) => {
    const {
        data: board,
        isLoading
    } = useFetch({ resolver: () => BoardApi.getBoardById(boardId), delayMs: 1000 })

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">{ !isLoading ? board?.name || '' : <Skeleton sx={{ width: '10em' }} />}</Typography>
            </Box>
            <div className={styles.board_view_container}>
                <BoardView />
            </div>
        </div>
    )
}

export default BoardPage
