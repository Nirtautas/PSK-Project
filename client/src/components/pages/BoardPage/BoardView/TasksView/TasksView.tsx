'use client'

import { Box, Button, Modal, Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'
import TaskList from '@/components/pages/BoardPage/BoardView/TasksView/TaskList'
import { Role, Task, TaskStatus } from '@/types/types'
import { useEffect, useState } from 'react'
import TaskApi, { UpdateTaskDto } from '@/api/task.api'
import useDragAndDrop, { DragAndDropReleaseArgs } from '@/hooks/useDragAndDrop'
import React from 'react'
import CreateTaskForm from './CreateTaskForm'
import { getUserId } from '@/utils/userId'
import BoardOnUserApi from '@/api/boardOnUser.api'
import useFetch from '@/hooks/useFetch'
import { useMessagePopup } from '@/components/shared/MessagePopup/MessagePopupProvider'

type Props = {
    boardId: number
    tasks: Task[]
    isLoading: boolean
    errorMsg: string
    onCreate: (t: Task) => void
    onTaskUpdate: (t: Task) => void
    onTaskDelete: (t: Task) => void
    refetch?: () => void
}

type TaskColumn = {
    label: string
    id: string
    enumId: TaskStatus
    items: Task[]
}

const compareTaskColumnsByLabel = (column1: TaskColumn, column2: TaskColumn) => column2.label.localeCompare(column1.label)

const TasksView = ({
    boardId,
    tasks,
    isLoading,
    errorMsg,
    onCreate,
    onTaskUpdate,
    onTaskDelete,
    refetch
}: Props) => {
    const [columns, setColumns] = useState<TaskColumn[]>([])
    const [userId, setUserId] = useState<number | null>(null)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { displayError } = useMessagePopup()

    useEffect(() => {
        const userId = getUserId()
        setUserId(userId)
    }, []);

    const userRole = useFetch({ resolver: () => BoardOnUserApi.getUserRole(boardId, userId), deps: [userId] })

    useEffect(() => {
        setColumns([
            {
                label: 'Pending',
                id: 'Pending',
                enumId: TaskStatus.PENDING,
                items: tasks.filter(task => task.taskStatus === TaskStatus.PENDING)
            },
            {
                label: 'In Progress',
                id: 'In_Progress',
                enumId: TaskStatus.IN_PROGRESS,
                items: tasks.filter(task => task.taskStatus === TaskStatus.IN_PROGRESS)
            },
            {
                label: 'Completed',
                id: 'Completed',
                enumId: TaskStatus.COMPLETED,
                items: tasks.filter(task => task.taskStatus === TaskStatus.COMPLETED)
            }
        ])
    }, [tasks])

    const handleDrop = async (event: MouseEvent, droppedOn: Element | null, targetTask: Task, targetElement: HTMLElement): Promise<DragAndDropReleaseArgs> => {
        if (!droppedOn) {
            return {}
        }
        const targetColumn = columns.find(column => column.id === droppedOn.id)
        if (!targetColumn || !targetTask) {
            return {}
        }
        const updateDto: UpdateTaskDto = {
            title: targetTask.title,
            description: targetTask.description,
            deadlineEnd: targetTask.deadlineEnd,
            taskStatus: targetColumn.enumId,
            version: targetTask.version
        }
        const response = await TaskApi.update(targetTask.boardId, targetTask.id, updateDto)
        if (!response.result) {
            displayError(`${response.error} Reloading page data...`)
            refetch?.()
            
            return {
                shouldReset: true
            }
        }
        targetTask.version = response.result.version
        const newColumns: TaskColumn[] = [
            ...columns.filter((column) => column.id !== targetColumn.id)
                .map((column) => ({
                    ...column,
                    items: column.items
                })),
            { ...targetColumn, items: [...targetColumn.items, targetTask] }
        ].sort(compareTaskColumnsByLabel)
        setColumns(newColumns)
        return {}
    }

    const {
        handleMouseDown
    } = useDragAndDrop<Task>({
        onDrop: handleDrop,
        dropTargets: {
            dropTargetsSelector: '.task_list_droppable'
        }
    })

    //TODO: move this to a separate file
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Paper className={styles.container}>
            { userRole && userRole.data !== Role.VIEWER && (
                <>
                    <Button onClick={handleOpen} sx={{margin: 1}}>Create new task</Button>
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Create a task
                            </Typography>
                            <CreateTaskForm handleClose={handleClose} boardId={boardId} onCreate={onCreate} />
                        </Box>
                    </Modal>
                </>
            )}
            <Box className={styles.tasks_container}>
            {
                columns.map((column, index) => (
                    <div className={[styles.tasks_list, 'task_list_droppable'].join(' ')} key={index} id={column.id}>
                        <div className={styles.label_wrapper}>
                            <Typography variant="h6" className={styles.label}>{column.label}</Typography>
                        </div>
                        <TaskList
                            boardId={boardId}
                            id={column.id}
                            isLoading={isLoading || userRole.isLoading}
                            tasks={column.items}
                            errorMsg={errorMsg}
                            onMouseDown={handleMouseDown}
                            onTaskUpdate={onTaskUpdate}
                            userRole={userRole.data}
                            onDelete={onTaskDelete}
                            />
                    </div>
                ))
            }
            </Box>
        </Paper>
    )
}

export default TasksView
