import { Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'
import TaskList from '@/components/pages/BoardPage/BoardView/TasksView/TaskList'
import { Task } from '@/types/types'
import { useEffect, useState } from 'react'
import TaskApi from '@/api/task.api'
import useDragAndDrop from '@/hooks/useDragAndDrop'

type Props = {
    tasks: Task[]
    isLoading: boolean
    errorMsg: string
}

type TaskColumn = {
    label: string
    id: string
    items: Task[]
}
const compareTaskColumnsByLabel = (column1: TaskColumn, column2: TaskColumn) => column2.label.localeCompare(column1.label)

const TasksView = ({ tasks, isLoading, errorMsg }: Props) => {
    useEffect(() => {
        setColumns([
            {
                label: 'Waiting',
                id: 'waiting',
                items: tasks
            },
            {
                label: 'In Progress',
                id: 'inProgress',
                items: []
            },
            {
                label: 'Done',
                id: 'done',
                items: []
            }
        ])
    }, [tasks])

    const [columns, setColumns] = useState<TaskColumn[]>([
        {
            label: 'Waiting',
            id: 'waiting',
            items: tasks
        },
        {
            label: 'In Progress',
            id: 'inProgress',
            items: []
        },
        {
            label: 'Done',
            id: 'done',
            items: []
        }
    ])

    const handleDrop = async (event: MouseEvent, droppedOn: Element | null, targetTask: Task) => {
        if (!droppedOn) {
            console.log('null dropped on')
            return
        }
        const targetColumn = columns.find(column => column.id === droppedOn.id)
        if (!targetColumn || !targetTask) {
            return
        }
        const newTask = { ...targetTask, status: targetColumn.id }
        await TaskApi.update(newTask)
        const newColumns: TaskColumn[] = [
            ...columns.filter((column) => column.id !== targetColumn.id)
                .map((column) => ({
                    ...column,
                    items: column.items
                })),
            { ...targetColumn, items: [...targetColumn.items, targetTask] }
        ].sort(compareTaskColumnsByLabel)
        setColumns(newColumns)
    }

    const {
        handleMouseDown
    } = useDragAndDrop<Task>({
        onDrop: handleDrop,
        dropTargets: {
            dropTargetsSelector: '.task_list_droppable'
        }
    })


    return (
        <Paper className={styles.container}>
            {
                columns.map((column, index) => (
                    <div className={[styles.tasks_list, 'task_list_droppable'].join(' ')} key={index} id={column.id}>
                        <div className={styles.label_wrapper}>
                            <Typography variant="h6" className={styles.label}>{column.label}</Typography>
                        </div>
                        <TaskList
                            id={column.id}
                            isLoading={isLoading}
                            tasks={column.items}
                            errorMsg={errorMsg}
                            onMouseDown={handleMouseDown}
                            onClick={() => {
                            }}
                        />
                    </div>
                ))
            }
        </Paper>
    )
}

export default TasksView
