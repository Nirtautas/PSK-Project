import { Box, Button, Modal, Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'
import TaskList from '@/components/pages/BoardPage/BoardView/TasksView/TaskList'
import { StatusString, Task } from '@/types/types'
import { useEffect, useState } from 'react'
import TaskApi from '@/api/task.api'
import useDragAndDrop from '@/hooks/useDragAndDrop'
import React from 'react'
import CreateTaskForm from './CreateTaskForm'
import { Padding } from '@mui/icons-material'

type Props = {
    boardId: number
    tasks: Task[]
    isLoading: boolean
    errorMsg: string
    handleRefresh: () => void
}

type TaskColumn = {
    label: string
    id: string
    items: Task[]
}

const compareTaskColumnsByLabel = (column1: TaskColumn, column2: TaskColumn) => column2.label.localeCompare(column1.label)

const TasksView = ({ boardId, tasks, isLoading, errorMsg, handleRefresh }: Props) => {
    const [columns, setColumns] = useState<TaskColumn[]>([])
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    useEffect(() => {
        //TODO: tasks should be sorted by status when loading in
        setColumns([
            {
                label: 'Waiting',
                id: 'Waiting',
                items: tasks
            },
            {
                label: 'In Progress',
                id: 'In progress',
                items: []
            },
            {
                label: 'Done',
                id: 'Done',
                items: []
            }
        ])
    }, [tasks])


    const handleDrop = async (event: MouseEvent, droppedOn: Element | null, targetTask: Task) => {
        if (!droppedOn) {
            console.log('null dropped on')
            return
        }
        const targetColumn = columns.find(column => column.id === droppedOn.id)
        if (!targetColumn || !targetTask) {
            return
        }
        const newTask = { ...targetTask, status: targetColumn.id as StatusString }
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
            <Button onClick={handleOpen} sx={{margin: 1}}>Create new task</Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Create a task
                    </Typography>
                    <CreateTaskForm handleClose={handleClose} boardId={boardId} handleRefresh={handleRefresh} />
                </Box>
            </Modal>
            <Box className={styles.tasks_container}>
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
                            />
                    </div>
                ))
            }
            </Box>
        </Paper>
    )
}

export default TasksView
