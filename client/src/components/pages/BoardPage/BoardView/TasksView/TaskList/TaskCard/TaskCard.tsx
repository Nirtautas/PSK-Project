import { Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Role, Task } from '@/types/types'

import styles from './TaskCard.module.scss'
import React from 'react'
import TaskCardInfoPopup from './TaskCardInfoPopup'
import { FetchResponse } from '@/types/fetch'
import DeadlineDisplay from './DeadlineDisplay'

type Props = {
    boardId: number,
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
    onTaskUpdate: (t: Task) => void
    userRole: FetchResponse<Role | null>
    onDelete: (t: Task) => void
}

const TaskCard = ({ boardId, onClick, task, onMouseDown, onTaskUpdate, userRole, onDelete }: Props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    return (
        <>
            <Card elevation={2} className={styles.task_card} onMouseDown={(e) => onMouseDown(e as unknown as MouseEvent, task)} onClick={handleOpen}>
                <CardActionArea onClick={onClick} className={styles.task_card_clickable}>
                    <div className={styles.task_card_content}>
                        <div className={styles.top_row}>
                            <div className={styles.title_box}>
                                {task.title}:
                            </div>
                            <div className={styles.image_box}>
                                {task.assignedUsers?.slice(0, 3).map(user => (
                                    <img key={user.id} width={25} height={25} src={user.imageURL ?? 'https://preview.colorkit.co/color/ff0000.png?static=true'} alt="image" />
                                ))}
                            </div>
                        </div>
                        <div className={styles.bottom_row}>
                            <DeadlineDisplay deadline={task.deadlineEnd}/>
                        </div>
                    </div>
                </CardActionArea>
            </Card>
            <TaskCardInfoPopup boardId={boardId} open={open} setOpen={setOpen} task={task} handleUpdate={onTaskUpdate} userRole={userRole} onDelete={onDelete}/>
        </>
    )
}

export default TaskCard
