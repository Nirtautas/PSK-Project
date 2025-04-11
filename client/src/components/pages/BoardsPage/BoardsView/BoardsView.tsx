import { Board } from '@/types/types'
import BoardCard from '@/components/pages/BoardsPage/BoardCard'
import { useRouter } from 'next/navigation'

import styles from './BoardsView.module.scss'
import { getPageUrl } from '@/constants/urls'

type Props = {
    boards: Board[] | undefined
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
                        <BoardCard
                            name={''}
                            description={''}
                            imgUrl={''}
                            onClick={() => {
                            }}
                            isLoading={true}
                        />
                    </div>
                ))}
            </div>
        )
    }

    if (errorMsg) {
        return <div>{errorMsg}</div>
    }

    return (
        <div>
            {boards?.map((board, index) => (
                <div className={styles.card_wrapper} key={index}>
                    <BoardCard
                        name={board.title}
                        description={board.description}
                        imgUrl={board.imageURL ?? undefined}
                        onClick={() => router.push(getPageUrl.board(board.id))}
                        isLoading={false}
                    />
                </div>
            ))}
        </div>
    )
}

export default BoardsView
