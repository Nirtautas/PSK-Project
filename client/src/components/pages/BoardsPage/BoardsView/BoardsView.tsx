import {Board} from '@/types/types'
import BoardCard from '@/components/pages/BoardsPage/BoardCard'
import {useRouter} from 'next/navigation'

import styles from './BoardsView.module.scss'
import {getPageUrl} from '@/constants/urls'
import {Badge} from '@mui/material'

type Props = {
    boards: Board[]
    isLoading: boolean
    errorMsg: string
}

const BoardsView = ({ boards, isLoading, errorMsg }: Props) => {
    const router = useRouter()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (errorMsg) {
        return <div>{errorMsg}</div>
    }

    return (
        <div>
            {boards.map((board, index) => (
                <div className={styles.card_wrapper} key={index}>
                    <BoardCard
                        name={board.name}
                        description={board.description}
                        imgUrl={board.imgUrl}
                        onClick={() => router.push(getPageUrl.board(board.id))}
                    />
                </div>
            ))}
        </div>
    )
}

export default BoardsView
