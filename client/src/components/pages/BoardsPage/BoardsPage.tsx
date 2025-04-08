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
import router, { useRouter } from 'next/navigation'
import { GetPageUrl } from '../../../constants/route'
import PageChanger from '../../shared/PageChanger'
import image from 'next/image'
import BoardManagementModal, { CreateBoardArgs } from './BoardManagemenModal/BoardManagementModal'

type Props = {
    pageNum: number
}

const BoardsPage = ({ pageNum }: Props) => {
    const router = useRouter()

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

    const handleBoardCreate = ({ title, description, imageURL}: CreateBoardArgs)=> {
        BoardApi.createBoard({
            title: title,
            description: description,
            imageURL: imageURL
        })
        setIsModalOpen(false)
    }

    const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0
    const isLastPage = data ? pageNum >= totalPages - 1 : false

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">Your Boards</Typography>
                <Button variant="contained" className={styles.create_button} onClick={() => setIsModalOpen(true)}>Create new</Button>
            </Box>
            <BoardManagementModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleBoardCreate}
            />
            <BoardsView boards={data?.results} isLoading={isLoading} errorMsg={errorMsg} />
            <PageChanger
                onClickNext={() => router.push(GetPageUrl.boards(pageNum + 1))}
                onClickPrevious={() => router.push(GetPageUrl.boards(pageNum - 1))}
                disabledPrevious={pageNum <= 0}
                disabledNext={isLastPage}
                pageNumber={pageNum}
            />
        </div>
    )
}

export default BoardsPage
