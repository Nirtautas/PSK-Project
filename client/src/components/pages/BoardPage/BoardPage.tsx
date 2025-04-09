'use client'

import { Box, Skeleton, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'
import { useState } from 'react'

type Props = {
    boardId: number
}

const BoardPage = ({ boardId }: Props) => {
    const [refreshKey, setRefreshKey] = useState(0);
    
    const {
        data: board,
        errorMsg,
        isLoading
    } = useFetch({ resolver: () => BoardApi.getBoardById(boardId), deps: [refreshKey] })

    const refreshTasks = () => setRefreshKey(prev => prev + 1)

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">{ !isLoading ? board?.name || '' : <Skeleton sx={{ width: '10em' }} />}</Typography>
            </Box>
            <div className={styles.board_view_container}>
                <BoardView boardId={boardId} tasks={board?.tasks || []} errorMsg={errorMsg} isLoading={isLoading} handleRefresh={refreshTasks}/>
            </div>
        </div>
    )
}

export default BoardPage
