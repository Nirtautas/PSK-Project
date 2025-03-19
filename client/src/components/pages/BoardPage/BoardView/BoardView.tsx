'use client'

import { useState } from 'react'
import BoardViewButtons, { BoardViewTab } from '@/components/pages/BoardPage/BoardView/BoardViewButtons'
import TasksView from '@/components/pages/BoardPage/BoardView/TasksView'

import styles from './BoardView.module.scss'

const BoardView = () => {
    const [tab, setTab] = useState<BoardViewTab>('Tasks')

    return (
        <div className={styles.wrapper}>
            <BoardViewButtons current={tab} onClick={(tab) => setTab(tab)} />
            <div className={styles.view_wrapper}>
                <TasksView />
            </div>
        </div>
    )
}

export default BoardView
