import { Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Task } from '@/types/types'

import styles from './TaskCard.module.scss'
import React from 'react'

type Props = {
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
}

const TaskCard = ({ onClick, task, onMouseDown }: Props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const style = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflowY: 'auto'
    };

    return (
        <>
            <Card elevation={2} className={styles.task_card} onMouseDown={(e) => onMouseDown(e as unknown as MouseEvent, task)} onClick={handleOpen}>
                <CardActionArea
                    onClick={onClick}
                    sx={{
                        display: 'flex',
                        height: '100%'
                    }}
                >
                    <span>
                        {task.title}
                    </span>
                </CardActionArea>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        edit a task
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        wtv the inputs should be
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default TaskCard
