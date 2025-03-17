import {Board} from '@/types/types'
import {Box} from '@mui/material'
import BoardCard from '@/components/pages/BoardsPage/BoardCard'

import styles from './BoardsView.module.scss'

type Props = {
    boards: Board[]
    isLoading: boolean
    errorMsg: string
}

const BoardsView = ({ boards, isLoading, errorMsg }: Props) => {

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (errorMsg) {
        return <div>{errorMsg}</div>
    }

    return (
        <div>
                {boards.map((board, index) => (

                    <div className={styles.card_wrapper}  key={index}>
                        <BoardCard name={board.name} description={board.description} imgUrl={board.imgUrl} />
                    </div>
                ))}
        </div>
    )
}

export default BoardsView
