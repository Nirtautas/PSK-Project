import { useState } from 'react'
import BoardViewButtons, { BoardViewTab } from '@/components/pages/BoardPage/BoardView/BoardViewButtons'
import TasksView from '@/components/pages/BoardPage/BoardView/TasksView'

import styles from './BoardView.module.scss'
import { Board, Task } from '@/types/types'
import BoardSettingsView from './BoardSettingsView'
import CollaboratorView from './CollaboratorsView'
import ArchivedTasksView from './ArchivedTasksView'

type Props = {
    boardId: number
    isLoading: boolean
    errorMsg: string
    tasks: Task[] | undefined
    onUpdate: (updatedBoard: Board) => void
    onCreate: (t: Task) => void
    onTaskUpdate: (t: Task) => void
    onTaskDelete: (t: Task) => void
    refetch: () => void
}

const BoardView = ({
    boardId,
    tasks,
    isLoading,
    errorMsg,
    onUpdate,
    onCreate,
    onTaskUpdate,
    onTaskDelete,
    refetch
}: Props) => {
    const [tab, setTab] = useState<BoardViewTab>('Tasks')

    const getView = () => {
        if (tab === 'Tasks') return (
            <TasksView
                boardId={boardId}
                tasks={tasks || []}
                errorMsg={errorMsg}
                isLoading={isLoading}
                onCreate={onCreate}
                onTaskUpdate={onTaskUpdate}
                onTaskDelete={onTaskDelete}
                refetch={refetch}
            />
        )
        
        if (tab === 'Collaborators') return <CollaboratorView boardId={boardId} isLoading={isLoading} errorMsg={errorMsg}/>

        if (tab === 'Archives') return <ArchivedTasksView boardId={boardId} onTaskUpdate={onTaskUpdate}/>
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
