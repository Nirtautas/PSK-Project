'use client'

import { useState } from 'react'
import BoardViewButtons, { BoardViewTab } from '@/components/pages/BoardPage/BoardView/BoardViewButtons'
import TasksView from '@/components/pages/BoardPage/BoardView/TasksView'

import styles from './BoardView.module.scss'
import { Board, Task } from '@/types/types'
import BoardSettingsView from './BoardSettingsView'
import { FetchResponse } from '../../../../types/fetch'

type Props = {
    boardId: number
    isLoading: boolean
    errorMsg: string
    tasks: Task[] | undefined
    onUpdate: (updatedBoard: FetchResponse<Board>) => void
    onCreate: (t: Task) => void
    onTaskUpdate: (t: Task) => void
}

const BoardView = ({ boardId, tasks, isLoading, errorMsg, onUpdate, onCreate, onTaskUpdate }: Props) => {
    const [tab, setTab] = useState<BoardViewTab>('Tasks')

    const getView = () => {
        if (tab === 'Tasks') return <TasksView boardId={boardId} tasks={tasks || []} errorMsg={errorMsg} isLoading={isLoading} onCreate={onCreate} onTaskUpdate={onTaskUpdate} />
        if (tab === 'Collaborators') return <div>Collaborators</div>
        if (tab === 'Archives') return <div>Archives</div>
        return <BoardSettingsView boardId={boardId} errorMsg={errorMsg} isLoading={isLoading} onUpdate={onUpdate} />
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