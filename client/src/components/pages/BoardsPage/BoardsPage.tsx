'use client'

import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import BoardApi, { CreateBoardDto } from '@/api/board.api'
import BoardsView from '@/components/pages/BoardsPage/BoardsView/BoardsView'

import styles from './BoardsPage.module.scss'
import { Board } from '../../../types/types'
import { useRouter } from 'next/navigation'
import { GetPageUrl } from '../../../constants/route'
import PageChanger from '../../shared/PageChanger'
import BoardManagementModal from './BoardManagemenModal/BoardManagementModal'
import usePagedFetch from '@/hooks/usePagedFetch'

type Props = {
    pageNum: number
}

const BoardsPage = ({ pageNum }: Props) => {
    const router = useRouter()

    const {
        data,
        isLoading,
        errorMsg,
        pageCount,
        refetch
    } = usePagedFetch<Board>({
        resolver: () => BoardApi.getBoards(pageNum)
    })

    console.log(data)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const isLastPage = data ? pageNum >= pageCount - 1 : false

    const handleBoardCreate = async ({ title, description, imageURL }: CreateBoardDto) => {
        const response = await BoardApi.createBoard({
            title,
            description,
            imageURL
        })
        setIsModalOpen(false)
        if (!response.result) {
            console.error('Failed to create board.')
            return
        }
        refetch()
    }

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
                mode="create"
            />
            <BoardsView boards={data} isLoading={isLoading} errorMsg={errorMsg} />
            <PageChanger
                onClickNext={() => router.push(GetPageUrl.boards(pageNum + 1))}
                onClickPrevious={() => router.push(GetPageUrl.boards(pageNum - 1))}
                disabledPrevious={pageNum <= 0}
                disabledNext={isLastPage}
                pageNumber={pageNum}
                totalPages={pageCount}
            />
        </div>
    )
}

export default BoardsPage
