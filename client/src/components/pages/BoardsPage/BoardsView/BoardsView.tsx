import { Board } from '@/types/types'
import BoardCard from '@/components/pages/BoardsPage/BoardCard'
import { useRouter } from 'next/navigation'

import styles from './BoardsView.module.scss'
import { getPageUrl } from '@/constants/urls'
import ErrorDisplay from '@/components/shared/ErrorDisplay'

type Props = {
    boards: Board[]
    isLoading: boolean
    errorMsg: string
}

const BoardsView = ({ boards, isLoading, errorMsg }: Props) => {
    const router = useRouter()

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div className={styles.card_wrapper} key={index}>
                        <BoardCard isLoading/>
                    </div>
                ))}
            </div>
        )
    }

    if (errorMsg) {
        return <ErrorDisplay msg={errorMsg}/>
    }

    return (
        <div>
            {boards.map((board, index) => (
                <div className={styles.card_wrapper} key={index}>
                    <BoardCard
                        name={board.title}
                        description={board.description}
                        imgUrl={board.imageURL}
                        onClick={() => router.push(getPageUrl.board(board.id))}
                        isLoading={false}
                    />
                </div>
            ))}
        </div>
    )
}

export default BoardsView
