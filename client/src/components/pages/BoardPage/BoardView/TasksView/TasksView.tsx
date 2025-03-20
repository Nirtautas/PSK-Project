
import { Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'
import TaskList from '@/components/pages/BoardPage/BoardView/TasksView/TaskList'
import { Task } from '@/types/types'
import { useEffect, useState } from 'react'
import TaskApi from '@/api/task.api'

type Props = {
    tasks: Task[]
    isLoading: boolean
    errorMsg: string
}

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

    const [columns, setColumns] = useState<{ label: string, items: Task[], id: string }[]>([
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

    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [targetTask, setTargetTask] = useState<Task | null>(null)
    const handleMouseDown = (task: Task, e: MouseEvent) => {
        const target = (e.currentTarget as HTMLButtonElement)
        setTargetTask(task)
        const width = target.clientWidth
        const height = target.clientHeight

        setTarget(target)

        target.style.position = 'absolute'
        target.style.left = `${e.x}px`
        target.style.top = `${e.y}px`
        target.style.zIndex = '10'
        target.style.width = `${width}px`
        target.style.height = `${height}px`
    }
    const handleMouseUp = async (e: MouseEvent) => {
        if (!targetTask) return
        const a = document.querySelectorAll('.task_list_droppable')
        let tList: Element
        a.forEach((dropBox) => {
            const rect = dropBox.getBoundingClientRect()
            if (e.clientX > rect.x && e.clientX < rect.x + rect.width) {
                tList = dropBox
            }
        })
        const targetColumn = columns.find(column => column.id === tList.id)
        if (!targetColumn || !targetTask) {
            setTargetTask(null)
            target?.remove()
            setTarget(null)
            return
        }
        try {
            const newTask = { ...targetTask, status: targetColumn.id }
            await TaskApi.update(newTask)
            setColumns([
                ...columns.filter((column) => column.id !== targetColumn.id).map((column) => ({
                    ...column,
                    items: column.items
                })),
                { ...targetColumn, items: [...targetColumn.items, targetTask] }
            ].sort((a, b) => b.label.localeCompare(a.label)))
        } catch (err) {
            console.error(err as Error)
        } finally {
            setTargetTask(null)
            target?.remove()
            setTarget(null)
        }
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (target) {
                target.style.transform = 'translate(-50%, -50%)'
                target.style.left = `${e.clientX}px`
                target.style.top = `${e.clientY}px`
            }
        }
        const upHandler = (e: MouseEvent) => {
            handleMouseUp(e)
        }
        document.addEventListener('mouseup', upHandler)
        document.addEventListener('mousemove', handleMouseMove)
        return () => {
            document.removeEventListener('mouseup', upHandler)
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [target])



    return (
        <Paper className={styles.container}>
            {
                columns.map((column, index) => (
                    <div className={[styles.tasks_list, 'task_list_droppable'].join(' ')} key={index} id={column.id}>
                        <div className={styles.label_wrapper}>
                            <Typography variant="h6" className={styles.label}>{column.label}</Typography>
                        </div>
                        <TaskList id={column.id} isLoading={isLoading} tasks={column.items} errorMsg={errorMsg} onMouseDown={handleMouseDown} onClick={() => {}}/>
                    </div>
                ))
            }
        </Paper>
    )
}

export default TasksView
