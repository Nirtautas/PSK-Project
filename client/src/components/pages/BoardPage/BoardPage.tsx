'use client'

import { Box, Skeleton, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'

type Props = {
    boardId: number
}

const BoardPage = ({ boardId }: Props) => {
    const {
        data,
        errorMsg,
        isLoading
    } = useFetch({
        resolver: () => BoardApi.getBoardById(boardId), delayMs: 1000
    })

    //Fetch board tasks with separate api call.

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <img src={data?.result?.imageURL ?? undefined} alt="Board Image" className={styles.board_image} />
                <Typography variant="h3" className={styles.board_title}>
                    {!isLoading ? data?.result?.title || '' : <Skeleton sx={{ width: '10em' }} />}
                </Typography>
            </Box>
            <div className={styles.board_view_container}>
                <BoardView boardId={boardId} tasks={[]} errorMsg={errorMsg} isLoading={isLoading}/>
            </div>
        </div>
    )
}

export default BoardPage
