'use client'

import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import BoardApi from '@/api/board.api'
import BoardsView from '@/components/pages/BoardsPage/BoardsView/BoardsView'

import styles from './BoardsPage.module.scss'
import { useCallback } from 'react'
import { useBoards } from '../../../hooks/boards.hook'
import usePagedFetch from '../../../hooks/usePagedFetch'
import { Board } from '../../../types/types'

type Props = {
    pageNum: number
}

const BoardsPage = ({ pageNum }: Props) => {
    const fetchBoards = useCallback(() => {
        return BoardApi.getBoards(pageNum)
    }, [pageNum])

    const {
        data,
        setData,
        isLoading,
        errorMsg
    } = usePagedFetch<Board>({
        resolver: () => BoardApi.getBoards(pageNum),
        pageNum: pageNum,
        resultKey: 'boards'
    })

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    console.log(data?.results)

    /*
    const handleBoardCreate = ({ boardName, image, description}: CreateBoardArgs)=> {
        BoardApi.createBoard({
            name: boardName, description, imageFile: image || undefined,
            tasks: null
        }).then((board) => {
            setBoards([...boards, board])
        })
        setIsModalOpen(false)
    }
    */

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">Your Boards</Typography>
                <Button variant="contained" className={styles.create_button} onClick={() => setIsModalOpen(true)}>Create new</Button>
            </Box>
            <BoardsView boards={data?.results} isLoading={isLoading} errorMsg={errorMsg} />

        </div>
    )
}
/*
<BoardManagementModal
    open={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleBoardCreate}
/>
*/

export default BoardsPage
