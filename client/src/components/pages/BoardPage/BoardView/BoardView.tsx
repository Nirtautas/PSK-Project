'use client'

import { useState } from 'react'
import BoardViewButtons, { BoardViewTab } from '@/components/pages/BoardPage/BoardView/BoardViewButtons'
import TasksView from '@/components/pages/BoardPage/BoardView/TasksView'

import styles from './BoardView.module.scss'
import { Task } from '@/types/types'

type Props = {
    boardId: number
    isLoading: boolean
    errorMsg: string
    tasks: Task[] | undefined
}

const BoardView = ({ boardId, tasks, isLoading, errorMsg }: Props) => {
    const [tab, setTab] = useState<BoardViewTab>('Tasks')

    const getView = () => {
        if (tab === 'Tasks') return <TasksView boardId={boardId} tasks={tasks || []} errorMsg={errorMsg} isLoading={isLoading} />
        if (tab === 'Collaborators') return <div>Collaborators</div>
        if (tab === 'Archives') return <div>Archives</div>
        return <div>Settings</div>
    }

    return (
        <div className={styles.wrapper}>
            <BoardViewButtons current={tab} onClick={(tab) => setTab(tab)} />
            <div className={styles.view_wrapper}>
                {getView()}
            </div>
        </div>
    )
}

export default BoardView
