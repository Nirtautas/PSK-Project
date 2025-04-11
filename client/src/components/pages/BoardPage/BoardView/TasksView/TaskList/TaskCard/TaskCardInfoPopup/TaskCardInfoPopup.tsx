import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React, { use, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import DeadlineDescriptionView from './DeadlineDescriptionView';
import CommentsView from './CommentsView';
import AssignedUsersView from './AssignedUsersView';
import { Task } from '@/types/types';
import TaskApi from '@/api/task.api';
import { Comment } from '@/types/types';
import CommentApi from '@/api/comment.api';

export default function TaskCardInfoPopup({
    open,
    setOpen,
    task
}: {
    open: boolean, 
    setOpen: (open: boolean) => void,
    task: Task
}) {
    const [comments, setComments] = React.useState<Comment[]>([]);
    const handleClose = () => setOpen(false);

    useEffect(() => {
            CommentApi.createComment(1, 'test', 1);
            // CommentApi.getAllBoardTaskComments(1, 1);
            // CommentApi.deleteComment(1, 1, 1);
            
            TaskApi.getCommentsByTask(1).then((comments) => {
                setComments(comments);
            }).catch((error) => {
                console.error("Failed to fetch comments:", error);
            });
        }, [open]);
    
    //TODO: move this to a separate file
    const modalContainer = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    };
    const topRow = {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        padding: 2, 
        height: 100, 
        alignItems: 'center'
    };

    //TODO: handle edit and delete buttons
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalContainer}>
                <Box sx={topRow}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ flexGrow: 1 }}>
                        {task.title}
                    </Typography>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Edit
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Close
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ width: '100%', height: '100%', padding: 1}}>
                    <Grid container spacing={2} sx={{width: '100%', height: '100%', padding: 2}} >
                        <Grid size={8} sx={{height: '100%'}}>
                            <Stack spacing={2} sx={{height: '100%'}}>
                                <DeadlineDescriptionView deadline={task.deadline} description={task.description}/>
                                <CommentsView comments={comments} taskId={task.id}/>
                            </Stack>
                        </Grid>
                        <Grid size={0.1}>
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid size={3}>
                            <AssignedUsersView users={task.assignedUsers}/>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    )
}